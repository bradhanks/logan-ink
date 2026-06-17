"use client";

/**
 * Client wrapper that renders the embedded Sanity Studio.
 *
 * `sanity.config.ts` and `NextStudio` depend on React context and browser-only
 * APIs, so they must be imported into a client component — importing them into
 * a server component breaks Next's page-data collection.
 */

import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export function Studio() {
  return <NextStudio config={config} />;
}
