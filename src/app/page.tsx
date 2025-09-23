'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import PostsGrid from '@/components/PostsGrid';
import UploadDialog from '@/components/UploadDialog';
import SizeSelector from '@/components/SizeSelector';
import SearchBar from '@/components/SearchBar';
import type { Post } from '@/types';
import { Button } from '@/components/ui/button';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postSize, setPostSize] = useState<'small' | 'medium' | 'large'>(
    typeof window !== 'undefined' ? (localStorage.getItem('postSize') as 'small' | 'medium' | 'large') || 'medium' : 'medium'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        // Fetch posts only after user is authenticated
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
      }
      setLoading(false);
    };

    getUser();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setPosts([]);
  };

  const handleSignIn = () => {
    router.push('/auth');
  };

  const handleSizeChange = (newSize: 'small' | 'medium' | 'large') => {
    setPostSize(newSize);
  };

  // Refetch function for after upload
  const refetchPosts = async () => {
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
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  // Public home page for non-authenticated users
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Navigation */}
        <nav className="p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">CompareYUV</h1>
          <div className="flex items-center gap-4">
            <AnimatedThemeToggler />
            <div className="space-x-4">
              <Button variant="outline" onClick={handleSignIn}>
                Sign In
              </Button>
              <Button onClick={handleSignIn}>
                Sign Up
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Compare Your <span className="text-blue-600 dark:text-blue-400">Before & After</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload your before and after images to create stunning comparison posts.
            Share your progress, transformations, and achievements with the community.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" onClick={handleSignIn}>
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Easy Upload</h3>
              <p className="text-gray-600 dark:text-gray-300">Upload your before and after images with just a few clicks</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Instant Comparison</h3>
              <p className="text-gray-600 dark:text-gray-300">See your progress side-by-side with interactive comparisons</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">Share & Connect</h3>
              <p className="text-gray-600 dark:text-gray-300">Share your journey and connect with others on similar paths</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated user - show posts grid
  return (
    <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <UploadDialog onUploadSuccess={refetchPosts} loading={refreshing} />
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        <div className="flex items-center gap-4">
          <SizeSelector value={postSize} onChange={handleSizeChange} />
          <AnimatedThemeToggler />
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
      <PostsGrid
        initialPosts={posts}
        onPostsChange={setPosts}
        postSize={postSize}
        searchTerm={searchTerm}
      />
    </div>
  );
}