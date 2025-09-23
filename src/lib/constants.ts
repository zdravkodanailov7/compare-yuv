// Application-wide constants and configuration

// Post sizes for grid display
export const POST_SIZES = {
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large'
} as const;

export type PostSize = typeof POST_SIZES[keyof typeof POST_SIZES];

// File upload constraints
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'] as const;

// Rate limiting configuration
export const RATE_LIMITS = {
  READ: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 100
  },
  UPLOAD: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 10
  },
  DELETE: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 5
  },
  UPDATE: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 20
  },
  STRICT: {
    WINDOW_MS: 60 * 1000, // 1 minute
    MAX_REQUESTS: 5
  },
  BURST: {
    WINDOW_MS: 10 * 1000, // 10 seconds
    MAX_REQUESTS: 30
  }
} as const;

// Pagination and grid configuration
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  GRID_COLUMNS: {
    SMALL: 6,
    MEDIUM: 4,
    LARGE: 3
  }
} as const;

// Search and filtering
export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  MAX_QUERY_LENGTH: 100,
  DEBOUNCE_DELAY: 300 // milliseconds
} as const;

// Validation limits
export const VALIDATION = {
  CAPTION: {
    MIN_LENGTH: 0,
    MAX_LENGTH: 500
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50
  },
  POST_ID: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 50
  },
  USER_ID: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 50
  }
} as const;

// UI Configuration
export const UI = {
  TOAST_DURATION: 4000, // milliseconds
  SKELETON_LOAD_DELAY: 150, // milliseconds
  ANIMATION_DURATION: 200, // milliseconds
  MODAL_Z_INDEX: 50,
  DROPDOWN_Z_INDEX: 40,
  TOOLTIP_Z_INDEX: 30
} as const;

// Storage keys for localStorage
export const STORAGE_KEYS = {
  THEME: 'theme',
  POST_SIZE: 'postSize',
  USER_PREFERENCES: 'userPreferences',
  SEARCH_HISTORY: 'searchHistory',
  FAVORITES_FILTER: 'showFavoritesOnly'
} as const;

// API endpoints
export const API_ENDPOINTS = {
  POSTS: '/api/posts',
  AUTH: '/api/auth',
  SHARE: '/share'
} as const;

// Error messages
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'File size must be less than 10MB',
  INVALID_FILE_TYPE: 'Please select a valid image file (JPEG, PNG, or WebP)',
  UPLOAD_FAILED: 'Failed to upload file. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You must be logged in to perform this action',
  POST_NOT_FOUND: 'Post not found or no longer available',
  RATE_LIMIT_EXCEEDED: 'Too many requests. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  POST_UPLOADED: 'Post uploaded successfully',
  POST_DELETED: 'Post deleted successfully',
  POST_UPDATED: 'Post updated successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
} as const;

// Social sharing
export const SOCIAL_SHARE = {
  TITLE: 'Check out this before & after comparison!',
  DESCRIPTION: 'Created with CompareYUV - Transform your photos into stunning before-and-after comparisons',
  HASHTAGS: ['beforeafter', 'comparison', 'progress', 'transformation']
} as const;

// Feature flags (for future development)
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: true,
  ENABLE_NOTIFICATIONS: false,
  ENABLE_SOCIAL_LOGIN: true,
  ENABLE_ADVANCED_FILTERS: false,
  ENABLE_BULK_OPERATIONS: false,
  ENABLE_EXPORT_FEATURES: false
} as const;

// Environment-specific configuration
export const getEnvironmentConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = process.env.NODE_ENV === 'production';

  return {
    IS_DEVELOPMENT: isDevelopment,
    IS_PRODUCTION: isProduction,
    DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
    API_URL: process.env.NEXT_PUBLIC_API_URL || (isDevelopment ? 'http://localhost:3000' : ''),
    CDN_URL: process.env.NEXT_PUBLIC_CDN_URL || '',
    ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID || '',
    SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN || '',
    ENABLE_ERROR_REPORTING: isProduction
  };
};

// Image optimization settings
export const IMAGE_CONFIG = {
  QUALITY: 85,
  SIZES: {
    THUMBNAIL: 150,
    SMALL: 300,
    MEDIUM: 600,
    LARGE: 1200,
    ORIGINAL: 'original'
  } as const,
  FORMATS: ['image/webp', 'image/avif', 'image/jpeg'] as const
} as const;

// Accessibility settings
export const ACCESSIBILITY = {
  SKIP_LINK_TARGET: '#main-content',
  FOCUS_TRAP_ENABLED: true,
  SCREEN_READER_DELAY: 100,
  HIGH_CONTRAST_MODE: false
} as const;

// SEO defaults
export const SEO_DEFAULTS = {
  TITLE: 'CompareYUV',
  DESCRIPTION: 'Transform your photos into stunning before-and-after comparisons. Upload, compare, and share your progress with interactive sliders.',
  KEYWORDS: 'before after, image comparison, photo comparison, progress tracking, before after photos, image slider, visual comparison',
  AUTHOR: 'CompareYUV Team',
  SITE_NAME: 'CompareYUV',
  TYPE: 'website'
} as const;

// Database configuration (for future reference)
export const DATABASE = {
  TABLES: {
    POSTS: 'posts',
    USERS: 'users',
    SESSIONS: 'sessions'
  },
  INDEXES: {
    POSTS_USER_ID: 'posts_user_id_idx',
    POSTS_CREATED_AT: 'posts_created_at_idx',
    POSTS_IS_SHARED: 'posts_is_shared_idx'
  }
} as const;

// Cache configuration
export const CACHE = {
  POSTS_TTL: 5 * 60, // 5 minutes
  USER_TTL: 10 * 60, // 10 minutes
  SESSION_TTL: 24 * 60 * 60, // 24 hours
  IMAGE_TTL: 7 * 24 * 60 * 60 // 7 days
} as const;

// Export utility functions
export const isValidImageType = (type: string): boolean => {
  return ALLOWED_IMAGE_TYPES.includes(type as any);
};

export const isValidImageExtension = (filename: string): boolean => {
  const extension = filename.toLowerCase().substring(filename.lastIndexOf('.'));
  return ALLOWED_IMAGE_EXTENSIONS.includes(extension as any);
};

export const getFileSizeLimit = (): number => MAX_FILE_SIZE;

export const getPostSizeOptions = () => Object.values(POST_SIZES);

export const getRateLimitConfig = (type: keyof typeof RATE_LIMITS) => RATE_LIMITS[type];
