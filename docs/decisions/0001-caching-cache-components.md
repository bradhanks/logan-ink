# ADR 0001 — Caching model: Cache Components (PPR), not classic ISR

- **Status:** Accepted (2026-06-17)
- **Context:** logan.ink is built by two parallel tracks — a perf/infra foundation
  and a content/pages build. They independently picked different caching models;
  this records the resolution so the data layer is built once.

## Decision

Use **Next.js 16 Cache Components** (`cacheComponents: true`, Partial
Prerendering). Do **not** use classic ISR (`export const revalidate`,
`revalidatePath`, or bare `revalidateTag(tag)`).

All server data is cached through the shared toolkit in **`lib/cache.ts`**:

```ts
import { cacheLife, cacheTag, CACHE, cacheTags, invalidate } from "@/lib/cache";

async function getPage(slug: string) {
  "use cache";
  cacheLife(CACHE.static);
  cacheTag(cacheTags.page(slug));
  return sanityFetch(/* ... */);
}

// after a mutation / Sanity webhook:
invalidate.page(slug);                    // background revalidate
invalidate.work(slug, { immediate: true }); // fresh within this request
```

## Consequences

- `revalidateTag` now requires a profile (`revalidateTag(tag, profile)`); the
  `invalidate.*` helpers already pass it. `updateTag(tag)` handles same-request
  freshness.
- Any component reading `cookies()`, `headers()`, or `searchParams` must be
  wrapped in `<Suspense>` and must **not** live inside a `"use cache"` function.
- Maps onto the implementation plan as follows:
  | Plan task | Classic-ISR original | Cache Components replacement |
  | --- | --- | --- |
  | 1.2 `sanityFetch` | perspective + `next: { revalidate }` | wrap callers in `"use cache"` + `cacheTag` |
  | 1.3 / 2.x page fetches | `export const revalidate = N` | `cacheLife(CACHE.<profile>)` in the cached fn |
  | 1.4 revalidate webhook | `revalidateTag`/`revalidatePath` | `invalidate.page(slug)` |
  | 4.2 Field Feed | `revalidate ≈ 6–24h` | `cacheLife(CACHE.feed)` + `cacheTag(cacheTags.feed)` |

## Alternative considered

Keep classic ISR and drop Cache Components. Rejected: PPR gives strictly better
TTFB on this static-shell-heavy site, and the foundation is already built around
it. Revisit only if a hard Cache Components limitation surfaces (e.g. an edge
runtime requirement).
