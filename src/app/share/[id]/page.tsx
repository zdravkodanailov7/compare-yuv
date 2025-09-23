'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CompareImage from 'react-compare-image';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import type { Post } from '@/types';

export default function SharePage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchPost = async () => {
      if (!params?.id) return;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', params.id as string)
        .eq('is_shared', true)
        .single();

      if (error || !data) {
        notFound();
        return;
      }

      setPost(data);
      setLoading(false);
    };

    fetchPost();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shared post...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <AnimatedThemeToggler />
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto pt-16">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {post.caption || 'Before & After Comparison'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Shared via CompareYUV
          </p>
        </div>

        <div className="relative">
          <CompareImage
            leftImage={post.before_image_url}
            rightImage={post.after_image_url}
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '70vh'
            }}
          />
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag the slider to compare before and after
          </p>
        </div>
      </div>
    </div>
  );
}
