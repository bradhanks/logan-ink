# logan.ink

Personal site for Logan Hanks. **Next.js 16 (App Router) · React 19 · Tailwind v4 · TypeScript · deployed on Vercel.**

The production domain is **https://logan.ink**.

## Commands

| Task | Command |
| --- | --- |
| Dev server | `pnpm dev` |
| Production build | `pnpm build` |
| Start built app | `pnpm start` |
| Lint | `pnpm lint` |
| Bundle analysis | `pnpm analyze` (opens treemap reports) |

Package manager is **pnpm**. Always run a `pnpm build` before claiming work is done — TypeScript type-checks during build.

## Architecture / conventions

This repo ships a performance + SEO foundation. Build features on top of it; don't re-invent these pieces.

### Rendering & caching — Cache Components are ON

`cacheComponents: true` in `next.config.ts` enables Partial Prerendering. Three content types per route:

1. **Static** — synchronous JSX, prerendered at build → served from CDN.
2. **Cached** — async data wrapped with the `"use cache"` directive.
3. **Dynamic** — anything reading `cookies()`, `headers()`, or `searchParams`. **Must be wrapped in `<Suspense>`.** You cannot call those APIs inside a `"use cache"` function.

**Cache data through `lib/cache.ts`** — don't hand-write tag strings or raw lifetimes:

```ts
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache";

async function getWork() {
  "use cache";
  cacheLife(CACHE.gallery);     // named lifetime profile
  cacheTag(cacheTags.gallery);  // typed invalidation tag
  return db.work.findMany();
}
```

Invalidate after a mutation (Server Action / route handler):

```ts
import { invalidate } from "@/lib/cache";
invalidate.gallery();                    // background revalidate
invalidate.work(slug, { immediate: true }); // fresh within this request
```

Profiles live in `CACHE` (`static`, `gallery`, `detail`, `feed`); tags in `cacheTags`. Add new ones there, not inline.

### Metadata & SEO

- `lib/site-config.ts` is the **single source of truth** for name, domain, URL. Origin comes from `NEXT_PUBLIC_SITE_URL` (falls back to `https://logan.ink`).
- Root defaults live in `lib/metadata.ts` (`baseMetadata`, wired into `app/layout.tsx`).
- **Per-page metadata:** `export const metadata = buildMetadata({ title, description, path })`. Override only what differs.
- `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts` are generated. When you add a top-level page, register it in `lib/routes.ts` so it lands in the sitemap.
- JSON-LD helpers: `personJsonLd()`, `webSiteJsonLd()`.

### Images

Use `next/image` always. Config (`next.config.ts > images`) serves AVIF/WebP and allows qualities `[50, 70, 85, 100]` — any other `quality` value is rejected. Add remote media origins to `images.remotePatterns`.

### Structural routes (already scaffolded — restyle, don't recreate)

`app/loading.tsx`, `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx` exist as minimal, brand-neutral placeholders. Restyle to taste; keep them.

### Observability

- `app/web-vitals.tsx` reports Core Web Vitals (console in dev, beacons `/api/vitals` in prod).
- `instrumentation.ts` has `register` + `onRequestError` stubs — wire your error/tracing provider there.

### Headers

Security headers + immutable asset caching are set in `next.config.ts > headers()`. A full CSP is intentionally deferred until third-party origins are known — add it via middleware then.

## Conventions

- Path alias: `@/*` → project root.
- Server Components by default; add `"use client"` only when needed (interactivity, browser APIs).
- Keep `lib/` framework-agnostic where possible; co-locate UI in `app/`.
