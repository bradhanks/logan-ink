/**
 * Embedded Sanity Studio at /studio.
 *
 * Mounts the Studio via `NextStudio` using the shared `sanity.config.ts`. The
 * Studio is a fully client-driven app (it relies on React context, browser-only
 * APIs, etc.), so the actual `<NextStudio/>` render is delegated to a client
 * component (`Studio`) — importing `sanity.config.ts` into a server component
 * fails during page-data collection (`createContext is not a function`).
 *
 * This route lives at `app/studio` — OUTSIDE the `(site)` route group — so it
 * is not wrapped by the public Nav/Footer layout.
 *
 * Cache Components note: route segment config (`export const dynamic`) is
 * incompatible with `cacheComponents`, so it is omitted.
 */

import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { Studio } from "./Studio";

// The Studio must never be indexed by search engines.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Forces this segment to be treated as dynamic (the Studio is a live,
 * client-driven app, not a prerenderable page). Under Cache Components we can't
 * use `export const dynamic`, so we await `connection()` inside a Suspense
 * boundary instead — this is the supported escape hatch.
 */
async function StudioBoundary() {
  await connection();
  return <Studio />;
}

export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <StudioBoundary />
    </Suspense>
  );
}
