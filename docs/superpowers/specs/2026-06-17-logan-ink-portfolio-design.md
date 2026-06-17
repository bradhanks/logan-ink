# logan.ink — Design Spec

**Date:** 2026-06-17
**Owner:** Brad Hanks (for Logan Hanks)
**Status:** Awaiting approval

---

## 1. Purpose & positioning

logan.ink is a portfolio + travelogue + journal documenting Logan Hanks's progress toward a top
graduate program in cancer prevention / population science. It must read, to a graduate admissions
committee, as the work of someone who has done a complete literature review of the field and is ready
to materially help a researcher publish more and better papers.

Three jobs, in priority order:

1. **Credibility** — demonstrate genuine command of the field (grants, methods, the literature) and the
   technical chops (regression, causal inference, data work) that get papers accepted.
2. **Momentum** — show an accelerating trajectory toward the explicit goal of **~10 author credits by
   grad-school application** and admission to a tippy-top program.
3. **Personality** — a distinctive, warm, analytically-rigorous voice; the right-brain/left-brain brand;
   subtle (not loud) inclusiveness.

**Brand thesis:** "both hemispheres at full ramp" — rigorous quantitative analysis *and* strong writing.
The Mancala board is the logomark (Logan was a 5th-grade Mancala champion, 2018): a game of counting,
foresight, and sowing — analysis made playful. The trans identity is present only through the color
system and typographic warmth, never as a banner.

---

## 2. Known facts vs. drafted content

The design export establishes these facts; the build treats them as true:

- Logan Hanks, he/him. Utah State University, class of '28 (current undergraduate).
- Affiliated with the **Kepka Group at Huntsman Cancer Institute (HCI)**; mentor **Dr. Deanna Kepka**.
- Based in Utah (Mountain West framing).
- 5th-grade Mancala champion, Willowcreek, 2018.
- Research interests: HPV vaccination equity, rural cancer prevention, CBPR, place-based vulnerability.

Everything not on that list (specific bio prose, exact author-credit count, skills inventory, contact
email, social handles, dated timeline events, essay specifics) is **drafted plausibly and flagged**.
A single file **`CONFIRM-THESE-FACTS.md`** at repo root lists every invented/assumed fact with its
location, so Logan/Brad can correct in one pass. The site is truthful-by-construction once that file is
reconciled.

---

## 3. Sitemap

| Route | Type | Content |
|---|---|---|
| `/` | Home (page-builder) | Composed from a Sanity `page` of drag-orderable sections: hero, credential strip, engineering-mindset, featured research, grants teaser, mission, heroes, Field Feed teaser, contact |
| `/studio` | Sanity Studio | Embedded CMS + page builder + Presentation (visual click-to-edit) |
| `/about` | Static (CMS bio) | Long-form bio; right/left-brain story; Kepka mentorship; identity woven subtly |
| `/timeline` | CMS collection | The travelogue/journal — dated entries, grows over time; the progress spine |
| `/writing` | CMS collection index | Essays + newsletter issues |
| `/writing/[slug]` | CMS doc | Individual essay; collaborate CTA; JSON-LD + dynamic OG image |
| `/grants` | CMS + data | Authoritative grant hub: NIH/NCI, ACS, Huntsman/HCI, HRSA, CDC, RWJF, Mountain West regional; filters; deadline tracker w/ iCal export |
| `/grants/[slug]` | CMS doc (SEO) | One indexable page **per grant mechanism / org** (e.g. NIH F31, ACS RSG) — the primary organic-search assets; FAQ schema, citations, internal links |
| `/research` | CMS collection | Project portfolio + publications (honest, narrative-ambition framing — no gamified counter) |
| `/reading` | CMS collection | Annotated reading list (lit-review depth) |
| `/glossary` | CMS collection | Methods glossary index (odds ratio, DAG, CBPR, causal inference) |
| `/glossary/[term]` | CMS doc (SEO) | One indexable page per methods term; auto-linked from essays/grants |
| `/field` | Live feed | Field Feed: new papers (PubMed), new awards (NIH RePORTER), researcher works (ORCID), org news (RSS), Bluesky |
| `/mancala` | Client game | Fully playable, polished Mancala (Kalah rules) vs. AI |
| `/cv` | Static + print | Print-optimized CV; PDF + vCard download |
| `/mcp/[transport]` | MCP endpoint | Exposes grants/profile/publications/timeline as MCP tools (isolated from `/api/*`) |
| `/api/og/*`, `/sitemap.xml`, `/rss.xml`, `/feed.ics` | Generated | OG images, sitemap, RSS, grant-deadline calendar |

**Nav (global):** Research · Grants · Writing · Timeline · Field · About · *Get in touch* (CTA).
Mancala lives as a subtle nav easter-egg + footer link, not a primary tab. Reading list & glossary are
linked from Writing and the footer.

**Publications page, two versions:**
- **v1 (production, `main`):** honest in-progress framing — real/in-prep work shown truthfully. Ambition
  expressed *narratively* ("building toward a substantial publication record before graduate
  applications"), **not** as a literal "N/10" scoreboard. Publicly counting author credits gamifies
  authorship and reads as naïve to an admissions committee; the explicit "10 credits" target lives in
  the private strategy doc, not on the site.
- **v2 (feature branch `feature/pubs-aspirational`):** full publications UI with clearly-marked
  placeholder entries. Vercel auto-deploys the branch to a **preview URL** Brad can view; never merged
  to production until real credits justify it.

---

## 4. Architecture

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4 (ported token system) ·
Sanity (hosted CMS + Studio at `/studio`) · `@next/third-parties` for GTM · `mcp-handler` for MCP.

**Content model — Sanity** (non-dev editing for Logan; official Sanity MCP installed):
- `essay` (writing/thought-leadership; `kind: essay|newsletter`; newsletter issues render in `/writing`)
- `timelineEntry`, `researchProject`, `publication`, `grant`, `heroPerson`, `readingItem`,
  `glossaryTerm`, `siteSettings` (bio, "now" status line, socials, contact).
- `page` — page-builder document (see below).
- Newsletter publish flow: a `newsletter` essay, once published, appears in `/writing` *and* triggers
  the email send (provider webhook). One write, two surfaces.

**Page builder (drag-and-drop, fully integrated).** A `page` document holds a `sections[]` array of
typed section objects — `heroSection`, `credentialStrip`, `mindsetSection`, `researchGrid`,
`grantDirectory`, `missionStatement`, `heroesList`, `fieldFeedTeaser`, `richText`, `cta`,
`imageGallery`. Each section is its own React component on the front end. In the Studio, Logan **drags
to reorder, add, or remove sections** to compose/restructure pages without code. The home page (and any
future marketing pages) is rendered from a `page` document; content-collection routes (writing,
grants, etc.) keep their purpose-built layouts. New section types are added by registering a schema +
a component (the only dev touchpoint).

**Visual editing (Presentation tool).** Sanity's **Presentation tool** is enabled: an in-Studio
side-by-side live preview of the real site with **click-to-edit overlays** — Logan clicks any element
on the page preview and edits it in place, sees drafts live (Next.js draft mode + `@sanity/visual-editing`
overlays + `@sanity/react-loader` for live queries). This is the "build pages visually" experience:
structured page-building + live click-to-edit, not a pixel canvas.

**Why Sanity:** free tier, zero infra/DB to manage, best-in-class Next.js support, polished Studio +
Presentation visual editing for a non-developer, page-builder pattern, official MCP. One-time
`npx sanity login` from Brad; everything else scaffolded.

**Rendering:** Static/ISR for content pages (revalidate on Sanity webhook). Field Feed routes use
server components with cached fetches against keyless public APIs. Mancala is a client component.

**Live integrations (keyless / free where possible; mock-then-wire):**
- **PubMed E-utilities** (esearch/esummary) — recent papers by tracked researchers. Keyless.
- **NIH RePORTER API** — recent awards in target areas. Keyless.
- **ORCID public API** — latest works by ORCID iD. Keyless.
- **RSS** — NIH/NCI, ACS, Huntsman newsrooms (parse server-side).
- **Bluesky** public API — posts from tracked academic accounts. Keyless.
- **X/Twitter** — best-effort embed only where an account is public; no scraping promised.
- **Newsletter** — **Buttondown** (generous free tier, simple API, RSS-friendly). Wired with a
  placeholder `BUTTONDOWN_API_KEY`; signup UI + `/api/newsletter` route built and functional behind the
  key. Newsletter→blog dual-publish is **idempotent**: the Sanity `newsletter` doc is the source of
  truth and renders in `/writing`; sending the email is a separate, manually-triggered action keyed by
  the doc's slug+revision so a republish/edit can never double-send.

**Caching & rate limits (Field Feed).** PubMed (~3 req/s keyless) and the other feeds are fetched
**server-side and cached** with a long `revalidate` window (≈6–24h) — never per-visitor request — and
requests are batched/throttled. **No fabricated data on production:** mock fixtures are used only in
local dev; in production each panel shows real cached data with a visible "updated" timestamp, and on
upstream failure falls back to the **last-known-good cached result** (or an honest "couldn't reach
{source}" empty state), never invented entries. Site never hard-fails if an upstream API is down.

**Visual editing prerequisites (not zero-config).** Presentation/visual-editing needs: a Sanity
**viewer token** (`SANITY_VIEWER_TOKEN`, read-only) for draft perspective, Next.js **draft mode** with
a `/api/draft` enable/disable route, the deployed URL added to Sanity **CORS origins**, and the studio
`presentationTool` pointed at the preview route. All scaffolded; the token is the one secret to set.

**Theming:** CSS-variable token system (already in `nextjs-assets/styles/globals.css`). Theme resolves
from `prefers-color-scheme` by default, with a manual toggle persisted to `localStorage`; inline
no-flash script in `<head>`. Full `prefers-reduced-motion` support.

**SEO, AEO & organic discovery (first-class goal: rank for grant searches; be the source LLMs cite).**
The grant hub, fellowship pipeline, and glossary are not just résumé padding — they are the **rankable,
citable assets** that pull organic traffic and raise Logan's profile. Strategy:

- **Content architecture for search.** Each grant mechanism/org (`/grants/[slug]`) and each methods term
  (`/glossary/[term]`) is its **own indexable page**, targeting real long-tail informational queries
  ("NIH F31 eligibility population science", "ACS research scholar grant deadline", "rural cancer
  prevention grants Utah", "how to interpret an odds ratio"). Hub-and-spoke internal linking; glossary
  terms auto-link wherever they appear in essays/grants.
- **Technical SEO.** SSG/ISR → fast, fully-crawlable HTML; semantic headings; canonical URLs; unique
  per-page `<title>`/meta/OG/Twitter; dynamic OG images via `/api/og`; strong Core Web Vitals;
  mobile-first; accessibility (correlates with ranking). `sitemap.xml` (with priorities), `robots.txt`,
  `rss.xml`, `feed.ics`.
- **Structured data.** JSON-LD `Person` (Logan) with `sameAs` → ORCID/Google Scholar/LinkedIn/GitHub
  (entity/knowledge-graph signal), `ScholarlyArticle`/`Article` for essays & pubs, **`FAQPage`** on
  grant & glossary pages, `BreadcrumbList`, and a `Dataset`/`ItemList` for the grant tracker.
- **E-E-A-T.** Author bylines tying content to Logan + the Kepka/HCI affiliation; every grant fact cites
  its primary source (NIH/NCI/ACS URLs) — trust signals for both Google and LLMs.
- **AEO (answer-engine optimization).** Each grant/glossary/essay page opens with a concise,
  extractable **TL;DR / direct-answer block** and canonical definitions LLMs can lift verbatim;
  `FAQPage` schema; an **`llms.txt`** at root describing the site + key resources for AI crawlers;
  `robots.txt` **deliberately permits** reputable AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
  Google-Extended) so the content is ingested and cited; and the **MCP endpoint** is itself an AEO
  surface — agents can query Logan's grant/profile data directly. Freshness signals (Field Feed,
  timeline, newsletter, RSS) keep the corpus updating, which both search and answer engines reward.

**Analytics:** Google Tag Manager container **`GTM-TXP27537`** (confirmed by Brad), wired via
`@next/third-parties/google` `<GoogleTagManager gtmId="GTM-TXP27537" />`, which injects **both** the
`<head>` loader and the post-`<body>` `<noscript>` iframe on every route automatically — no manual
snippet pasting. ID stored in `NEXT_PUBLIC_GTM_ID` (defaulting to `GTM-TXP27537`). Default to **Google
Consent Mode v2 (denied)** with a minimal, dismissible consent banner — no PII collected; keeps EU
visitors compliant and the site reputable.

**MCP endpoint:** `mcp-handler` mounted at its **own** path — `app/mcp/[transport]/route.ts` with
`basePath: "/mcp"` → public URL `/mcp/<transport>` (e.g. `/mcp/mcp`). It is deliberately **not** placed
at `app/api/[transport]/` — a catch-all there would shadow the whole `/api/*` namespace and collide with
`/api/og`, `/api/revalidate`, and `/api/newsletter`. Tools: `get_profile`, `list_grants`, `get_grant`,
`list_publications`, `list_timeline`, `list_research`. Read-only, sourced from the same Sanity data the
site renders. Documented at `/about` for collaborators.

---

## 5. Design language & interaction corrections

Port the existing token system, three-font stack (Fraunces display, Newsreader body, Outfit UI), glass
cards (dark) / solid surfaces (light), and the Mancala + Wordmark + TransFlag components verbatim from
`nextjs-assets/`.

**Corrections to the Claude Design (reject its over-cleverness at p < .05):**
1. **Profile image** — remove the gimmicky hover transformation; a calm, confident portrait with a
   restrained gradient ring. No trickery.
2. **Cursor** — *remove* the over-engineered dual-element follower cursor entirely (the lagging ring IS
   the over-cleverness). Keep the **native cursor** and let restrained affordances carry it: tasteful
   `:hover`/`:focus-visible` states, a small accent only on genuinely interactive elements. If any
   custom touch survives at all, it's a single low-key accent dot that never lags the pointer — and it
   is disabled on touch, on coarse pointers, and under reduced-motion. Default to native.
3. **Micro-interactions hint at function, not cleverness** — expandable grant rows, filter chips,
   reveal-on-scroll used to guide attention; nothing decorative-only.
4. **Inclusiveness stays subtle** — color system + typographic warmth + the trans-flag accent bar used
   sparingly; never a headline.
5. **Authority over whimsy** — the Mancala/whimsy lives in the logomark and the `/mancala` page;
   everything else reads as a credible field resource.

---

## 6. Content to research & write (delegated to build)

- **Grant hub** — accurate, current profiles, organized around a **career-stage accessibility lens**
  (every entry tagged who-can-realistically-apply: undergrad / post-bacc / predoctoral / faculty), so
  the hub never naïvely lists an R01 as if an undergrad could get one. Org profiles: NIH/NCI,
  **American Cancer Society**, **Huntsman Cancer Institute** (pilot/CCSG, Cancer Health Equity), HRSA
  Office of Rural Health Policy, CDC (NBCCEDP, PRCs), RWJF, and the **Mountain West regional** landscape.
  Each: who they fund, mechanism types, how an early-career person plugs in, deadlines (iCal tracker).
- **Trainee / fellowship pipeline (CRITICAL — was missing).** For someone heading to grad school, the
  fellowship pipeline *is* the relevant money and the more honest thing to showcase command of:
  **NSF GRFP**, **NIH F31 / F30 (NRSA predoctoral)**, **NIH diversity supplements**, **R25/R36**,
  Cancer Center **T32** training grants, ACS fellowships & **ACS diversity in cancer research** programs,
  and undergrad/post-bacc on-ramps (NCI/HCI summer programs, CURE). This section signals that Logan
  understands the *trainee funding ladder*, not just headline institutional grants.
- **Two backdated thought-leadership essays** (technical, credible, dated as weekly posts):
  1. *Odds ratios* — what they really mean, how they mislead, interpreting them honestly.
  2. *Why sophisticated regression & design get papers accepted* — grounded in Kepka-group experience
     and conversations with researchers about what reviewers reward.
  Each ends with a **collaborate CTA** — framed as offering technical/analytic help to push a paper
  toward acceptance, tied to the top-program goal (no literal author-credit counter; see §3).
- **Target grad programs** — identify the genuine top cancer-prevention / population-science programs
  (e.g. Harvard Chan, Johns Hopkins Bloomberg, UNC Gillings, Michigan, UW/Fred Hutch, Yale, Emory,
  Stanford, MD Anderson/UTHealth — verify current standings via web research at build time, including
  Utah/HCI's own program given the Kepka tie) and write authentic "why I want to go *there*" rationales.
- **Methods glossary** + **annotated reading list** seed entries.
- **Accuracy guardrail:** all grant facts, deadlines, mechanism names, and Dr. Kepka's real role/titles
  are verified via web research at build time; anything unverifiable is flagged in `CONFIRM-THESE-FACTS.md`
  and never presented as confirmed. Deadlines in the iCal feed are marked *estimated* vs *confirmed* and
  carry the cycle year, so stale prior-year dates are never shown as current.

**Private deliverable (NOT a public page):** `STRATEGY-target-professors.md` — associate/early-career
professors at top programs who are research-aligned and pre-tenure (timing: up for tenure 1–2 years
after Logan finishes undergrad), plus the diversity-as-leverage framing. For Brad's eyes; never shipped.

---

## 7. Mancala game

Full, polished, playable **Kalah (6,4)** implementation as a client component:
- Real rules: sowing, capture, free turn on landing in own store, end-game sweep, win/draw detection.
- Single-player vs. a minimax/heuristic AI (selectable difficulty); optional local 2-player.
- Visuals built on the existing wood-board + stone-color system; smooth sow animation honoring
  reduced-motion; keyboard-accessible pits with ARIA; an `aria-live` region announcing moves, captures,
  free turns, and game end; score + turn state; reset/new game.
- Tasteful, not arcade-y — matches the site's restraint.

---

## 8. Export audit & cleanup (final step)

`claude_design_project_export/*` is the source of truth **during** the build. As the final task:
1. Audit every export file; confirm each useful asset/snippet/content fragment is ported into the app.
2. Write `EXPORT-AUDIT.md` mapping export source → where it landed (or why intentionally dropped).
3. **Delete `claude_design_project_export/`.**

---

## 9. Deployment

Push repo to Brad's GitHub; create a Vercel project linked to it; attach domain **logan.ink**; set env
vars (Sanity project/dataset/token, `NEXT_PUBLIC_GTM_ID`, newsletter key placeholder). Production from
`main`; `feature/pubs-aspirational` gets an automatic preview URL for the v2 publications preview.

---

## 10. Build approach

Full autonomous build with self-review passes (I critique and improve my own work before handing off).
Sequence: foundation/design-system → theme + layout/nav + GTM → home → content pages (about, research,
grants, timeline, writing, reading, glossary, cv) → Field Feed integrations → Mancala → MCP endpoint →
Sanity wiring → researched content authored → SEO/OG/sitemap/RSS/iCal → export audit + cleanup → deploy.

---

## 11. Risks, guardrails & compatibility (review pass 2)

- **Stack bleeding-edge compat (top risk).** Next 16 + React 19 + embedded Sanity Studio (`sanity`,
  `next-sanity`, `@sanity/visual-editing`) is very new. **Verify peer-dep compatibility before building
  the CMS layer.** Fallback if Studio won't embed cleanly under React 19/Next 16: run Studio as a
  standalone deploy (or a route group with its own React tree) and keep the front end on Next 16.
  This check happens in the foundation phase, before content modeling.
- **Drop stray dependency.** `@anthropic-ai/claude-code` is in `package.json` deps — it's the CLI, not a
  site dependency; remove it (large, unnecessary in the bundle/install).
- **Domain readiness.** Confirm `logan.ink` is registered/owned before DNS work; if not, that's a
  blocker to surface immediately.
- **Image strategy & rights.** Only `public/logan.png` exists; the design references many photos that
  don't. Use `next/image`, graceful placeholders for missing assets, and **never use unlicensed
  headshots of real people** (the heroes list — Doherty, Ulrich, Gawande, etc.). Prefer link-outs,
  initials, or illustration over scraped photos; credit anything licensed.
- **Structured-data integrity (anti-spam).** Emit `ScholarlyArticle`/`Article` JSON-LD **only for real,
  verifiable items** — never for placeholder/aspirational pubs (fake structured data risks a Google
  manual action and undercuts the credibility goal).
- **Index hygiene.** `/studio`, `/api/*`, `/mcp/*`, draft-mode routes, and **all preview/branch
  deployments** (incl. the v2 pubs preview) must be `noindex` / robots-excluded so Google never indexes
  the CMS or unfinished content. Only production canonical URLs are indexable.
- **Contact form.** Needs anti-spam (honeypot + Vercel BotID) and a real delivery path (Resend) — not a
  dead form.
- **PubMed/RePORTER etiquette.** Include `tool` + `email` params on E-utilities calls, respect rate
  limits, and attribute sources; stay within terms of use.
- **Newsletter rendering.** Email HTML is generated **from** the Sanity `newsletter` Portable Text (one
  source of truth) via a portable-text→email-HTML transform, so blog and email never drift.
- **Font weight budget.** Three families (Fraunces variable, Newsreader, Outfit) — subset aggressively,
  limit shipped weights/axes, `display: swap`, to protect Core Web Vitals (which feeds SEO).

---

## 12. Out of scope (YAGNI)

Auth/user accounts; comments; multi-author; e-commerce; X/Twitter scraping; a custom CMS; non-Sanity
headless backends; native mobile; i18n/localization.
