/**
 * Registry of static, known routes for sitemap generation.
 *
 * The content team adds an entry here when they ship a new top-level page.
 * Dynamic, data-driven routes (e.g. /work/[slug]) should be appended in
 * app/sitemap.ts by mapping over the data source — see the note there.
 */

export interface StaticRoute {
  path: string;
  changeFrequency:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority: number;
}

export const staticRoutes: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  // Add pages as they ship, e.g.:
  // { path: "/work", changeFrequency: "weekly", priority: 0.9 },
  // { path: "/about", changeFrequency: "monthly", priority: 0.7 },
];
