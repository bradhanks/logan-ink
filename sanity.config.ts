/**
 * Sanity Studio configuration for logan.ink.
 *
 * This file is consumed by the Studio embed (app/studio/[[...tool]]/page.tsx —
 * added in task 1.2) and by the Sanity CLI for local development.
 *
 * TODO(task 1.2): add presentationTool({ previewUrl: { origin: "/api/draft" } })
 *                 once the Draft Mode route and visual-editing are wired up.
 */

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./lib/sanity/schema";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "dl2yvjg8";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "default",
  title: "logan.ink",

  projectId,
  dataset,

  plugins: [
    structureTool(),
    visionTool(),
    // TODO(task 1.2): presentationTool({ previewUrl: { origin: "/api/draft" } }),
  ],

  schema: {
    types: schemaTypes,
  },
});
