'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';
import CompareImage from 'react-compare-image';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import type { Post } from '@/types';

interface Props {
  post: Post;
  onClose: () => void;
  onDelete?: () => void; // Optional callback to refresh posts grid
}

export default function PostModal({ post, onClose, onDelete }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
          <DialogTitle>{post.caption || 'Before & After'}</DialogTitle>
        </DialogHeader>
        <CompareImage leftImage={post.before_image_url} rightImage={post.after_image_url} />
        <div className="flex justify-end gap-2">
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