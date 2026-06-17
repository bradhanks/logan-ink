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
| `/research` | CMS collection | Project portfolio + **publications / author-credit tracker (honest "0→10" framing)** |
| `/reading` | CMS collection | Annotated reading list (lit-review depth) |
| `/glossary` | CMS collection | Methods glossary (odds ratio, DAG, CBPR, causal inference); interlinks with essays |
| `/field` | Live feed | Field Feed: new papers (PubMed), new awards (NIH RePORTER), researcher works (ORCID), org news (RSS), Bluesky |
| `/mancala` | Client game | Fully playable, polished Mancala (Kalah rules) vs. AI |
| `/cv` | Static + print | Print-optimized CV; PDF + vCard download |
| `/api/mcp` | MCP endpoint | Exposes grants/profile/publications/timeline as MCP tools |
| `/api/og/*`, `/sitemap.xml`, `/rss.xml`, `/feed.ics` | Generated | OG images, sitemap, RSS, grant-deadline calendar |

**Nav (global):** Research · Grants · Writing · Timeline · Field · About · *Get in touch* (CTA).
Mancala lives as a subtle nav easter-egg + footer link, not a primary tab. Reading list & glossary are
linked from Writing and the footer.

**Publications page, two versions:**
- **v1 (production, `main`):** honest in-progress framing — real/in-prep work shown truthfully with a
  visible `author credits → 10` progress goal framed as ambition.
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
server components with cached fetches (Next `revalidate`) against keyless public APIs. Mancala is a
client component.

**Live integrations (keyless / free where possible; mock-then-wire):**
- **PubMed E-utilities** (esearch/esummary) — recent papers by tracked researchers. Keyless.
- **NIH RePORTER API** — recent awards in target areas. Keyless.
- **ORCID public API** — latest works by ORCID iD. Keyless.
- **RSS** — NIH/NCI, ACS, Huntsman newsrooms (parse server-side).
- **Bluesky** public API — posts from tracked academic accounts. Keyless.
- **X/Twitter** — best-effort embed only where an account is public; no scraping promised.
- **Newsletter** — provider (Buttondown or Resend Audiences) wired with a placeholder env key Brad
  fills in; UI + API route built and functional behind the key.
Each integration has a typed client, a cached server fetch, **realistic mock data as fallback**, and a
graceful empty/error state. Site never hard-fails if an upstream API is down.

**Theming:** CSS-variable token system (already in `nextjs-assets/styles/globals.css`). Theme resolves
from `prefers-color-scheme` by default, with a manual toggle persisted to `localStorage`; inline
no-flash script in `<head>`. Full `prefers-reduced-motion` support.

**SEO/structured data:** JSON-LD `Person` (Logan), `ScholarlyArticle`/`Article` (essays/pubs),
`BreadcrumbList`. Dynamic OG images per essay/page via `/api/og`. `sitemap.xml`, `robots.txt`,
`rss.xml`, `feed.ics`.

**Analytics:** Google Tag Manager via `@next/third-parties/google` `<GoogleTagManager>` with a
`NEXT_PUBLIC_GTM_ID` env var (placeholder until Brad provides the container ID).

**MCP endpoint:** `app/api/[transport]/route.ts` via `mcp-handler`. Tools: `get_profile`,
`list_grants`, `get_grant`, `list_publications`, `list_timeline`, `list_research`. Read-only, sourced
from the same Sanity data the site renders. Documented at `/field` or `/about` for collaborators.

---

## 5. Design language & interaction corrections

Port the existing token system, three-font stack (Fraunces display, Newsreader body, Outfit UI), glass
cards (dark) / solid surfaces (light), and the Mancala + Wordmark + TransFlag components verbatim from
`nextjs-assets/`.

**Corrections to the Claude Design (reject its over-cleverness at p < .05):**
1. **Profile image** — remove the gimmicky hover transformation; a calm, confident portrait with a
   restrained gradient ring. No trickery.
2. **Cursor** — replace the over-engineered dual-element cursor with a subtle, understated custom
   cursor that *signals interactivity* (grows slightly over actionable elements) and is fully disabled
   on touch and under reduced-motion. Cool, not loud.
3. **Micro-interactions hint at function, not cleverness** — expandable grant rows, filter chips,
   reveal-on-scroll used to guide attention; nothing decorative-only.
4. **Inclusiveness stays subtle** — color system + typographic warmth + the trans-flag accent bar used
   sparingly; never a headline.
5. **Authority over whimsy** — the Mancala/whimsy lives in the logomark and the `/mancala` page;
   everything else reads as a credible field resource.

---

## 6. Content to research & write (delegated to build)

- **Grant hub** — accurate, current profiles: NIH/NCI (incl. CCPS pilot mechanisms, R/K mechanisms an
  early-career person realistically touches), **American Cancer Society** (research & training grants),
  **Huntsman Cancer Institute** (pilot/CCSG programs, Cancer Health Equity), HRSA Office of Rural Health
  Policy, CDC (NBCCEDP, PRCs), RWJF, and the **Mountain West regional** landscape. Each: who they fund,
  mechanism types, how an undergrad/early-career person plugs in, deadlines (for the iCal tracker).
- **Two backdated thought-leadership essays** (technical, credible, dated as weekly posts):
  1. *Odds ratios* — what they really mean, how they mislead, interpreting them honestly.
  2. *Why sophisticated regression & design get papers accepted* — grounded in Kepka-group experience
     and conversations with researchers about what reviewers reward.
  Each ends with a **collaborate CTA** tied to the 10-credits / top-program goal.
- **Target grad programs** — identify the genuine top cancer-prevention / population-science programs
  and write authentic "why I want to go *there*" rationales (public).
- **Methods glossary** + **annotated reading list** seed entries.

**Private deliverable (NOT a public page):** `STRATEGY-target-professors.md` — associate/early-career
professors at top programs who are research-aligned and pre-tenure (timing: up for tenure 1–2 years
after Logan finishes undergrad), plus the diversity-as-leverage framing. For Brad's eyes; never shipped.

---

## 7. Mancala game

Full, polished, playable **Kalah (6,4)** implementation as a client component:
- Real rules: sowing, capture, free turn on landing in own store, end-game sweep, win/draw detection.
- Single-player vs. a minimax/heuristic AI (selectable difficulty); optional local 2-player.
- Visuals built on the existing wood-board + stone-color system; smooth sow animation honoring
  reduced-motion; keyboard-accessible pits with ARIA; score + turn state; reset/new game.
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

## 11. Out of scope (YAGNI)

Auth/user accounts; comments; multi-author; e-commerce; X/Twitter scraping; a custom CMS; non-Sanity
headless backends; native mobile.
