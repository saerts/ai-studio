import { RateLimiterMemory } from 'rate-limiter-flexible';
import type { RateLimiterResult } from '../types/api.js';

// Rate limiter for API endpoints
const apiRateLimiter = new RateLimiterMemory({
  points: 10, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 60, // Block for 60 seconds if limit is reached
});

// Rate limiter for refresh operations (more restrictive)
const refreshRateLimiter = new RateLimiterMemory({
  points: 3, // Number of refresh requests
  duration: 300, // Per 5 minutes
  blockDuration: 300, // Block for 5 minutes if limit is reached
});

// Rate limiter for MCP operations (very restrictive)
const mcpRateLimiter = new RateLimiterMemory({
  points: 5, // Number of MCP requests
  duration: 600, // Per 10 minutes
  blockDuration: 600, // Block for 10 minutes if limit is reached
});

/**
 * Get client identifier from request
 * Uses IP address with optional forwarded headers consideration
 */
function getClientId(request: Request): string {
  // Try to get real IP from forwarded headers (for proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare

  if (cfConnectingIp) return cfConnectingIp;
  if (realIp) return realIp;
  if (forwardedFor) {
    const first = forwardedFor.split(',')[0];
    if (first) return first.trim();
  }

  // Fallback to connection info (limited in serverless environments)
  return 'unknown';
}

/**
 * Check rate limit for API endpoints
 */
export async function checkApiRateLimit(
  request: Request
): Promise<{ allowed: boolean; resetTime?: Date }> {
  const clientId = getClientId(request);

  try {
    await apiRateLimiter.consume(clientId);
    return { allowed: true };
  } catch (rateLimiterRes: unknown) {
    const rateLimitResult = rateLimiterRes as RateLimiterResult;
    const resetTime = new Date(
      Date.now() + (rateLimitResult.msBeforeNext || 60000)
    );
    return { allowed: false, resetTime };
  }
}

/**
 * Check rate limit for refresh operations
 */
export async function checkRefreshRateLimit(
  request: Request
): Promise<{ allowed: boolean; resetTime?: Date }> {
  const clientId = getClientId(request);

  try {
    await refreshRateLimiter.consume(clientId);
    return { allowed: true };
  } catch (rateLimiterRes: unknown) {
    const rateLimitResult = rateLimiterRes as RateLimiterResult;
    const resetTime = new Date(
      Date.now() + (rateLimitResult.msBeforeNext || 300000)
    );
    return { allowed: false, resetTime };
  }
}

/**
 * Check rate limit for MCP operations
 */
export async function checkMCPRateLimit(
  request: Request
): Promise<{ allowed: boolean; resetTime?: Date }> {
  const clientId = getClientId(request);

  try {
    await mcpRateLimiter.consume(clientId);
    return { allowed: true };
  } catch (rateLimiterRes: unknown) {
    const rateLimitResult = rateLimiterRes as RateLimiterResult;
    const resetTime = new Date(
      Date.now() + (rateLimitResult.msBeforeNext || 600000)
    );
    return { allowed: false, resetTime };
  }
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse(resetTime: Date): Response {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.',
      resetTime: resetTime.toISOString(),
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': Math.ceil(
          (resetTime.getTime() - Date.now()) / 1000
        ).toString(),
        'X-RateLimit-Reset': resetTime.toISOString(),
      },
    }
  );
}
