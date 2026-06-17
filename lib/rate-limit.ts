/**
 * Lightweight fixed-window rate limiter.
 *
 * Backed by an in-process Map, so limits are enforced **per running instance**,
 * not globally. With Fluid Compute reusing instances this catches the common
 * abuse cases (a single client hammering an endpoint) at zero infra cost and
 * zero dependencies — but it is best-effort, not a hard global guarantee.
 *
 * To make limits durable/global (recommended before launch for /api/contact
 * and /api/newsletter), back this with Upstash Redis or Vercel KV, or move the
 * check to `@vercel/firewall`'s `checkRateLimit`. The call sites in middleware
 * don't need to change — only this module's internals.
 */

export interface RateLimitOptions {
  /** Max requests allowed within the window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  /** Unix epoch ms when the current window resets. */
  reset: number;
}

interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();

/**
 * Record a hit for `key` and report whether it's within the limit.
 * Prunes the touched key when its window has elapsed to bound memory.
 */
export function rateLimit(
  key: string,
  { limit, windowMs }: RateLimitOptions,
  now: number = Date.now(),
): RateLimitResult {
  const existing = buckets.get(key);

  if (!existing || existing.reset <= now) {
    const reset = now + windowMs;
    buckets.set(key, { count: 1, reset });
    return { success: true, limit, remaining: limit - 1, reset };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    success: existing.count <= limit,
    limit,
    remaining,
    reset: existing.reset,
  };
}
