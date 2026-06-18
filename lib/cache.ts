import { cacheLife, cacheTag, revalidateTag, updateTag } from "next/cache";

/**
 * Caching toolkit for Cache Components (`cacheComponents: true`).
 *
 * The goal is that page/data authors never hand-write cache tag strings or
 * raw cacheLife configs. They pick a named profile and a typed tag, so
 * invalidation stays consistent across the codebase.
 *
 * ── How to cache a data function ─────────────────────────────────────────
 *
 *   import { cacheLife, cacheTag } from "next/cache";
 *   import { CACHE, cacheTags } from "@/lib/cache";
 *
 *   async function getGalleryItems() {
 *     "use cache";
 *     cacheLife(CACHE.gallery);      // how long it stays fresh
 *     cacheTag(cacheTags.gallery);   // how it gets invalidated
 *     return db.query(...);
 *   }
 *
 * ── How to invalidate after a mutation (Server Action / route handler) ────
 *
 *   import { invalidate } from "@/lib/cache";
 *   invalidate.gallery();           // background revalidate (next request fresh)
 *   invalidate.gallery({ immediate: true }); // same-request fresh read
 */

// ---------------------------------------------------------------------------
// Cache lifetime profiles
// ---------------------------------------------------------------------------
// `stale`      — serve stale this long while revalidating in the background.
// `revalidate` — background refresh interval.
// `expire`     — hard ceiling; after this the entry must be regenerated.
// All values are in seconds. Tune per content volatility.

const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export interface CacheConfig {
  stale: number;
  revalidate: number;
  expire: number;
}

export const CACHE = {
  /** Marketing / evergreen copy that rarely changes. */
  static: { stale: DAY, revalidate: 7 * DAY, expire: 30 * DAY },
  /** Gallery / portfolio listings — change when work is added. */
  gallery: { stale: HOUR, revalidate: 6 * HOUR, expire: DAY },
  /** Individual artwork / post detail. */
  detail: { stale: HOUR, revalidate: 12 * HOUR, expire: 7 * DAY },
  /** Feeds that should feel near-live but tolerate brief staleness. */
  feed: { stale: MINUTE, revalidate: 5 * MINUTE, expire: HOUR },
} as const;

export type CacheProfile = keyof typeof CACHE;

// ---------------------------------------------------------------------------
// Cache tags (the invalidation taxonomy)
// ---------------------------------------------------------------------------
// Keep tag strings centralized so a mutation and the cached read agree on the
// exact key. Use the parameterized helpers for per-entity tags.

// NOTE: the `v2` suffix is a one-time cache-key bump. The first production
// build ran before the Sanity read token was wired, so the data cache held
// empty results; bumping the tag version forces a fresh fetch on the next build.
export const cacheTags = {
  gallery: "gallery-v2",
  feed: "feed-v2",
  /**
   * Generic content tag for documents that don't map to a specific page or
   * gallery but still need cache busting (e.g. siteSettings, glossaryTerms).
   */
  content: "content-v2",
  /** Tag for a single piece of work, e.g. cacheTags.work("octopus-back"). */
  work: (slug: string) => `work-v2:${slug}`,
  /** Tag for a single content page, e.g. cacheTags.page("about"). */
  page: (slug: string) => `page-v2:${slug}`,
} as const;

// ---------------------------------------------------------------------------
// Invalidation helpers
// ---------------------------------------------------------------------------
// `revalidateTag` = background (next request sees fresh data).
// `updateTag`     = immediate (current request sees fresh data) — use after a
//                   mutation when you re-read in the same Server Action.

interface InvalidateOptions {
  immediate?: boolean;
}

// In Next 16, revalidateTag(tag, profile) requires the cache profile so it
// knows how to re-seed the entry; updateTag(tag) refreshes immediately within
// the current request. Each invalidator carries the profile its data uses.
function bust(
  tag: string,
  profile: CacheConfig,
  { immediate }: InvalidateOptions = {},
) {
  if (immediate) {
    updateTag(tag);
  } else {
    revalidateTag(tag, profile);
  }
}

export const invalidate = {
  gallery: (opts?: InvalidateOptions) =>
    bust(cacheTags.gallery, CACHE.gallery, opts),
  feed: (opts?: InvalidateOptions) => bust(cacheTags.feed, CACHE.feed, opts),
  /** Bust the generic content tag (siteSettings, glossaryTerms, etc.). */
  content: (opts?: InvalidateOptions) =>
    bust(cacheTags.content, CACHE.static, opts),
  work: (slug: string, opts?: InvalidateOptions) =>
    bust(cacheTags.work(slug), CACHE.detail, opts),
  page: (slug: string, opts?: InvalidateOptions) =>
    bust(cacheTags.page(slug), CACHE.static, opts),
};

// Re-export the primitives so callers can `import { cacheLife } from "@/lib/cache"`
// instead of reaching into "next/cache" directly.
export { cacheLife, cacheTag };
