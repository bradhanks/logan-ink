import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { staticRoutes } from "@/lib/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  // Stamped at build/revalidation time. Cache Components keeps this static
  // unless a route below pulls from a tagged data source.
  const lastModified = new Date();

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // To include dynamic routes, fetch slugs from your data source and append:
  //   const works = await getWorkSlugs(); // a `use cache` function from lib/cache
  //   entries.push(...works.map((w) => ({
  //     url: absoluteUrl(`/work/${w.slug}`),
  //     lastModified: w.updatedAt,
  //     changeFrequency: "monthly",
  //     priority: 0.8,
  //   })));

  return entries;
}
