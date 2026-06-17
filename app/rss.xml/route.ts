/**
 * RSS 2.0 feed for logan.ink essays.
 *
 * GET /rss.xml
 *
 * Fetches essays from Sanity and returns a valid RSS 2.0 document. If Sanity
 * is unreachable or returns no items, a well-formed empty feed is returned —
 * the route never throws.
 */

import { NextResponse } from "next/server";
import { sanityClient } from "@/lib/sanity/client";
import { ALL_ESSAYS_QUERY } from "@/lib/sanity/queries";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

interface Essay {
  _id: string;
  title?: string | null;
  slug?: { current?: string } | null;
  publishedAt?: string | null;
  excerpt?: string | null;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildRss(essays: Essay[]): string {
  const feedUrl = absoluteUrl("/rss.xml");
  const siteUrl = siteConfig.url;
  const buildDate = new Date().toUTCString();

  const items = essays
    .filter((e) => e.slug?.current && e.title)
    .map((e) => {
      const url = absoluteUrl(`/writing/${e.slug!.current}`);
      const pubDate = e.publishedAt
        ? new Date(e.publishedAt).toUTCString()
        : buildDate;
      const description = e.excerpt ? escapeXml(e.excerpt) : "";
      const title = escapeXml(e.title ?? "");

      return `    <item>
      <title>${title}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      ${description ? `<description>${description}</description>` : ""}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

export async function GET(): Promise<NextResponse> {
  let essays: Essay[] = [];

  try {
    const result = await sanityClient.fetch<Essay[]>(ALL_ESSAYS_QUERY);
    essays = Array.isArray(result) ? result : [];
  } catch {
    // Degrade gracefully — return empty feed
    essays = [];
  }

  const xml = buildRss(essays);

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
