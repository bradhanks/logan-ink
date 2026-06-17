# Confirm These Facts

Everything on this list was **assumed, inferred from the Claude Design export, or invented plausibly**
during the build because the real value wasn't provided. Logan / Brad: correct anything wrong, fill the
blanks, then we replace the placeholders and delete the resolved rows. **Nothing here is verified.**

Legend: ⬜ = needs confirmation · ✅ = confirmed (date) · ✏️ = corrected value provided

---

## Identity & bio (from the design export — treated as true, please confirm)
- ⬜ Name shown publicly: **Logan Hanks**, pronouns **he/him**.
- ⬜ School / status: **Utah State University, class of '28** (current undergraduate).
- ⬜ Affiliation: **Kepka Group at Huntsman Cancer Institute (HCI)**; mentor **Dr. Deanna Kepka**.
- ⬜ Location: **Utah** (Mountain West framing).
- ⬜ Biographical detail: **5th-grade Mancala champion, Willowcreek, 2018.**
- ⬜ Grad-school application target cycle (e.g. Fall 2027?) — needed for the timeline/narrative.
- ⬜ Real research tasks done so far with the Kepka group (data cleaning, lit review, manuscript prep, coding/stats?).
- ⬜ Current author credits, if any, and any real papers/projects touched.
- ⬜ Technical skills he genuinely has now (R, Python, SAS, Stata, REDCap, regression, GIS?) vs. learning.

## Contact & links (`lib/site-config.ts`, footer, JSON-LD `sameAs`, vCard)
- ⬜ Public contact email (currently none wired).
- ⬜ Social/profile links: GitHub, LinkedIn, ORCID iD, Google Scholar, X/Bluesky — needed for footer + `sameAs` SEO/AEO entity signal.
- ⬜ `siteConfig.description` — currently placeholder "The work of Logan Hanks." Needs real tagline.
- ⬜ `siteConfig.twitterHandle` — currently `null`. Set if there is one.

## Field Feed tracked researchers (`lib/feed/tracked.ts`)
- ⬜ **Dr. Deanna Kepka** — confirm ORCID iD, PubMed query, affiliation string, Bluesky handle (all placeholders).
- ⬜ Seed peers chosen plausibly (cancer-prevention / population-science): **Electra Paskett**, **Jennifer Wenzel** — confirm these are the right people to track, or swap for researchers better aligned with Logan's target labs.
- ⬜ ORCID iDs / Bluesky handles for all tracked researchers are placeholders — supply real ones so the feed attributes correctly.

## Theme / brand
- ⬜ Brand theme colors applied: light bg `#F8F5F0`, dark bg `#070C1A` (from `lib/tokens.ts`) — confirm these read right in both modes.

## To be added as the build proceeds
- Backdated essay publish dates (Phase 6) — plausible recent weeks; confirm acceptable.
- Target grad programs & "why there" rationales (Phase 6) — researched, then confirm alignment.
- Any photo beyond `public/logan.png` (hero badges, etc.) — currently only one image exists.

---
*Maintained automatically during the build. When you resolve a row, mark it ✅/✏️ and we'll wire the real value.*
