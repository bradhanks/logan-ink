/**
 * Pure helpers for the Sanity revalidation webhook.
 *
 * Extracted here so they can be unit-tested without a live HTTP request.
 */

import { isValidSignature } from "@sanity/webhook";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SanityWebhookPayload {
  _type: string;
  slug?: { current?: string };
  [key: string]: unknown;
}

export type ParseResult =
  | { ok: true; payload: SanityWebhookPayload }
  | { ok: false; status: 401; message: string };

export type InvalidationIntent =
  | { type: "page"; slug: string }
  | { type: "gallery" }
  | { type: "feed" }
  | { type: "content" };

// ---------------------------------------------------------------------------
// Signature validation + payload parsing
// ---------------------------------------------------------------------------

/**
 * Validates the Sanity webhook signature and parses the raw JSON body.
 *
 * @param rawBody   - The raw request body string (NOT re-encoded).
 * @param signature - The value of the `sanity-webhook-signature` header.
 * @param secret    - The `SANITY_REVALIDATE_SECRET` env var value.
 */
export async function parseWebhookRequest(
  rawBody: string,
  signature: string,
  secret: string,
): Promise<ParseResult> {
  let valid = false;
  try {
    valid = await isValidSignature(rawBody, signature, secret);
  } catch {
    // isValidSignature may throw on malformed headers
    valid = false;
  }

  if (!valid) {
    return { ok: false, status: 401, message: "Invalid signature" };
  }

  const payload = JSON.parse(rawBody) as SanityWebhookPayload;
  return { ok: true, payload };
}

// ---------------------------------------------------------------------------
// Invalidation intent mapping
// ---------------------------------------------------------------------------

/**
 * Given a parsed Sanity webhook payload, returns the list of cache
 * invalidation intents. The route handler executes these against
 * `invalidate.*` from `lib/cache.ts`.
 */
export function resolveInvalidation(
  payload: Pick<SanityWebhookPayload, "_type" | "slug">,
): InvalidationIntent[] {
  const slug = payload.slug?.current ?? "";

  switch (payload._type) {
    // ── Exact page documents ──────────────────────────────────────────────
    case "page":
      return [{ type: "page", slug }];

    // ── Gallery / portfolio ───────────────────────────────────────────────
    case "heroPerson":
      return [{ type: "gallery" }];

    // ── Feed-backed content ───────────────────────────────────────────────
    case "essay":
    case "publication":
    case "readingItem":
    case "timelineEntry":
      return [{ type: "feed" }];

    // ── Research / grant / glossary ───────────────────────────────────────
    case "researchProject":
    case "grant":
    case "glossaryTerm":
      return [{ type: "content" }, { type: "feed" }];

    // ── Site-wide settings ────────────────────────────────────────────────
    case "siteSettings":
      return [{ type: "gallery" }, { type: "feed" }, { type: "content" }];

    // ── Unknown / future types ────────────────────────────────────────────
    default:
      return [{ type: "content" }];
  }
}
