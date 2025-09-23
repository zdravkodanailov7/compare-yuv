'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CompareImage from 'react-compare-image';
import type { Post } from '@/types';

interface Props {
  post: Post;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: Props) {
  const shareUrl = `${window.location.origin}/post/${post.id}`;  // Placeholder

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert('Link copied!');
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{post.caption || 'Before & After'}</DialogTitle>
        </DialogHeader>
        <CompareImage leftImage={post.before_image_url} rightImage={post.after_image_url} />
        <Button onClick={copyLink}>Share Link</Button>
      </DialogContent>
    </Dialog>
  );
}