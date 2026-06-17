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
- Root defaults live in `lib/seo/metadata.ts` (`baseMetadata`, wired into `app/layout.tsx`).
- **Per-page metadata:** `export const metadata = buildMetadata({ title, description, path })`. Override only what differs.
- `app/manifest.ts` is generated here. **`robots.ts`, `sitemap.ts`, and `lib/seo/jsonld.ts` are owned by the content layer** (Sanity-driven, implementation-plan Phase 5.2) — they are intentionally *not* in this foundation.

### Security & proxy (`proxy.ts` — Next 16's middleware convention)

Platform-level, runs in front of every route:
- **CSP** — built in `lib/security/csp.ts`; strict `site` policy + relaxed `studio` policy. Note: `script-src` keeps `'unsafe-inline'` while GTM + the inline theme script exist; harden to hashes/nonce later (documented in the file).
- **Rate limiting** — `lib/rate-limit.ts` throttles `/api/*` and `/mcp/*` (60/min per IP per endpoint; `/api/vitals` exempt). In-memory/per-instance today; back with Upstash/Vercel KV before launch for durable limits.
- **Index hygiene** — `X-Robots-Tag: noindex` on non-production hosts (previews) and on `/studio`, `/api`, `/mcp`, `/draft`. Only `logan.ink` indexes.

Static, non-varying security headers (HSTS, nosniff, etc.) live in `next.config.ts > headers()`.

### Images

Use `next/image` always. Config (`next.config.ts > images`) serves AVIF/WebP and allows qualities `[50, 70, 85, 100]` — any other `quality` value is rejected. `cdn.sanity.io` is already allowed; add other remote media origins (e.g. feed avatars) to `images.remotePatterns`.

### Caching decision

See `docs/decisions/0001-caching-cache-components.md` — Cache Components, not classic ISR.

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
