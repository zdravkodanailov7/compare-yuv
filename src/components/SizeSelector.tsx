'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';
import { POST_SIZES, PostSize } from '@/lib/constants';

interface Props {
  value: PostSize;
  onChange: (size: PostSize) => void;
}

export default function SizeSelector({ value, onChange }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server side to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="outline" size="sm" disabled>
        Size
        <ChevronDown className="h-3 w-3 ml-2" />
      </Button>
    );
  }

      const handleSizeChange = (size: PostSize) => {
        onChange(size);
        if (typeof window !== 'undefined') {
          localStorage.setItem('postSize', size);
        }
      };

      const getSizeLabel = (size: PostSize) => {
        switch (size) {
          case POST_SIZES.SMALL: return 'Small';
          case POST_SIZES.MEDIUM: return 'Medium';
          case POST_SIZES.LARGE: return 'Large';
        }
      };

  return (
    <div className="hidden sm:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            {getSizeLabel(value)}
            <ChevronDown className="h-3 w-3 ml-2" />
          </Button>
        </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Post Size</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleSizeChange(POST_SIZES.SMALL)}>
                Small
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSizeChange(POST_SIZES.MEDIUM)}>
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSizeChange(POST_SIZES.LARGE)}>
                Large
              </DropdownMenuItem>
            </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
