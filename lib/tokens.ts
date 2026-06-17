/**
 * Logan Hanks — Design Tokens
 * lib/tokens.ts
 *
 * Import anywhere:
 *   import { colors, fonts, ease } from "@/lib/tokens"
 */

// ── COLORS ────────────────────────────────────────────────────────────────────

export const colors = {
  // Brand
  blue:      "#6DB6D8",
  blueDk:    "#1A7AAA",
  blueDim:   "rgba(109, 182, 216, 0.13)",
  blueGlow:  "rgba(109, 182, 216, 0.28)",

  rose:      "#D48EA8",
  roseDk:    "#A64E72",
  roseDim:   "rgba(212, 142, 168, 0.13)",

  gold:      "#C9A84C",
  goldDk:    "#8A6E28",

  teal:      "#4AADA0",
  tealDk:    "#2A7A6E",

  // Trans flag
  transCyan:  "#55CDFC",
  transPink:  "#F7A8B8",
  transWhite: "rgba(255, 255, 255, 0.9)",

  // Dark theme
  dark: {
    bg:       "#070C1A",
    surface:  "rgba(255, 255, 255, 0.042)",
    surface2: "rgba(255, 255, 255, 0.072)",
    border:   "rgba(255, 255, 255, 0.078)",
    border2:  "rgba(255, 255, 255, 0.15)",
    text:     "#F2EDE8",
    text2:    "#9B9088",
    text3:    "#5A5450",
  },

  // Light theme
  light: {
    bg:       "#F8F5F0",
    surface:  "#EDEBE6",
    surface2: "#E4E0D8",
    border:   "rgba(12, 18, 32, 0.1)",
    border2:  "rgba(12, 18, 32, 0.2)",
    text:     "#0C1220",
    text2:    "#4A5568",
    text3:    "#8A9099",
  },
} as const

// ── TYPOGRAPHY ────────────────────────────────────────────────────────────────

/**
 * Font stacks — these reference CSS variables set by next/font in lib/fonts.ts.
 * Use as: style={{ fontFamily: fonts.display }}
 */
export const fonts = {
  display: "var(--font-fraunces), 'Georgia', serif",
  serif:   "var(--font-newsreader), 'Georgia', serif",
  sans:    "var(--font-outfit), system-ui, sans-serif",
  mono:    "ui-monospace, 'SF Mono', 'Menlo', monospace",
} as const

/** Font sizes — fluid where applicable */
export const type = {
  heroName:    "clamp(4rem, 10.5vw, 9rem)",
  sectionTitle:"clamp(2rem, 4vw, 2.875rem)",
  lead:        "1.25rem",
  body:        "0.96rem",
  small:       "0.875rem",
  caption:     "0.78rem",
  label:       "0.65rem",
  micro:       "0.62rem",
} as const

// ── SPACING ───────────────────────────────────────────────────────────────────

export const spacing = {
  navHeight:    "3.75rem",
  sectionPad:   "5.5rem",
  containerMax: "1200px",
  containerPx:  "2.5rem",
  radius:       "1.125rem",
  radiusSm:     "0.5rem",
  radiusLg:     "1.5rem",
} as const

// ── ANIMATION ─────────────────────────────────────────────────────────────────

export const ease = {
  outExpo: "cubic-bezier(0.16, 1, 0.3, 1)",
} as const

export const duration = {
  fast:   "0.2s",
  base:   "0.3s",
  slow:   "0.7s",
  reveal: "0.7s",
} as const

// ── SHADOWS ───────────────────────────────────────────────────────────────────

export const shadows = {
  glowBlue:  "0 0 22px rgba(109, 182, 216, 0.28)",
  glowBlueHover: "0 0 38px rgba(109, 182, 216, 0.55)",
  card:      "0 4px 30px rgba(109, 182, 216, 0.06), inset 0 1px 0 rgba(255,255,255,0.055)",
  photo:     "linear-gradient(145deg, rgba(109,182,216,0.4), rgba(212,142,168,0.3), rgba(74,173,160,0.25))",
} as const

// ── MANCALA STONE COLORS ──────────────────────────────────────────────────────

export const stones = {
  navy:   { from: "#1e3a8a", to: "#0f172a" },
  rose:   { from: "#c06080", to: "#6a1840" },
  brown:  { from: "#b45309", to: "#451a03" },
  violet: { from: "#6d28d9", to: "#3b0764" },
  grey:   { from: "#d6d3d1", to: "#78716c" },
  char:   { from: "#525252", to: "#171717" },
} as const

// ── TAG VARIANTS ──────────────────────────────────────────────────────────────

export const tagVariants = {
  blue:  { background: colors.blueDim,                        color: colors.blue  },
  rose:  { background: colors.roseDim,                        color: colors.rose  },
  teal:  { background: "rgba(74, 173, 160, 0.12)",            color: colors.teal  },
  gold:  { background: "rgba(201, 168, 76, 0.10)",            color: colors.gold  },
} as const
