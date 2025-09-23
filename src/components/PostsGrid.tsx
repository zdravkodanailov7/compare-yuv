'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BlurFade } from '@/components/ui/blur-fade';
import PostModal from '@/components/PostModal';
import UploadDialog from '@/components/UploadDialog';
import type { Post } from '@/types';

interface Props {
  initialPosts: Post[];
  onPostsChange: (posts: Post[]) => void;
  postSize?: 'small' | 'medium' | 'large';
  searchTerm?: string;
  showFavoritesOnly?: boolean;
}

const PostsGridComponent = ({ initialPosts, onPostsChange, postSize = 'medium', searchTerm = '', showFavoritesOnly = false }: Props) => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  // Calculate columns based on size preference
  const columns = useMemo(() => {
    switch (postSize) {
      case 'small': return 'columns-1 xs:columns-2 sm:columns-3 md:columns-4';
      case 'large': return 'columns-1 sm:columns-2 md:columns-3';
      default: return 'columns-1 xs:columns-2 sm:columns-2 md:columns-3';
    }
  }, [postSize]);

  // Get responsive column classes
  const getColumnClasses = () => {
    switch (postSize) {
      case 'small':
        return 'columns-1 xs:columns-2 sm:columns-3 md:columns-4 lg:columns-5';
      case 'large':
        return 'columns-1 sm:columns-2 md:columns-3';
      default: // medium
        return 'columns-1 xs:columns-2 sm:columns-2 md:columns-3 lg:columns-4';
    }
  };

  // Filter posts based on search term and favorites
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by favorites if requested
    if (showFavoritesOnly) {
      filtered = filtered.filter(post => post.is_favorite === true);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(post =>
        post.caption?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [posts, searchTerm, showFavoritesOnly]);

  // Update internal state when initialPosts changes
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]);

  // Handle post update (for favorite toggle)
  const handlePostUpdate = useCallback((updatedPost: Post) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  }, []);

  // Refetch function (for after upload in Phase 6)
  const refetchPosts = useCallback(async () => {
    const response = await fetch('/api/posts');
    if (response.ok) {
      const newPosts = await response.json();
      setPosts(newPosts);
      onPostsChange(newPosts); // Also update parent state
    }
  }, [onPostsChange]);

  return (
    <>
      {filteredPosts.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center px-4">
          <div className="max-w-sm">
            {showFavoritesOnly ? (
              <>
                <p className="text-muted-foreground mb-2 text-base sm:text-lg">No favorite posts yet</p>
                <p className="text-sm text-muted-foreground">Heart some posts to see them here</p>
              </>
            ) : searchTerm.trim() ? (
              <>
                <p className="text-muted-foreground mb-2 text-base sm:text-lg">No posts found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-2 text-base sm:text-lg">No posts yet</p>
                <p className="text-sm text-muted-foreground">Use the plus button above to upload your first comparison</p>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className={`${getColumnClasses()} gap-3 sm:gap-4 px-2 sm:px-0`}>
          {filteredPosts.map((post, index) => (
            <BlurFade key={post.id} delay={index * 0.05} inView>
              <div
                onClick={() => setSelectedPost(post)}
                className="mb-3 sm:mb-4 cursor-pointer group break-inside-avoid"
              >
                {/* Thumbnail: Merged comparison */}
                <div className="relative flex border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group-hover:scale-[1.02]">
                  <img
                    src={post.before_image_url}
                    alt="Before"
                    className="w-1/2 h-auto object-cover flex-shrink-0 border-r border-gray-200 dark:border-gray-700"
                  />
                  <img
                    src={post.after_image_url}
                    alt="After"
                    className="w-1/2 h-auto object-cover flex-shrink-0"
                  />
                  {/* Subtle center line overlay */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-x-0.5"></div>
                </div>
                {post.caption && (
                  <p className="mt-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {post.caption}
                  </p>
                )}
              </div>
            </BlurFade>
          ))}
        </div>
      )}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={refetchPosts}
          onUpdate={handlePostUpdate}
        />
      )}
    </>
  );
};

export default React.memo(PostsGridComponent);