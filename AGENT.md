# AGENT.md

Guidance for AI coding agents working in this repo. **`CLAUDE.md` is the canonical, detailed version — read it first.** This file is the short brief.

## What this is

Personal site for Logan Hanks at **https://logan.ink**. Next.js 16 (App Router), React 19, Tailwind v4, TypeScript, pnpm, Vercel.

## Non-negotiables

- **Run `pnpm build` before declaring work done.** Type-checking happens at build time; a green build is the bar.
- **Cache Components are enabled** (`cacheComponents: true`). Any component reading `cookies()` / `headers()` / `searchParams` must sit inside `<Suspense>`, and must not be inside a `"use cache"` function.
- **Cache through `lib/cache.ts`** (`CACHE` profiles, `cacheTags`, `invalidate`) — never hardcode tag strings or raw `cacheLife` configs.
- **Metadata through `lib/seo/metadata.ts`** (`buildMetadata(...)`) and `lib/site-config.ts` — don't hardcode the domain.
- **Images** always via `next/image`; allowed `quality` values are `[50, 70, 85, 100]`; `cdn.sanity.io` is pre-allowed.
- **Security is in `proxy.ts`** (Next 16's middleware convention) — CSP (`lib/security/csp.ts`), rate limiting (`lib/rate-limit.ts`), preview `noindex`. Don't duplicate these per-route.
- `robots.ts` / `sitemap.ts` / `lib/seo/jsonld.ts` are owned by the content layer, not this foundation.

## Map

| Path | Purpose |
| --- | --- |
| `lib/site-config.ts` | Name, domain, URLs (single source of truth) |
| `lib/seo/metadata.ts` | `baseMetadata`, `buildMetadata` |
| `lib/cache.ts` | Cache profiles, tags, invalidation helpers |
| `lib/security/csp.ts` | Content-Security-Policy (site + studio) |
| `lib/rate-limit.ts` | Fixed-window rate limiter |
| `proxy.ts` | CSP + rate limiting + preview noindex |
| `app/manifest.ts` | PWA manifest (robots/sitemap owned by content layer) |
| `app/{loading,error,global-error,not-found}.tsx` | Structural boundaries (restyle, keep) |
| `app/web-vitals.tsx`, `app/api/vitals/route.ts` | Core Web Vitals reporting |
| `instrumentation.ts` | Server `register` + `onRequestError` hooks |
| `next.config.ts` | Cache Components, image opt, security + cache headers, bundle analyzer |

## Server-first

Default to Server Components. Reach for `"use client"` only for interactivity or browser APIs. Path alias `@/*` → project root.
