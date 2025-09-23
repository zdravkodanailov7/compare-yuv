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

interface Props {
  value: 'small' | 'medium' | 'large';
  onChange: (size: 'small' | 'medium' | 'large') => void;
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

  const handleSizeChange = (size: 'small' | 'medium' | 'large') => {
    onChange(size);
    if (typeof window !== 'undefined') {
      localStorage.setItem('postSize', size);
    }
  };

  const getSizeLabel = (size: 'small' | 'medium' | 'large') => {
    switch (size) {
      case 'small': return 'Small';
      case 'medium': return 'Medium';
      case 'large': return 'Large';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          {getSizeLabel(value)}
          <ChevronDown className="h-3 w-3 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Post Size</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => handleSizeChange('small')}>
          Small
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSizeChange('medium')}>
          Medium
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleSizeChange('large')}>
          Large
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
