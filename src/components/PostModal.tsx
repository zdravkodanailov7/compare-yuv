'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Heart, Trash2, Share2 } from 'lucide-react';
import { ReactCompareSlider } from 'react-compare-slider';
import { OptimizedImage } from '@/components/ui/optimized-image';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import type { Post } from '@/types';

interface Props {
  post: Post;
  onClose: () => void;
  onDelete?: () => void; // Optional callback to refresh posts grid
  onUpdate?: (updatedPost: Post) => void; // Optional callback for favorite toggle
}

export default function PostModal({ post, onClose, onDelete, onUpdate }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [localPost, setLocalPost] = useState(post); // Local state for optimistic UI

  const handleToggleFavorite = async () => {
    try {
      const response = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, is_favorite: !localPost.is_favorite }),
      });

      if (response.ok) {
        const { is_favorite } = await response.json();
        const updated = { ...localPost, is_favorite };
        setLocalPost(updated);
        toast.success(is_favorite ? 'Added to favorites' : 'Removed from favorites');
        if (onUpdate) onUpdate(updated); // Update grid without full refetch
      } else {
        toast.error('Failed to update favorite');
      }
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handleToggleShare = async () => {
    try {
      const newShared = !localPost.is_shared;
      const response = await fetch('/api/posts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: post.id, is_shared: newShared }),
      });

      if (response.ok) {
        const { is_shared } = await response.json();
        const updated = { ...localPost, is_shared };
        setLocalPost(updated);
        if (is_shared) {
          const shareUrl = `${window.location.origin}/share/${post.id}`;
          navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied! Post is now public.');
        } else {
          toast.success('Post is now private.');
        }
        if (onUpdate) onUpdate(updated);
      } else {
        toast.error('Failed to update share status');
      }
    } catch (error) {
      toast.error('Failed to update share status');
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      console.log('Attempting to delete post:', post.id);
      const response = await fetch(`/api/posts?id=${post.id}`, {
        method: 'DELETE',
      });

      console.log('Delete response status:', response.status);
      console.log('Delete response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Delete response:', result);
        toast.success('Post deleted successfully');
        onClose(); // Close the modal
        if (onDelete) {
          onDelete(); // Refresh the posts grid
        }
      } else {
        const error = await response.json();
        console.error('Delete error response:', error);
        toast.error(error.error || 'Failed to delete post');
      }
    } catch (error) {
      console.error('Delete catch error:', error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{localPost.caption || 'Before & After'}</DialogTitle>
        </DialogHeader>
        <div className="h-96 w-full">
          <ReactCompareSlider
            itemOne={
              <div className="h-full w-full">
                <OptimizedImage
                  src={localPost.before_image_url}
                  alt="Before"
                  fill
                  className="object-cover"
                />
              </div>
            }
            itemTwo={
              <div className="h-full w-full">
                <OptimizedImage
                  src={localPost.after_image_url}
                  alt="After"
                  fill
                  className="object-cover"
                />
              </div>
            }
            className="h-full w-full rounded-lg overflow-hidden"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            onClick={handleToggleFavorite}
            className={localPost.is_favorite ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'}
          >
            <Heart className="h-4 w-4" fill={localPost.is_favorite ? 'currentColor' : 'none'} />
          </Button>
          <Button
            variant="ghost"
            onClick={handleToggleShare}
            className={localPost.is_shared ? 'text-blue-500 hover:text-blue-600' : 'text-gray-500 hover:text-gray-600'}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteClick}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Delete Post
          </Button>
        </div>
      </DialogContent>
      <DeleteConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDeleteConfirm}
      />
    </Dialog>
  );
}