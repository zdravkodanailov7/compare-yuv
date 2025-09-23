'use client';

import { useEffect, useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import CompareImage from 'react-compare-image';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import type { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

type ErrorState = 'not-found' | 'private' | 'network' | null;

export default function SharePage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchPost = async () => {
      if (!params?.id) {
        setError('not-found');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .eq('id', params.id as string)
          .eq('is_shared', true)
          .single();

        if (fetchError) {
          // Handle different types of errors
          if (fetchError.code === 'PGRST116') {
            // No rows returned - post doesn't exist or not shared
            setError('not-found');
          } else if (fetchError.code === 'PGRST301') {
            // RLS policy violation
            setError('private');
          } else {
            // Network or other error
            setError('network');
          }
          setLoading(false);
          return;
        }

        if (!data) {
          setError('not-found');
          setLoading(false);
          return;
        }

        setPost(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching shared post:', err);
        setError('network');
        setLoading(false);
      }
    };

    fetchPost();
  }, [params?.id]);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Re-run the effect by updating a state that triggers it
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = '/';
  };

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

  if (error) {
    const errorMessages = {
      'not-found': {
        title: 'Post Not Found',
        description: 'This shared post may have been deleted or is no longer available.',
        icon: <AlertCircle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
      },
      'private': {
        title: 'Post Is Private',
        description: 'This post is no longer shared publicly.',
        icon: <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
      },
      'network': {
        title: 'Connection Error',
        description: 'Unable to load the shared post. Please check your connection and try again.',
        icon: <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      }
    };

    const errorInfo = errorMessages[error];

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
        {/* Theme toggle */}
        <div className="absolute top-4 right-4 z-10">
          <AnimatedThemeToggler />
        </div>

        {/* Error content */}
        <div className="max-w-md mx-auto pt-20 text-center">
          {errorInfo.icon}
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {errorInfo.title}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            {errorInfo.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRetry} variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Try Again
            </Button>
            <Button onClick={handleGoHome} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </div>
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
          <div style={{ width: '100%', height: 'auto', maxHeight: '70vh' }}>
            <CompareImage
              leftImage={post.before_image_url}
              rightImage={post.after_image_url}
            />
          </div>
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
