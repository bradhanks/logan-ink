/**
 * Single source of truth for site-wide identity and URLs.
 *
 * Everything that needs the canonical origin (metadata, sitemap, robots,
 * JSON-LD, manifest) reads from here so there is exactly one place to change
 * the domain. Override the origin per-environment with NEXT_PUBLIC_SITE_URL
 * (e.g. a Vercel preview URL) — it falls back to the production domain.
 */

const productionUrl = "https://logan.ink";

export const siteConfig = {
  name: "Logan Hanks",
  shortName: "Logan Hanks",
  domain: "logan.ink",
  /** Canonical origin, no trailing slash. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? productionUrl).replace(/\/$/, ""),
  // TODO(content): replace with the real tagline/description once copy exists.
  description: "The work of Logan Hanks.",
  locale: "en_US",
  /** Default social share image route (see app/opengraph-image). */
  ogImage: "/opengraph-image",
  /** TODO(content): set the Twitter/X handle if there is one, else leave null. */
  twitterHandle: null as string | null,
  themeColor: {
    light: "#F8F5F0",
    dark: "#070C1A",
  },
} as const;

export type SiteConfig = typeof siteConfig;

/** Build an absolute URL from a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
