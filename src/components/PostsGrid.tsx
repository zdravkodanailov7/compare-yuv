'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PostModal from '@/components/PostModal';
import UploadDialog from '@/components/UploadDialog';
import type { Post } from '@/types';

interface Props {
  initialPosts: Post[];
}

export default function PostsGrid({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Refetch function (for after upload in Phase 6)
  const refetchPosts = async () => {
    const response = await fetch('/api/posts');
    if (response.ok) {
      const newPosts = await response.json();
      setPosts(newPosts);
    }
  };

  return (
    <>
      <div className="mb-6">
        <UploadDialog onUploadSuccess={refetchPosts} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        {posts.map((post) => (
          <Card key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer">
            <CardContent className="p-4">
              {/* Thumbnail: Simple side-by-side */}
              <div className="flex space-x-2">
                <img src={post.before_image_url} alt="Before" className="w-1/2 h-auto" />
                <img src={post.after_image_url} alt="After" className="w-1/2 h-auto" />
              </div>
              {post.caption && <p className="mt-2">{post.caption}</p>}
            </CardContent>
          </Card>
        ))}
      </div>
      {selectedPost && (
        <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </>
  );
}