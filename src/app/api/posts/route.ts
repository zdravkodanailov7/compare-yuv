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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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
    const beforePath = `${user.id}/before-${Date.now()}.${beforeFile.name.split('.').pop()}`;
    const { error: beforeError } = await supabase.storage
      .from('images')
      .upload(beforePath, beforeFile);
  
    if (beforeError) {
      return NextResponse.json({ error: beforeError.message }, { status: 500 });
    }
    const { data: beforeUrlData } = supabase.storage.from('images').getPublicUrl(beforePath);
    const beforeUrl = beforeUrlData.publicUrl;
  
    // Upload after image (repeat pattern)
    const afterPath = `${user.id}/after-${Date.now()}.${afterFile.name.split('.').pop()}`;
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
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  
    return NextResponse.json({ message: 'Post created successfully' }, { status: 201 });
  }