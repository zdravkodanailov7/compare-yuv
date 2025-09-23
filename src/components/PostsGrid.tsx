'use client';

import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import PostModal from '@/components/PostModal';
import UploadDialog from '@/components/UploadDialog';
import type { Post } from '@/types';

interface Props {
  initialPosts: Post[];
  onPostsChange: (posts: Post[]) => void;
  postSize?: 'small' | 'medium' | 'large';
  searchTerm?: string;
}

export default function PostsGrid({ initialPosts, onPostsChange, postSize = 'medium', searchTerm = '' }: Props) {
  const animateFrom = 'bottom'; // Always animate from bottom
  const [posts, setPosts] = useState(initialPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [imagesReady, setImagesReady] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  // Handle window resize for responsive columns
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);

  // Calculate columns based on screen width and size preference
  const columns = useMemo(() => {
    let baseColumns = 3; // Default for medium size

    // Adjust base columns based on size preference
    if (postSize === 'small') {
      baseColumns = 4;
    } else if (postSize === 'large') {
      baseColumns = 2;
    }

    // Adjust for screen width
    if (windowWidth >= 1500) return Math.min(baseColumns + 2, 6);
    if (windowWidth >= 1000) return Math.min(baseColumns + 1, 5);
    if (windowWidth >= 600) return baseColumns;
    if (windowWidth >= 400) return Math.max(baseColumns - 1, 1);
    return 1;
  }, [windowWidth, postSize]);

  // Get size-specific styling
  const getSizeStyles = () => {
    switch (postSize) {
      case 'small':
        return {
          minHeight: '120px',
          gap: '0.75rem',
          maxWidth: '200px'
        };
      case 'large':
        return {
          minHeight: '280px',
          gap: '1.5rem',
          maxWidth: '400px'
        };
      default: // medium
        return {
          minHeight: '200px',
          gap: '1rem',
          maxWidth: '300px'
        };
    }
  };

  const sizeStyles = getSizeStyles();

  // Animation configuration
  const stagger = 0.05;
  const duration = 0.6;
  const ease = 'power3.out';
  const blurToFocus = true;
  const scaleOnHover = true;
  const hoverScale = 0.95;

  // Preload images for smooth animations
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = posts.flatMap(post => [
        post.before_image_url,
        post.after_image_url
      ]).map(src => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, src]));
            resolve();
          };
          img.src = src;
        });
      });

      await Promise.all(imagePromises);
      setImagesReady(true);
    };

    if (posts.length > 0) {
      preloadImages();
    }
  }, [posts]);

  // Filter posts based on search term
  const filteredPosts = useMemo(() => {
    if (!searchTerm.trim()) {
      return posts;
    }

    const term = searchTerm.toLowerCase().trim();
    return posts.filter(post =>
      post.caption?.toLowerCase().includes(term)
    );
  }, [posts, searchTerm]);

  // Animation helper functions
  const getInitialPosition = (element: HTMLElement, direction = animateFrom) => {
    const rect = element.getBoundingClientRect();
    const containerRect = element.closest('.masonry-grid')?.getBoundingClientRect();

    if (direction === 'random') {
      const directions = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: 0, y: -200 };
      case 'bottom':
        return { x: 0, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: 0 };
      case 'right':
        return { x: window.innerWidth + 200, y: 0 };
      case 'center':
        return containerRect ? {
          x: containerRect.width / 2 - rect.width / 2,
          y: containerRect.height / 2 - rect.height / 2
        } : { x: 0, y: 0 };
      default:
        return { x: 0, y: 100 };
    }
  };

  // Handle mouse enter animations
  const handleMouseEnter = (postId: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-post-id="${postId}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  // Handle mouse leave animations
  const handleMouseLeave = (postId: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-post-id="${postId}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  // Animate posts on mount
  useLayoutEffect(() => {
    if (!imagesReady || hasMounted) return;

    const postElements = document.querySelectorAll('[data-post-id]');
    postElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;

      // Start animation immediately from CSS initial positions
      gsap.to(htmlElement, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        delay: index * stagger,
        onComplete: () => {
          // Remove will-change after animation completes for performance
          htmlElement.style.willChange = 'auto';
        }
      });

      // Also animate images inside the post
      const images = htmlElement.querySelectorAll('img');
      images.forEach((img, imgIndex) => {
        gsap.to(img, {
          opacity: 1,
          duration: 0.6,
          ease: 'power2.out',
          delay: (index * stagger) + (imgIndex * 0.1)
        });
      });
    });

    setHasMounted(true);
  }, [imagesReady, hasMounted, stagger, blurToFocus]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Preload images to get dimensions
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = posts.flatMap(post => [
        post.before_image_url,
        post.after_image_url
      ]).map(src => {
        return new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => {
            setLoadedImages(prev => new Set([...prev, src]));
            resolve();
          };
          img.src = src;
        });
      });

      await Promise.all(imagePromises);
    };

    if (posts.length > 0) {
      preloadImages();
    }
  }, [posts]);

  // Update internal state when initialPosts changes
  useEffect(() => {
    if (initialPosts.length > 0) {
      setPosts(initialPosts);
      setHasMounted(false); // Reset animation state for new posts
      setImagesReady(false); // Reset image ready state
      setLoadedImages(new Set()); // Clear loaded images
    }
  }, [initialPosts]);

  // Refetch function (for after upload in Phase 6)
  const refetchPosts = async () => {
    const response = await fetch('/api/posts');
    if (response.ok) {
      const newPosts = await response.json();
      setPosts(newPosts);
      setHasMounted(false); // Reset animation state for new posts
      setImagesReady(false); // Reset image ready state
      setLoadedImages(new Set()); // Clear loaded images
      onPostsChange(newPosts); // Also update parent state
    }
  };

  return (
    <>
      <style jsx>{`
        .masonry-grid {
          grid-auto-flow: row dense;
        }

        .masonry-grid > * {
          break-inside: avoid;
        }

        @supports (grid-template-rows: masonry) {
          .masonry-grid {
            grid-template-rows: masonry;
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Ensure images maintain exactly 50% width */
        .masonry-grid img {
          width: 50% !important;
          max-width: 50% !important;
          flex: 0 0 50% !important;
        }

        /* Animation performance optimizations */
        .masonry-grid [data-post-id] {
          transform-origin: center center;
          backface-visibility: hidden;
          perspective: 1000px;
          opacity: 0;
          transform: translateY(100px);
          will-change: transform, opacity;
        }

        /* Smooth hover transitions */
        .masonry-grid [data-post-id]:hover {
          z-index: 10;
        }

        /* Ensure images are hidden initially */
        .masonry-grid [data-post-id] img {
          opacity: 0;
        }
      `}</style>


      {filteredPosts.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-center">
          <div>
            {searchTerm.trim() ? (
              <>
                <p className="text-muted-foreground mb-2">No posts found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-2">No posts yet</p>
                <p className="text-sm text-muted-foreground">Use the plus button above to upload your first comparison</p>
              </>
            )}
          </div>
        </div>
      ) : !imagesReady ? (
        // Show loading state while images are preloading
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      ) : (
        <div
          className="masonry-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: sizeStyles.gap,
            gridAutoRows: 'max-content'
          }}
        >
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              data-post-id={post.id}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer group"
              onMouseEnter={(e) => handleMouseEnter(post.id, e.currentTarget)}
              onMouseLeave={(e) => handleMouseLeave(post.id, e.currentTarget)}
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Thumbnail: Merged comparison */}
              <div className="relative flex border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <img
                  src={post.before_image_url}
                  alt="Before"
                  className="w-1/2 h-auto object-cover flex-shrink-0 border-r border-gray-200 dark:border-gray-700"
                  style={{ minHeight: sizeStyles.minHeight, maxWidth: '50%' }}
                />
                <img
                  src={post.after_image_url}
                  alt="After"
                  className="w-1/2 h-auto object-cover flex-shrink-0"
                  style={{ minHeight: sizeStyles.minHeight, maxWidth: '50%' }}
                />
                {/* Subtle center line overlay */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-x-0.5"></div>
              </div>
              {post.caption && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {post.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {selectedPost && (
        <PostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onDelete={refetchPosts}
        />
      )}
    </>
  );
}