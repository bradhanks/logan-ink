import type { Metadata } from "next";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

/**
 * Metadata infrastructure.
 *
 * `baseMetadata` is spread into the root layout once and provides sane defaults
 * (canonical base, OpenGraph, Twitter, robots). Individual pages call
 * `buildMetadata({ title, description, path })` to override only what differs —
 * they never re-declare the boilerplate.
 */

export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    ...(siteConfig.twitterHandle
      ? { creator: siteConfig.twitterHandle, site: siteConfig.twitterHandle }
      : {}),
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export interface PageMetadataInput {
  title?: string;
  description?: string;
  /** Site-relative path, used for the canonical + OG url (e.g. "/about"). */
  path?: string;
  /** Override the OG/Twitter image; defaults to the site-wide share image. */
  image?: string;
  /** Set true on pages that should not be indexed (drafts, utility routes). */
  noIndex?: boolean;
}

/**
 * Compose page-level metadata on top of the shared defaults. Pass only the
 * fields that change for this page.
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  noIndex,
}: PageMetadataInput = {}): Metadata {
  const url = absoluteUrl(path);
  const resolvedImage = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...baseMetadata.openGraph,
      title: title ?? undefined,
      description,
      url,
      ...(resolvedImage ? { images: resolvedImage } : {}),
    },
    twitter: {
      ...baseMetadata.twitter,
      title: title ?? undefined,
      description,
      ...(resolvedImage ? { images: resolvedImage } : {}),
    },
    ...(noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/**
 * Person + WebSite JSON-LD for the homepage. Render the return value inside a
 * <script type="application/ld+json"> tag. Helps search/rich results.
 */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}
