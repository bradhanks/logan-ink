/**
 * Sanity client for logan.ink.
 *
 * `useCdn: false` — we rely on Next.js Cache Components (`cacheComponents: true`)
 * for caching rather than Sanity's CDN, so every fetch always hits the Sanity API
 * directly (fresh data) and the caller controls staleness via `"use cache"` +
 * `cacheLife`/`cacheTag`.
 *
 * ── How callers should cache fetches ─────────────────────────────────────────
 *
 *   import { sanityFetch } from "@/lib/sanity/client";
 *   import { cacheLife, cacheTag } from "@/lib/cache";
 *   import { CACHE, cacheTags } from "@/lib/cache";
 *
 *   async function getPageData(slug: string) {
 *     "use cache";
 *     cacheLife(CACHE.static);
 *     cacheTag(cacheTags.page(slug));
 *     return sanityFetch(QUERIES.pageBySlug, { slug });
 *   }
 *
 * Do NOT put `"use cache"` inside this module, and do NOT use
 * `export const revalidate` — leave caching to the caller.
 */

import { createClient } from "next-sanity";

const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "dl2yvjg8";
const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-10-01";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
});

/**
 * Typed fetch helper. Runs a GROQ query via the Sanity client.
 *
 * Callers MUST wrap calls in `"use cache"` + `cacheLife`/`cacheTag` —
 * see the module-level doc comment for the pattern.
 *
 * @param query  - GROQ query string (use constants from `@/lib/sanity/queries`)
 * @param params - Optional GROQ parameters (e.g. `{ slug: "about" }`)
 * @param tags   - Optional array of revalidation tags to pass to the fetch
 */
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>,
  tags?: string[],
): Promise<T> {
  return sanityClient.fetch<T>(query, params ?? {}, {
    ...(tags && tags.length > 0 ? { cache: "no-store" } : {}),
    next: tags && tags.length > 0 ? { tags } : undefined,
  });
}
