/**
 * Public MCP endpoint for logan.ink.
 *
 * Exposes Logan's public content (profile, grants, publications, timeline,
 * research projects) as MCP tools so AI agents can query the site.
 *
 * Public URL (production): https://logan.ink/mcp/mcp
 *
 * Connect via Streamable HTTP (Claude Desktop, Cursor, etc.):
 *   {
 *     "logan-ink": { "url": "https://logan.ink/mcp/mcp" }
 *   }
 *
 * Connect via mcp-remote (stdio-only clients):
 *   {
 *     "logan-ink": {
 *       "command": "npx",
 *       "args": ["-y", "mcp-remote", "https://logan.ink/mcp/mcp"]
 *     }
 *   }
 *
 * This endpoint is PUBLIC and unauthenticated. Only published, non-draft
 * content is exposed. No private, strategy, or token data is included.
 */

import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import { sanityFetch } from "@/lib/sanity/client";
import {
  SITE_SETTINGS_QUERY,
  ALL_GRANTS_QUERY,
  GRANT_BY_SLUG_QUERY,
  ALL_PUBLICATIONS_QUERY,
  ALL_TIMELINE_ENTRIES_QUERY,
  ALL_RESEARCH_PROJECTS_QUERY,
} from "@/lib/sanity/queries";

// ---------------------------------------------------------------------------
// Sanity result shapes (just enough for the MCP tools)
// ---------------------------------------------------------------------------

interface SiteSettings {
  _id: string;
  name?: string;
  tagline?: string;
  affiliation?: string;
  email?: string;
  bluesky?: string;
  orcid?: string;
  [key: string]: unknown;
}

interface Grant {
  _id: string;
  org?: string;
  mechanism?: string;
  slug?: { current?: string };
  careerStage?: string;
  topics?: string[];
  amount?: number;
  deadline?: string;
  deadlineConfirmed?: boolean;
  cycleYear?: number;
  sourceUrl?: string;
  tldr?: string;
  body?: unknown;
  faq?: unknown;
}

interface Publication {
  _id: string;
  title?: string;
  authors?: string[];
  venue?: string;
  year?: number;
  status?: string;
  doi?: string;
  url?: string;
}

interface TimelineEntry {
  _id: string;
  date?: string;
  title?: string;
  body?: unknown;
  category?: string;
}

interface ResearchProject {
  _id: string;
  title?: string;
  slug?: { current?: string };
  summary?: string;
  role?: string;
  methods?: string[];
  featured?: boolean;
}

// ---------------------------------------------------------------------------
// MCP handler
// ---------------------------------------------------------------------------

const handler = createMcpHandler(
  (server) => {
    // ── get_profile ─────────────────────────────────────────────────────────
    server.registerTool(
      "get_profile",
      {
        title: "Get Profile",
        description:
          "Returns Logan Hanks's public profile: name, tagline, affiliation, and contact-safe fields (Bluesky, ORCID).",
        inputSchema: {},
      },
      async () => {
        const settings = await sanityFetch<SiteSettings | null>(
          SITE_SETTINGS_QUERY
        );
        if (!settings) {
          return {
            content: [{ type: "text", text: JSON.stringify({}) }],
          };
        }
        // Only expose safe/public fields — never tokens or private config
        const safe = {
          name: settings.name,
          tagline: settings.tagline,
          affiliation: settings.affiliation,
          bluesky: settings.bluesky,
          orcid: settings.orcid,
        };
        return {
          content: [{ type: "text", text: JSON.stringify(safe, null, 2) }],
        };
      }
    );

    // ── list_grants ──────────────────────────────────────────────────────────
    server.registerTool(
      "list_grants",
      {
        title: "List Grants",
        description:
          "Returns all publicly listed grant opportunities tracked on logan.ink, ordered by deadline ascending. Each grant includes org, mechanism, career stage, topics, amount, deadline, and a tldr summary.",
        inputSchema: {},
      },
      async () => {
        const grants = await sanityFetch<Grant[]>(ALL_GRANTS_QUERY);
        const list = (grants ?? []).map((g) => ({
          slug: g.slug?.current,
          org: g.org,
          mechanism: g.mechanism,
          careerStage: g.careerStage,
          topics: g.topics,
          amount: g.amount,
          deadline: g.deadline,
          deadlineConfirmed: g.deadlineConfirmed,
          cycleYear: g.cycleYear,
          sourceUrl: g.sourceUrl,
          tldr: g.tldr,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify(list, null, 2) }],
        };
      }
    );

    // ── get_grant ────────────────────────────────────────────────────────────
    server.registerTool(
      "get_grant",
      {
        title: "Get Grant",
        description:
          "Returns full details for a single grant by its slug (e.g. 'nih-r01-2025'). Includes all list fields plus the full body and FAQ.",
        inputSchema: {
          slug: z.string().describe("The grant slug (e.g. 'nih-r01-2025')"),
        },
      },
      async ({ slug }) => {
        const grant = await sanityFetch<Grant | null>(GRANT_BY_SLUG_QUERY, {
          slug,
        });
        if (!grant) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify({ error: `Grant not found: ${slug}` }),
              },
            ],
          };
        }
        return {
          content: [{ type: "text", text: JSON.stringify(grant, null, 2) }],
        };
      }
    );

    // ── list_publications ────────────────────────────────────────────────────
    server.registerTool(
      "list_publications",
      {
        title: "List Publications",
        description:
          "Returns Logan's publications with status 'published' only (placeholders and in-progress items are excluded). Ordered by year descending.",
        inputSchema: {},
      },
      async () => {
        const pubs = await sanityFetch<Publication[]>(ALL_PUBLICATIONS_QUERY);
        // Only expose published items — never placeholders or drafts
        const published = (pubs ?? [])
          .filter((p) => p.status === "published")
          .map((p) => ({
            title: p.title,
            authors: p.authors,
            venue: p.venue,
            year: p.year,
            doi: p.doi,
            url: p.url,
          }));
        return {
          content: [
            { type: "text", text: JSON.stringify(published, null, 2) },
          ],
        };
      }
    );

    // ── list_timeline ────────────────────────────────────────────────────────
    server.registerTool(
      "list_timeline",
      {
        title: "List Timeline",
        description:
          "Returns Logan's career and life timeline entries, ordered newest date first.",
        inputSchema: {},
      },
      async () => {
        const entries =
          await sanityFetch<TimelineEntry[]>(ALL_TIMELINE_ENTRIES_QUERY);
        const list = (entries ?? []).map((e) => ({
          date: e.date,
          title: e.title,
          category: e.category,
          // body is Portable Text — omit for list view to keep payloads small
        }));
        return {
          content: [{ type: "text", text: JSON.stringify(list, null, 2) }],
        };
      }
    );

    // ── list_research ────────────────────────────────────────────────────────
    server.registerTool(
      "list_research",
      {
        title: "List Research Projects",
        description:
          "Returns Logan's research projects. Featured projects are listed first.",
        inputSchema: {},
      },
      async () => {
        const projects = await sanityFetch<ResearchProject[]>(
          ALL_RESEARCH_PROJECTS_QUERY
        );
        const list = (projects ?? []).map((p) => ({
          slug: p.slug?.current,
          title: p.title,
          summary: p.summary,
          role: p.role,
          methods: p.methods,
          featured: p.featured,
        }));
        return {
          content: [{ type: "text", text: JSON.stringify(list, null, 2) }],
        };
      }
    );
  },
  {
    serverInfo: {
      name: "logan-ink",
      version: "1.0.0",
    },
  },
  {
    basePath: "/mcp",
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST };
