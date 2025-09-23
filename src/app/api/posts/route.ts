import { createClient } from '@/utils/supabase/server';  // Async server client
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch posts:', {
      userId: user.id,
      error: error.message
    });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Log successful fetch
  console.info('Posts fetched successfully:', {
    userId: user.id,
    postCount: data?.length || 0
  });

  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const formData = await request.formData();
    const beforeFile = formData.get('before') as File | null;
    const afterFile = formData.get('after') as File | null;
    const caption = formData.get('caption') as string | null;
  
    if (!beforeFile || !afterFile) {
      return NextResponse.json({ error: 'Missing before or after image' }, { status: 400 });
    }
  
    // Upload before image
    const beforePath = `${user.id}/before-${Date.now()}-${beforeFile.name}`;
    const { error: beforeError } = await supabase.storage
      .from('images')
      .upload(beforePath, beforeFile);

    if (beforeError) {
      return NextResponse.json({ error: beforeError.message }, { status: 500 });
    }
    const { data: beforeUrlData } = supabase.storage.from('images').getPublicUrl(beforePath);
    const beforeUrl = beforeUrlData.publicUrl;

    // Upload after image (repeat pattern)
    const afterPath = `${user.id}/after-${Date.now()}-${afterFile.name}`;
    const { error: afterError } = await supabase.storage
      .from('images')
      .upload(afterPath, afterFile);
  
    if (afterError) {
      return NextResponse.json({ error: afterError.message }, { status: 500 });
    }
    const { data: afterUrlData } = supabase.storage.from('images').getPublicUrl(afterPath);
    const afterUrl = afterUrlData.publicUrl;
  
    // Insert to DB
    const { error: insertError } = await supabase.from('posts').insert({
      user_id: user.id,
      before_image_url: beforeUrl,
      after_image_url: afterUrl,
      caption,
    });
  
    if (insertError) {
      console.error('Failed to create post in database:', {
        userId: user.id,
        error: insertError.message
      });
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Log successful post creation
    console.info('Post created successfully:', {
      userId: user.id,
      beforeImage: beforePath,
      afterImage: afterPath,
      hasCaption: !!caption
    });

    return NextResponse.json({ message: 'Post created successfully' }, { status: 201 });
  }

  export async function DELETE(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const url = new URL(request.url);
    const postId = url.searchParams.get('id');
  
    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
  
    try {
      // Fetch post with minimal fields
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('id, before_image_url, after_image_url')
        .eq('id', postId)
        .eq('user_id', user.id)
        .single();

      if (fetchError || !post) {
        console.error('Post deletion failed - post not found or fetch error:', {
          postId,
          userId: user.id,
          error: fetchError?.message,
          hasPost: !!post
        });
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }

      // Extract storage paths
      const beforePath = post.before_image_url.replace(/^https:\/\/[^/]+\/storage\/v1\/object\/public\/images\//, '');
      const afterPath = post.after_image_url.replace(/^https:\/\/[^/]+\/storage\/v1\/object\/public\/images\//, '');
  
      // Delete images from storage
      const filesToDelete = [beforePath, afterPath].filter(Boolean); // Remove undefined
      if (filesToDelete.length > 0) {
        const { error: storageError } = await supabase.storage
          .from('images')
          .remove(filesToDelete);
        if (storageError) {
          console.warn('Storage deletion failed, proceeding with DB delete:', {
            postId,
            userId: user.id,
            filesToDelete,
            error: storageError.message
          });
        }
      }

      // Delete from database
      const { data, error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);

      if (deleteError) {
        console.error('Database deletion error:', {
          postId,
          userId: user.id,
          error: deleteError.message
        });
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }

      // Log successful deletion
      console.info('Post deleted successfully:', {
        postId,
        userId: user.id,
        filesDeleted: filesToDelete.length
      });
  
      return NextResponse.json({ message: 'Post deleted successfully' }, { status: 200 });
    } catch (error) {
      console.error('Unexpected error during post deletion:', {
        postId,
        userId: user.id,
        error: error instanceof Error ? error.message : String(error)
      });
      return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
    }
  }

  export async function PATCH(request: Request) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { postId, is_favorite, is_shared } = await request.json();
    if (!postId) {
      return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
    }

    // Build update object based on what's provided
    const updateData: { is_favorite?: boolean; is_shared?: boolean } = {};
    if (is_favorite !== undefined) updateData.is_favorite = is_favorite;
    if (is_shared !== undefined) updateData.is_shared = is_shared;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    // Update the post (RLS enforces ownership)
    const { error: updateError } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Post update failed:', {
        postId,
        userId: user.id,
        updateData,
        error: updateError.message
      });
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Log successful update
    console.info('Post updated successfully:', {
      postId,
      userId: user.id,
      updatedFields: Object.keys(updateData)
    });

    // Return updated values
    const responseData: { message: string; is_favorite?: boolean; is_shared?: boolean } = { message: 'Post updated' };
    if (is_favorite !== undefined) responseData.is_favorite = is_favorite;
    if (is_shared !== undefined) responseData.is_shared = is_shared;

    return NextResponse.json(responseData, { status: 200 });
  }