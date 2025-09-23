'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Plus, Loader2 } from 'lucide-react';
import CompareImage from 'react-compare-image';
import { LoadingSpinner } from '@/components/ui/skeleton';

interface Props {
  onUploadSuccess: () => void;  // Refetch callback
  loading?: boolean;  // Loading state for refreshing
}

export default function UploadDialog({ onUploadSuccess, loading = false }: Props) {
  const [open, setOpen] = useState(false);
  const [beforeFile, setBeforeFile] = useState<File | null>(null);
  const [afterFile, setAfterFile] = useState<File | null>(null);
  const [beforePreview, setBeforePreview] = useState<string | null>(null);
  const [afterPreview, setAfterPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === 'before') {
        setBeforeFile(file);
        setBeforePreview(url);
      } else {
        setAfterFile(file);
        setAfterPreview(url);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!beforeFile || !afterFile) {
      toast.error('Both images are required');
      return;
    }

    const formData = new FormData();
    formData.append('before', beforeFile);
    formData.append('after', afterFile);
    formData.append('caption', caption);

    const response = await fetch('/api/posts', { method: 'POST', body: formData });
    if (response.ok) {
      toast.success('Post uploaded successfully');
      onUploadSuccess();
      setOpen(false);
      // Clear form state after successful upload
      setBeforeFile(null);
      setAfterFile(null);
      setBeforePreview(null);
      setAfterPreview(null);
      setCaption('');
    } else {
      toast.error(await response.text());
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Only clear state when dialog is closing, not when opening
      setBeforeFile(null);
      setAfterFile(null);
      setBeforePreview(null);
      setAfterPreview(null);
      setCaption('');
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Upload New Post" disabled={loading}>
          {loading ? (
            <LoadingSpinner size="sm" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload New Post</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-sm font-medium mb-2">Before Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'before')} required className="w-full" />
          </div>
          <div>
            <Label className="text-sm font-medium mb-2">After Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'after')} required className="w-full" />
          </div>
          {beforeFile && afterFile && beforePreview && afterPreview && (
            <CompareImage leftImage={beforePreview} rightImage={afterPreview} />
          )}
          <div>
            <Label className="text-sm font-medium mb-2">Caption (optional)</Label>
            <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="w-full" />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <LoadingSpinner size="sm" />
                Uploading...
              </>
            ) : (
              'Save'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}