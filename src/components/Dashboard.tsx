import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler';
import { Heart } from 'lucide-react';
import PostsGrid from '@/components/PostsGrid';
import UploadDialog from '@/components/UploadDialog';
import SizeSelector from '@/components/SizeSelector';
import SearchBar from '@/components/SearchBar';
import { usePosts } from '@/hooks/usePosts';
import { PostsGridSkeleton, DashboardHeaderSkeleton } from '@/components/ui/skeleton';
import { POST_SIZES, PostSize } from '@/lib/constants';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const DashboardComponent = ({ user, onLogout }: DashboardProps) => {
  const { posts, refreshing, fetchPosts, refetchPosts, updatePosts } = usePosts();
  const [postSize, setPostSize] = useState<PostSize>(
    typeof window !== 'undefined' ? (localStorage.getItem('postSize') as PostSize) || POST_SIZES.MEDIUM : POST_SIZES.MEDIUM
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSizeChange = useCallback((newSize: PostSize) => {
    setPostSize(newSize);
  }, []);

  const handleToggleFavorites = useCallback(() => {
    setShowFavoritesOnly(prev => !prev);
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Mobile-first responsive header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 lg:mb-8">
        {/* Left side - Upload and Search */}
        <div className="flex flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <UploadDialog onUploadSuccess={refetchPosts} loading={refreshing} />
          <div className="flex-1 min-w-0 max-w-xs sm:max-w-sm">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex flex-wrap items-center justify-start sm:justify-end gap-2 sm:gap-3">
          <AnimatedThemeToggler />
          <Button
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm"
            onClick={handleToggleFavorites}
            className="flex items-center gap-2 text-xs sm:text-sm"
          >
            <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
            <span className="hidden xs:inline">Favorites</span>
            <span className="xs:hidden">Fav</span>
          </Button>
          <SizeSelector value={postSize} onChange={handleSizeChange} />
          <Button variant="outline" onClick={onLogout} size="sm" className="text-xs sm:text-sm">
            Logout
          </Button>
        </div>
      </div>

      {/* Posts Grid - responsive */}
      {posts.length === 0 && !refreshing ? (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            <p className="text-muted-foreground mb-2">No posts yet</p>
            <p className="text-sm text-muted-foreground">Use the plus button above to upload your first comparison</p>
          </div>
        </div>
      ) : (
        <PostsGrid
          initialPosts={posts}
          onPostsChange={updatePosts}
          postSize={postSize}
          searchTerm={searchTerm}
          showFavoritesOnly={showFavoritesOnly}
          loading={refreshing}
        />
      )}
    </div>
  );
};

export default React.memo(DashboardComponent);
