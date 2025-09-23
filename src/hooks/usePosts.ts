import { useState, useCallback } from 'react';
import type { Post } from '@/types';

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await fetch('/api/posts');
      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData || []);
      } else {
        console.error('Error fetching posts:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, []);

  const refetchPosts = useCallback(async () => {
    setRefreshing(true);
    try {
      // Add a small delay to ensure the database has processed the new post
      await new Promise(resolve => setTimeout(resolve, 1000));

      let retries = 3;
      while (retries > 0) {
        const response = await fetch('/api/posts');
        if (response.ok) {
          const newPosts = await response.json();
          setPosts(newPosts);
          break;
        } else {
          console.error('Error fetching posts:', response.statusText);
          retries--;
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        }
      }
    } catch (error) {
      console.error('Error refetching posts:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const updatePosts = useCallback((newPosts: Post[]) => {
    setPosts(newPosts);
  }, []);

  const clearPosts = useCallback(() => {
    setPosts([]);
  }, []);

  return {
    posts,
    refreshing,
    fetchPosts,
    refetchPosts,
    updatePosts,
    clearPosts,
  };
};
