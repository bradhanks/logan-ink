/**
 * Draft Mode enable endpoint — used by the Sanity Presentation tool.
 *
 * Sanity's Presentation tool opens this route (configured via
 * `presentationTool({ previewUrl: { previewMode: { enable: "/api/draft" } } })`)
 * to turn on Next.js Draft Mode before loading a preview of the site inside the
 * Studio iframe. Once Draft Mode is enabled, page-level fetches switch to the
 * drafts perspective (see `lib/sanity/live.ts`) and `<VisualEditing/>` overlays
 * mount in the layout.
 *
 * We use `next-sanity`'s `defineEnableDraftMode`, which validates the request
 * against the Sanity project using the viewer token. This avoids shipping a
 * separate shared secret — the token (which the Presentation tool round-trips)
 * IS the credential. If you prefer a static shared secret instead, set
 * `SANITY_PREVIEW_SECRET` and check `searchParams.get("secret")` manually.
 */

import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { sanityClient } from "@/lib/sanity/client";

const token = process.env.SANITY_VIEWER_TOKEN;

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token }),
});
