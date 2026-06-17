/**
 * Logan Hanks — Font Setup
 * lib/fonts.ts
 *
 * Uses next/font/google (zero layout shift, automatic self-hosting).
 * Import { fraunces, newsreader, outfit } and apply to <html> in layout.tsx.
 */

import { Fraunces, Newsreader, Outfit } from "next/font/google"

// ── FRAUNCES — Display / Wordmark ─────────────────────────────────────────────
// Variable axes: wght (100–900), opsz (optical size), SOFT, WONK
export const fraunces = Fraunces({
  subsets:  ["latin"],
  axes:     ["SOFT", "WONK", "opsz"],
  weight:   "variable",
  style:    ["normal", "italic"],
  display:  "swap",
  variable: "--font-fraunces",
})

// ── NEWSREADER — Body Serif ───────────────────────────────────────────────────
// Variable axes: wght (200–800), opsz
export const newsreader = Newsreader({
  subsets:  ["latin"],
  axes:     ["opsz"],
  weight:   "variable",
  style:    ["normal", "italic"],
  display:  "swap",
  variable: "--font-newsreader",
})

// ── OUTFIT — UI Sans ──────────────────────────────────────────────────────────
export const outfit = Outfit({
  subsets:  ["latin"],
  weight:   "variable",
  display:  "swap",
  variable: "--font-outfit",
})
