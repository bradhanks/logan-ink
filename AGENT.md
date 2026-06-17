# AGENT.md

Guidance for AI coding agents working in this repo. **`CLAUDE.md` is the canonical, detailed version — read it first.** This file is the short brief.

## What this is

Personal site for Logan Hanks at **https://logan.ink**. Next.js 16 (App Router), React 19, Tailwind v4, TypeScript, pnpm, Vercel.

## Non-negotiables

- **Run `pnpm build` before declaring work done.** Type-checking happens at build time; a green build is the bar.
- **Cache Components are enabled** (`cacheComponents: true`). Any component reading `cookies()` / `headers()` / `searchParams` must sit inside `<Suspense>`, and must not be inside a `"use cache"` function.
- **Cache through `lib/cache.ts`** (`CACHE` profiles, `cacheTags`, `invalidate`) — never hardcode tag strings or raw `cacheLife` configs.
- **Metadata through `lib/metadata.ts`** (`buildMetadata(...)`) and `lib/site-config.ts` — don't hardcode the domain.
- **Images** always via `next/image`; allowed `quality` values are `[50, 70, 85, 100]`.
- Register new top-level pages in `lib/routes.ts` so they reach the sitemap.

## Map

| Path | Purpose |
| --- | --- |
| `lib/site-config.ts` | Name, domain, URLs (single source of truth) |
| `lib/metadata.ts` | `baseMetadata`, `buildMetadata`, JSON-LD |
| `lib/cache.ts` | Cache profiles, tags, invalidation helpers |
| `lib/routes.ts` | Static route registry for the sitemap |
| `app/{robots,sitemap,manifest}.ts` | Generated SEO/PWA files |
| `app/{loading,error,global-error,not-found}.tsx` | Structural boundaries (restyle, keep) |
| `app/web-vitals.tsx`, `app/api/vitals/route.ts` | Core Web Vitals reporting |
| `instrumentation.ts` | Server `register` + `onRequestError` hooks |
| `next.config.ts` | Cache Components, image opt, security + cache headers, bundle analyzer |

## Server-first

Default to Server Components. Reach for `"use client"` only for interactivity or browser APIs. Path alias `@/*` → project root.
