/**
 * Sanity Studio configuration for logan.ink.
 *
 * This file is consumed by the Studio embed (app/studio/[[...tool]]/page.tsx —
 * added in task 1.2) and by the Sanity CLI for local development.
 *
 * Presentation tool drives visual editing: it opens the site inside an iframe,
 * enables Draft Mode via `/api/draft`, and renders click-to-edit overlays.
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./lib/sanity/schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "dl2yvjg8";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

// Origin of the running Next.js app the Presentation tool previews.
const previewOrigin =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default defineConfig({
  name: "default",
  title: "logan.ink",

  projectId,
  dataset,

  plugins: [
    presentationTool({
      previewUrl: {
        origin: previewOrigin,
        previewMode: {
          enable: "/api/draft",
          disable: "/api/draft/disable",
        },
      },
    }),
    structureTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
});
