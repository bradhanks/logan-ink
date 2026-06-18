# Claude Design Export — Audit

Confirms what was used from `claude_design_project_export/` before the directory was
removed (it was gitignored / local-only and never part of the repo).

## Ported / used

| Export source | Landed in / used for |
|---|---|
| `nextjs-assets/lib/tokens.ts` | `lib/tokens.ts` (design tokens) |
| `nextjs-assets/lib/fonts.ts` | `lib/fonts.ts` (Fraunces / Newsreader / Outfit via next/font) |
| `nextjs-assets/styles/globals.css` | folded into `app/globals.css` (token system, `.reveal`, `flagShimmer`, theme vars) |
| `nextjs-assets/components/{MancalaLogo,Wordmark,TransFlag}.tsx` | `components/brand/*` |
| `nextjs-assets/hooks/{useReveal,useScrollProgress}.ts` | `hooks/*` |
| `nextjs-assets/public/logan.png` | `public/logan.png` (hero portrait) |
| `Logan Hanks - Standalone src.html` | reference for the home page section layouts (`components/sections/*`) |
| `layouts.html`, `branding.html`, `index*.html` | reference for page types, nav/footer, brand treatment |
| Mancala board concept (champion-2018 brand) | `lib/mancala/*` + `components/mancala/*` + `/mancala` |
| Grant-directory / research / heroes structure | the grants hub, research, heroes content + sections |

## Intentionally NOT ported (with reason)

| Export item | Why dropped |
|---|---|
| `design-canvas.jsx`, `image-slot.js` | Claude-Design canvas tooling, not site code |
| `assets-checklist.html` | a to-do list of photos to collect, not an asset |
| `uploads/IMG_1694.png`, `uploads/pasted-*.png` | design-reference screenshots / drafts, no confirmed site use; real people's photos are intentionally avoided (image-rights guardrail — heroes use link/initials, not photos) |
| over-clever cursor / profile-hover interactions | deliberately rejected per the brief (interaction-restraint) |
| `Logan Hanks.html` / `Logan Hanks (1).html` (16 MB) | full inlined export — read for reference, superseded by the built app |

## Notes
- `public/logan.png` is ~11 MB; it is served optimized via `next/image`, but compressing the
  source is a worthwhile follow-up.
- Everything design-bearing in the export is now represented in the app; the directory was removed.
