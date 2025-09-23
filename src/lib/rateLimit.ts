import { RATE_LIMITS } from '@/lib/constants';

// In-memory rate limiting (can be upgraded to Redis later)
interface RateLimitEntry {
  count: number;
  resetTime: number;
  lastRequest: number;
}

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  identifier: string; // Key to identify the client (IP, user ID, etc.)
}

class RateLimitStore {
  private store: Map<string, RateLimitEntry> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.resetTime) {
        this.store.delete(key);
      }
    }
  }

  get(key: string): RateLimitEntry | undefined {
    const entry = this.store.get(key);
    const now = Date.now();

    if (!entry) {
      return undefined;
    }

    // Reset if window has expired
    if (now > entry.resetTime) {
      this.store.delete(key);
      return undefined;
    }

    return entry;
  }

  set(key: string, entry: RateLimitEntry): void {
    this.store.set(key, entry);
  }

  increment(key: string, windowMs: number): { count: number; resetTime: number; isLimited: boolean } {
    const now = Date.now();
    let entry = this.get(key);

    if (!entry) {
      // First request in window
      entry = {
        count: 1,
        resetTime: now + windowMs,
        lastRequest: now
      };
      this.set(key, entry);
      return { count: 1, resetTime: entry.resetTime, isLimited: false };
    }

    // Check if still in same window
    if (now > entry.resetTime) {
      // New window
      const newEntry = {
        count: 1,
        resetTime: now + windowMs,
        lastRequest: now
      };
      this.set(key, newEntry);
      return { count: 1, resetTime: newEntry.resetTime, isLimited: false };
    }

    // Increment existing window
    entry.count++;
    entry.lastRequest = now;
    this.set(key, entry);

    return {
      count: entry.count,
      resetTime: entry.resetTime,
      isLimited: entry.count > this.getMaxRequestsForKey(key)
    };
  }

  private getMaxRequestsForKey(key: string): number {
    // Different limits based on request type
    if (key.startsWith('upload:')) return 10; // Upload operations
    if (key.startsWith('delete:')) return 5;  // Delete operations
    if (key.startsWith('patch:')) return 20;  // Update operations
    return 100; // Read operations (GET requests)
  }

  // Get remaining requests for a key
  getRemainingRequests(key: string): { remaining: number; resetTime: number; total: number } {
    const entry = this.get(key);
    const now = Date.now();
    const maxRequests = this.getMaxRequestsForKey(key);

    if (!entry || now > entry.resetTime) {
      return { remaining: maxRequests, resetTime: now, total: maxRequests };
    }

    return {
      remaining: Math.max(0, maxRequests - entry.count),
      resetTime: entry.resetTime,
      total: maxRequests
    };
  }

  // Clean up resources
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Global rate limit store instance
const rateLimitStore = new RateLimitStore();

// Rate limiting middleware
export const rateLimit = async (
  request: Request,
  config: Partial<RateLimitConfig> = {}
): Promise<{ success: boolean; remaining: number; resetTime: number; error?: string }> => {
  const defaultConfig: RateLimitConfig = {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    identifier: 'ip' // Default to IP-based limiting
  };

  const finalConfig = { ...defaultConfig, ...config };

  // Get client identifier
  let identifier: string;

  try {
    // Try to get real IP from various headers (for production)
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');

    // Use the most reliable IP detection
    const clientIP = cfConnectingIP || realIP || forwardedFor?.split(',')[0] || 'unknown';

    // For development, use a fallback
    identifier = process.env.NODE_ENV === 'development' ? 'dev-user' : clientIP;
  } catch (error) {
    // Fallback to development identifier
    identifier = process.env.NODE_ENV === 'development' ? 'dev-user' : 'unknown';
  }

  // Create unique key based on identifier and config
  const key = `${finalConfig.identifier}:${identifier}`;

  try {
    const result = rateLimitStore.increment(key, finalConfig.windowMs);
    const remaining = rateLimitStore.getRemainingRequests(key);

    if (result.isLimited) {
      return {
        success: false,
        remaining: 0,
        resetTime: result.resetTime,
        error: `Rate limit exceeded. Try again in ${Math.ceil((result.resetTime - Date.now()) / 1000)} seconds.`
      };
    }

    return {
      success: true,
      remaining: remaining.remaining,
      resetTime: remaining.resetTime
    };
  } catch (error) {
    // If rate limiting fails, allow the request but log the error
    console.warn('Rate limiting error:', error);
    return {
      success: true,
      remaining: finalConfig.maxRequests,
      resetTime: Date.now() + finalConfig.windowMs
    };
  }
};

// Pre-configured rate limiters for different operations
export const rateLimiters = {
  // General read operations (GET requests)
  read: (request: Request) => rateLimit(request, {
    windowMs: RATE_LIMITS.READ.WINDOW_MS,
    maxRequests: RATE_LIMITS.READ.MAX_REQUESTS,
    identifier: 'read'
  }),

  // Upload operations (POST requests with files)
  upload: (request: Request) => rateLimit(request, {
    windowMs: RATE_LIMITS.UPLOAD.WINDOW_MS,
    maxRequests: RATE_LIMITS.UPLOAD.MAX_REQUESTS,
    identifier: 'upload'
  }),

  // Delete operations
  delete: (request: Request) => rateLimit(request, {
    windowMs: RATE_LIMITS.DELETE.WINDOW_MS,
    maxRequests: RATE_LIMITS.DELETE.MAX_REQUESTS,
    identifier: 'delete'
  }),

  // Update operations (PATCH)
  update: (request: Request) => rateLimit(request, {
    windowMs: RATE_LIMITS.UPDATE.WINDOW_MS,
    maxRequests: RATE_LIMITS.UPDATE.MAX_REQUESTS,
    identifier: 'patch'
  }),

  // Strict rate limiting for sensitive operations
  strict: (request: Request) => rateLimit(request, {
    windowMs: RATE_LIMITS.STRICT.WINDOW_MS,
    maxRequests: RATE_LIMITS.STRICT.MAX_REQUESTS,
    identifier: 'strict'
  }),

  // Burst limiting for high-frequency operations
  burst: (request: Request) => rateLimit(request, {
    windowMs: RATE_LIMITS.BURST.WINDOW_MS,
    maxRequests: RATE_LIMITS.BURST.MAX_REQUESTS,
    identifier: 'burst'
  })
};

// Utility function to get rate limit headers for responses
export const getRateLimitHeaders = (key: string) => {
  const remaining = rateLimitStore.getRemainingRequests(key);
  const now = Date.now();

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': remaining.total.toString(),
    'X-RateLimit-Remaining': remaining.remaining.toString(),
    'X-RateLimit-Reset': new Date(remaining.resetTime).toISOString(),
    'X-RateLimit-Reset-In': Math.ceil((remaining.resetTime - now) / 1000).toString(),
  };

  // Only add Retry-After header if rate limit is exceeded
  if (remaining.remaining <= 0) {
    headers['Retry-After'] = Math.ceil((remaining.resetTime - now) / 1000).toString();
  }

  return headers;
};

// Clean up function for testing
export const clearRateLimitStore = () => {
  rateLimitStore.destroy();
  // Create new instance
  const newStore = new RateLimitStore();
  Object.assign(rateLimitStore, newStore);
};
