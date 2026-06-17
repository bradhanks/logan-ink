/**
 * Visual-editing / Draft Mode helpers for logan.ink.
 *
 * ── Why not `defineLive`? ────────────────────────────────────────────────────
 * `next-sanity`'s `defineLive` ships its own live-content + revalidation model
 * (`<SanityLive/>` + tag-based `revalidateTag` on every query) that fights with
 * Cache Components (`cacheComponents: true`). It would push us toward bare
 * `revalidateTag`/forced revalidation, which this project forbids. Instead we
 * use the lighter, fully cache-compatible split:
 *
 *   • PUBLISHED reads  → stay cacheable. Callers wrap `sanityFetch` (from
 *     `@/lib/sanity/client`) in `"use cache"` + `cacheLife`/`cacheTag`. Those
 *     reads never touch `draftMode()`, so they prerender static.
 *
 *   • DRAFT reads      → DYNAMIC. Use `sanityFetchDraftAware` below, which calls
 *     `draftMode()`. Anything that reads the draft cookie MUST live outside
 *     `"use cache"` and inside a `<Suspense>` boundary, otherwise it would force
 *     the whole page dynamic.
 *
 * Visual editing itself is done with Draft Mode + `@sanity/visual-editing`'s
 * `<VisualEditing/>` click-to-edit overlays, mounted only when Draft Mode is on.
 */

import "server-only";

import { draftMode } from "next/headers";
import { sanityClient } from "@/lib/sanity/client";

const viewerToken = process.env.SANITY_VIEWER_TOKEN;

/**
 * Draft-aware fetch for preview surfaces.
 *
 * When Draft Mode is enabled it reads the `drafts` perspective with stega
 * encoding (so `@sanity/visual-editing` can resolve click-to-edit targets) and
 * authenticates with the viewer token. When Draft Mode is off it falls back to
 * the plain published client fetch.
 *
 * IMPORTANT (Cache Components): this function calls `draftMode()`, so it is
 * dynamic. Do NOT call it inside a `"use cache"` function. Call it from a server
 * component rendered inside `<Suspense>`. For normal published pages, use the
 * cacheable `sanityFetch` from `@/lib/sanity/client` instead.
 */
export async function sanityFetchDraftAware<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  const { isEnabled } = await draftMode();

  if (!isEnabled) {
    return sanityClient.fetch<T>(query, params);
  }

  return sanityClient
    .withConfig({
      token: viewerToken,
      perspective: "drafts",
      stega: true,
      useCdn: false,
    })
    .fetch<T>(query, params);
}

export { sanityClient };
