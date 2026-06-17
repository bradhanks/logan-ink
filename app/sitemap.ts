import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { routes } from "@/lib/routes";
import { sanityClient } from "@/lib/sanity/client";
import {
  ALL_GRANTS_QUERY,
  ALL_ESSAYS_QUERY,
  ALL_GLOSSARY_TERMS_QUERY,
} from "@/lib/sanity/queries";

// ---------------------------------------------------------------------------
// Sanity slug types (minimal — only what we need for the sitemap)
// ---------------------------------------------------------------------------

interface WithSlug {
  slug?: { current?: string } | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function toUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

async function fetchSlugs<T extends WithSlug>(query: string): Promise<T[]> {
  try {
    const results = await sanityClient.fetch<T[]>(query);
    return Array.isArray(results) ? results : [];
  } catch {
    // If Sanity is unreachable at build time, degrade gracefully.
    return [];
  }
}

// ---------------------------------------------------------------------------
// Sitemap
// ---------------------------------------------------------------------------

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static routes from the route registry
  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: toUrl(r.path),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // 2. Dynamic: grant slugs (/grants/[slug])
  const grants = await fetchSlugs<WithSlug>(ALL_GRANTS_QUERY);
  const grantEntries: MetadataRoute.Sitemap = grants
    .flatMap((g) => (g.slug?.current ? [g.slug.current] : []))
    .map((slug) => ({
      url: toUrl(`/grants/${slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // 3. Dynamic: essay slugs (/writing/[slug])
  const essays = await fetchSlugs<WithSlug>(ALL_ESSAYS_QUERY);
  const essayEntries: MetadataRoute.Sitemap = essays
    .flatMap((e) => (e.slug?.current ? [e.slug.current] : []))
    .map((slug) => ({
      url: toUrl(`/writing/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // 4. Dynamic: glossary term slugs (/glossary/[term])
  const terms = await fetchSlugs<WithSlug>(ALL_GLOSSARY_TERMS_QUERY);
  const glossaryEntries: MetadataRoute.Sitemap = terms
    .flatMap((t) => (t.slug?.current ? [t.slug.current] : []))
    .map((slug) => ({
      url: toUrl(`/glossary/${slug}`),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...grantEntries, ...essayEntries, ...glossaryEntries];
}
