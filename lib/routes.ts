/**
 * Route registry for logan.ink.
 *
 * This file is the single source of truth for all top-level static routes that
 * should appear in the sitemap. Dynamic slug routes (grants, essays, glossary
 * terms) are added programmatically in `app/sitemap.ts`.
 *
 * Shape of each entry mirrors Next.js MetadataRoute.Sitemap[number] so the
 * sitemap generator can spread entries directly.
 */

export interface RouteConfig {
  /** Site-relative path, no trailing slash (except root "/"). */
  path: string;
  /**
   * How often the page content changes — used as the sitemap changefreq hint.
   * Omit for defaults.
   */
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  /**
   * Sitemap priority, 0.0–1.0. Defaults to 0.5 if omitted.
   */
  priority?: number;
}

/**
 * All public top-level routes. Add a route here if it should appear in
 * `/sitemap.xml`. Do NOT add /studio, /api/*, /mcp/*, or draft routes.
 */
export const routes: RouteConfig[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/timeline", changeFrequency: "monthly", priority: 0.7 },
  { path: "/writing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/research", changeFrequency: "monthly", priority: 0.8 },
  { path: "/grants", changeFrequency: "weekly", priority: 0.9 },
  { path: "/reading", changeFrequency: "weekly", priority: 0.7 },
  { path: "/glossary", changeFrequency: "monthly", priority: 0.7 },
  { path: "/field", changeFrequency: "daily", priority: 0.7 },
  { path: "/cv", changeFrequency: "monthly", priority: 0.6 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.5 },
  { path: "/mancala", changeFrequency: "yearly", priority: 0.3 },
];
