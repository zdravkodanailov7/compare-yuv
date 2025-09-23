'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import CompareImage from 'react-compare-image';

interface Props {
  onUploadSuccess: () => void;  // Refetch callback
}

export default function UploadDialog({ onUploadSuccess }: Props) {
  const [open, setOpen] = useState(false);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'before') setBeforePreview(url);
      else setAfterPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforePreview || !afterPreview) {
      toast.error('Both images are required');
      return;
    }

    const formData = new FormData();
    formData.append('before', await fetch(beforePreview).then(r => r.blob()));
    formData.append('after', await fetch(afterPreview).then(r => r.blob()));
    formData.append('caption', caption);

    const response = await fetch('/api/posts', { method: 'POST', body: formData });
    if (response.ok) {
      toast.success('Post uploaded successfully');
      onUploadSuccess();
      setOpen(false);
      // Reset form
      setBeforePreview(null);
      setAfterPreview(null);
      setCaption('');
    } else {
      toast.error(await response.text());
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Upload New Post</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload New Post</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Before Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'before')} required />
          </div>
          <div>
            <Label>After Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'after')} required />
          </div>
          {beforePreview && afterPreview && (
            <CompareImage leftImage={beforePreview} rightImage={afterPreview} />
          )}
          <div>
            <Label>Caption (optional)</Label>
            <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} />
          </div>
          <Button type="submit">Save</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}