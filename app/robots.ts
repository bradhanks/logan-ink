import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * robots.txt. Disallows the embedded Studio and draft-mode API surfaces so they
 * are never indexed. The Studio route also sets `robots: { index: false }` in
 * its own metadata as defense-in-depth.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
