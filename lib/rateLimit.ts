// Rate limiting utility to prevent spam and abuse
// Implements strict 3 submissions per hour per IP address

interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstAttempt: number;
}

// In-memory storage for rate limiting
// Note: For production with multiple serverless instances, consider Redis
const rateLimitMap = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 10 * 60 * 1000); // 10 minutes

/**
 * Checks if an IP address has exceeded the rate limit
 * @param ip - IP address to check
 * @returns True if allowed, false if rate limited
 */
export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || "3");
  const windowMs = parseInt(process.env.RATE_LIMIT_WINDOW || "3600000"); // 1 hour

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    // First request or window expired - start new window
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + windowMs,
      firstAttempt: now,
    });
    return true;
  }

  if (entry.count >= maxRequests) {
    // Rate limit exceeded
    return false;
  }

  // Increment counter
  entry.count++;
  rateLimitMap.set(ip, entry);
  return true;
}

/**
 * Gets remaining time until rate limit resets
 * @param ip - IP address to check
 * @returns Milliseconds until reset, or 0 if not rate limited
 */
export function getRateLimitReset(ip: string): number {
  const entry = rateLimitMap.get(ip);
  if (!entry) return 0;

  const now = Date.now();
  const remaining = entry.resetTime - now;
  return remaining > 0 ? remaining : 0;
}

/**
 * Gets remaining submissions allowed for an IP
 * @param ip - IP address to check
 * @returns Number of remaining submissions
 */
export function getRemainingSubmissions(ip: string): number {
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || "3");
  const entry = rateLimitMap.get(ip);

  if (!entry) return maxRequests;

  const now = Date.now();
  if (now > entry.resetTime) return maxRequests;

  const remaining = maxRequests - entry.count;
  return remaining > 0 ? remaining : 0;
}

/**
 * Formats milliseconds into human-readable time
 * @param ms - Milliseconds
 * @returns Formatted string (e.g., "45 minutes")
 */
export function formatRemainingTime(ms: number): string {
  const minutes = Math.ceil(ms / (60 * 1000));

  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  const hours = Math.ceil(minutes / 60);
  return `${hours} hour${hours !== 1 ? "s" : ""}`;
}

/**
 * Manually reset rate limit for an IP (admin use)
 * @param ip - IP address to reset
 */
export function resetRateLimit(ip: string): void {
  rateLimitMap.delete(ip);
}

/**
 * Gets rate limit statistics for an IP
 * @param ip - IP address to check
 * @returns Rate limit stats
 */
export interface RateLimitStats {
  allowed: boolean;
  remaining: number;
  resetIn: number;
  resetInFormatted: string;
  totalAttempts: number;
}

export function getRateLimitStats(ip: string): RateLimitStats {
  const entry = rateLimitMap.get(ip);
  const maxRequests = parseInt(process.env.RATE_LIMIT_MAX || "3");
  const now = Date.now();

  if (!entry || now > entry.resetTime) {
    return {
      allowed: true,
      remaining: maxRequests,
      resetIn: 0,
      resetInFormatted: "N/A",
      totalAttempts: 0,
    };
  }

  const resetIn = entry.resetTime - now;
  const remaining = maxRequests - entry.count;

  return {
    allowed: remaining > 0,
    remaining: remaining > 0 ? remaining : 0,
    resetIn,
    resetInFormatted: formatRemainingTime(resetIn),
    totalAttempts: entry.count,
  };
}

/**
 * Extracts IP address from request headers (for serverless functions)
 * @param headers - Request headers
 * @returns IP address
 */
export function getClientIP(
  headers: Record<string, string | string[] | undefined>
): string {
  // Check common headers in order of preference
  const forwardedFor = headers["x-forwarded-for"];
  if (forwardedFor) {
    const ips = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor;
    return ips.split(",")[0].trim();
  }

  const realIP = headers["x-real-ip"];
  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP;
  }

  const cfConnectingIP = headers["cf-connecting-ip"]; // Cloudflare
  if (cfConnectingIP) {
    return Array.isArray(cfConnectingIP) ? cfConnectingIP[0] : cfConnectingIP;
  }

  // Fallback to unknown
  return "unknown";
}
