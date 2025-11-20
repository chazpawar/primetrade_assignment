/**
 * Rate Limiting Utility
 * Implements token bucket algorithm for API rate limiting
 * Prevents abuse by limiting requests per IP address
 */

interface RateLimitEntry {
  tokens: number;
  lastRefill: number;
}

/**
 * Simple in-memory rate limiter using token bucket algorithm
 * For production, consider using Redis or similar distributed cache
 */
class RateLimiter {
  private store = new Map<string, RateLimitEntry>();
  private maxTokens: number;
  private refillRate: number; // tokens per second
  private refillInterval: number; // milliseconds

  /**
   * Creates a new rate limiter
   * @param maxTokens - Maximum number of tokens (requests) allowed
   * @param refillRate - Number of tokens to add per second
   */
  constructor(maxTokens: number = 10, refillRate: number = 1) {
    this.maxTokens = maxTokens;
    this.refillRate = refillRate;
    this.refillInterval = 1000; // 1 second

    // Cleanup old entries every 5 minutes
    setInterval(() => this.cleanup(), 5 * 60 * 1000);
  }

  /**
   * Checks if a request is allowed for the given identifier
   * @param identifier - Unique identifier (usually IP address)
   * @returns boolean - True if request is allowed
   */
  async check(identifier: string): Promise<boolean> {
    const now = Date.now();
    let entry = this.store.get(identifier);

    if (!entry) {
      // First request from this identifier
      entry = {
        tokens: this.maxTokens - 1,
        lastRefill: now,
      };
      this.store.set(identifier, entry);
      return true;
    }

    // Refill tokens based on time passed
    const timePassed = now - entry.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillInterval) * this.refillRate;
    
    if (tokensToAdd > 0) {
      entry.tokens = Math.min(this.maxTokens, entry.tokens + tokensToAdd);
      entry.lastRefill = now;
    }

    // Check if we have tokens available
    if (entry.tokens > 0) {
      entry.tokens--;
      this.store.set(identifier, entry);
      return true;
    }

    return false;
  }

  /**
   * Gets remaining tokens for an identifier
   * @param identifier - Unique identifier (usually IP address)
   * @returns number - Number of remaining tokens
   */
  getRemaining(identifier: string): number {
    const entry = this.store.get(identifier);
    if (!entry) return this.maxTokens;
    
    const now = Date.now();
    const timePassed = now - entry.lastRefill;
    const tokensToAdd = Math.floor(timePassed / this.refillInterval) * this.refillRate;
    
    return Math.min(this.maxTokens, entry.tokens + tokensToAdd);
  }

  /**
   * Cleans up old entries from the store
   */
  private cleanup(): void {
    const now = Date.now();
    const maxAge = 10 * 60 * 1000; // 10 minutes

    for (const [key, entry] of this.store.entries()) {
      if (now - entry.lastRefill > maxAge) {
        this.store.delete(key);
      }
    }
  }
}

/**
 * Rate limiters for different endpoints
 */
export const authLimiter = new RateLimiter(5, 0.1); // 5 requests, refill 1 every 10 seconds
export const apiLimiter = new RateLimiter(30, 1); // 30 requests, refill 1 per second
export const strictLimiter = new RateLimiter(3, 0.05); // 3 requests, refill 1 every 20 seconds

/**
 * Extracts IP address from request headers
 * @param request - Next.js request object
 * @returns string - IP address
 */
export function getClientIp(request: Request): string {
  // Try various headers in order of preference
  const headers = request.headers;
  
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback to a default value (not ideal but prevents errors)
  return "unknown";
}

/**
 * Helper function to apply rate limiting to API routes
 * @param request - Next.js request object
 * @param limiter - Rate limiter instance to use
 * @returns Response | null - Error response if rate limited, null if allowed
 */
export async function applyRateLimit(
  request: Request,
  limiter: RateLimiter = apiLimiter
): Promise<Response | null> {
  const ip = getClientIp(request);
  const allowed = await limiter.check(ip);

  if (!allowed) {
    const remaining = limiter.getRemaining(ip);
    return new Response(
      JSON.stringify({
        error: "Too many requests",
        message: "Rate limit exceeded. Please try again later.",
        remaining,
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "X-RateLimit-Remaining": remaining.toString(),
        },
      }
    );
  }

  return null;
}
