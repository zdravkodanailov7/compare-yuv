// File validation utilities
export const validateImageFile = (file: File): void => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

  // Check file size
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${formatFileSize(maxSize)}`);
  }

  // Check file type by MIME type
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Allowed types: JPEG, PNG, WebP, GIF');
  }

  // Additional check by file extension (for extra security)
  const fileName = file.name.toLowerCase();
  const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
  if (!hasValidExtension) {
    throw new Error('Invalid file extension. Allowed extensions: .jpg, .jpeg, .png, .webp, .gif');
  }

  // Check for minimum file size (to avoid empty/corrupted files)
  const minSize = 1024; // 1KB
  if (file.size < minSize) {
    throw new Error('File too small. Minimum size is 1KB');
  }
};

// Text validation utilities
export const validateCaption = (caption: string): void => {
  const maxLength = 500;
  const minLength = 0;

  if (caption.length > maxLength) {
    throw new Error(`Caption too long. Maximum ${maxLength} characters allowed`);
  }

  if (caption.length < minLength) {
    throw new Error(`Caption too short. Minimum ${minLength} characters required`);
  }

  // Basic sanitization - remove potentially dangerous characters
  const sanitized = caption.replace(/[<>\"'&]/g, '');
  if (sanitized !== caption) {
    throw new Error('Caption contains invalid characters');
  }
};

// API input validation
export const validatePostRequest = (formData: FormData): { beforeFile: File; afterFile: File; caption?: string } => {
  const beforeFile = formData.get('before') as File;
  const afterFile = formData.get('after') as File;
  const caption = formData.get('caption') as string;

  // Validate required files
  if (!beforeFile || !afterFile) {
    throw new Error('Both before and after images are required');
  }

  // Ensure files are actually File objects
  if (!(beforeFile instanceof File) || !(afterFile instanceof File)) {
    throw new Error('Invalid file format');
  }

  // Validate image files
  validateImageFile(beforeFile);
  validateImageFile(afterFile);

  // Validate caption if provided
  if (caption && caption.trim()) {
    validateCaption(caption.trim());
  }

  return {
    beforeFile,
    afterFile,
    caption: caption?.trim() || undefined
  };
};

// User ID validation
export const validateUserId = (userId: string): void => {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Invalid user ID');
  }

  // Basic UUID format check (for Supabase IDs)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    throw new Error('Invalid user ID format');
  }
};

// Post ID validation
export const validatePostId = (postId: string): void => {
  if (!postId || typeof postId !== 'string') {
    throw new Error('Invalid post ID');
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(postId)) {
    throw new Error('Invalid post ID format');
  }
};

// Search term validation
export const validateSearchTerm = (searchTerm: string): void => {
  const maxLength = 100;
  const minLength = 0;

  if (searchTerm.length > maxLength) {
    throw new Error(`Search term too long. Maximum ${maxLength} characters allowed`);
  }

  if (searchTerm.length < minLength) {
    throw new Error('Invalid search term');
  }

  // Sanitize search term
  const sanitized = searchTerm.replace(/[<>\"'&]/g, '');
  if (sanitized !== searchTerm) {
    throw new Error('Search term contains invalid characters');
  }
};

// Utility function to format file sizes
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// File name sanitization for storage
export const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscores
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, '') // Remove leading/trailing underscores
    .toLowerCase();
};

// Validation result type
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// Comprehensive validation function
export const validateAllInputs = (data: {
  beforeFile?: File;
  afterFile?: File;
  caption?: string;
  searchTerm?: string;
  userId?: string;
  postId?: string;
}): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  try {
    // Validate files if provided
    if (data.beforeFile) {
      try {
        validateImageFile(data.beforeFile);
      } catch (error) {
        errors.push(`Before image: ${error instanceof Error ? error.message : 'Invalid file'}`);
      }
    }

    if (data.afterFile) {
      try {
        validateImageFile(data.afterFile);
      } catch (error) {
        errors.push(`After image: ${error instanceof Error ? error.message : 'Invalid file'}`);
      }
    }

    // Validate caption if provided
    if (data.caption !== undefined) {
      try {
        validateCaption(data.caption);
      } catch (error) {
        errors.push(`Caption: ${error instanceof Error ? error.message : 'Invalid caption'}`);
      }
    }

    // Validate search term if provided
    if (data.searchTerm !== undefined) {
      try {
        validateSearchTerm(data.searchTerm);
      } catch (error) {
        errors.push(`Search term: ${error instanceof Error ? error.message : 'Invalid search term'}`);
      }
    }

    // Validate user ID if provided
    if (data.userId !== undefined) {
      try {
        validateUserId(data.userId);
      } catch (error) {
        errors.push(`User ID: ${error instanceof Error ? error.message : 'Invalid user ID'}`);
      }
    }

    // Validate post ID if provided
    if (data.postId !== undefined) {
      try {
        validatePostId(data.postId);
      } catch (error) {
        errors.push(`Post ID: ${error instanceof Error ? error.message : 'Invalid post ID'}`);
      }
    }

    // Add warnings for potentially problematic inputs
    if (data.caption && data.caption.length > 400) {
      warnings.push('Caption is quite long and may be truncated in some views');
    }

    if (data.beforeFile && data.afterFile) {
      const sizeRatio = Math.max(data.beforeFile.size, data.afterFile.size) / Math.min(data.beforeFile.size, data.afterFile.size);
      if (sizeRatio > 10) {
        warnings.push('Images have very different file sizes - this may affect loading performance');
      }
    }

  } catch (error) {
    errors.push(`Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};
