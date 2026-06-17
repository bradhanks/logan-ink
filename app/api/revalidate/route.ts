/**
 * POST /api/revalidate
 *
 * Sanity → Next.js cache-invalidation webhook.
 *
 * Sanity calls this endpoint whenever a document is created, updated, or
 * deleted. The handler validates the webhook signature using the shared
 * secret, resolves which cache tags to bust, and calls the appropriate
 * `invalidate.*` helpers from `lib/cache.ts`.
 *
 * Environment variables required:
 *   SANITY_REVALIDATE_SECRET  — shared secret configured in Sanity webhook settings.
 *
 * Cache-Components constraint:
 *   This route MUST NOT use `revalidatePath`, bare `revalidateTag(tag)`, or
 *   `export const revalidate`. All invalidation goes through `invalidate.*`
 *   from `lib/cache.ts`, which calls `revalidateTag(tag, profile)` / `updateTag`.
 */

import { type NextRequest, NextResponse } from "next/server";
import { SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { invalidate } from "@/lib/cache";
import { parseWebhookRequest, resolveInvalidation } from "./helpers";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const secret = process.env.SANITY_REVALIDATE_SECRET;

  if (!secret) {
    console.error("[revalidate] SANITY_REVALIDATE_SECRET is not set");
    return NextResponse.json(
      { error: "Server misconfiguration" },
      { status: 500 },
    );
  }

  // Read the raw body — we must NOT call req.json() before signature check,
  // as @sanity/webhook needs the original bytes for HMAC verification.
  const rawBody = await req.text();
  const signature = req.headers.get(SIGNATURE_HEADER_NAME) ?? "";

  const parsed = await parseWebhookRequest(rawBody, signature, secret);

  if (!parsed.ok) {
    return NextResponse.json({ error: parsed.message }, { status: parsed.status });
  }

  const { payload } = parsed;
  const intents = resolveInvalidation(payload);
  const invalidated: string[] = [];

  for (const intent of intents) {
    switch (intent.type) {
      case "page":
        invalidate.page(intent.slug);
        invalidated.push(`page:${intent.slug}`);
        break;
      case "gallery":
        invalidate.gallery();
        invalidated.push("gallery");
        break;
      case "feed":
        invalidate.feed();
        invalidated.push("feed");
        break;
      case "content":
        invalidate.content();
        invalidated.push("content");
        break;
    }
  }

  console.log(
    `[revalidate] _type=${payload._type} slug=${payload.slug?.current ?? "(none)"} → [${invalidated.join(", ")}]`,
  );

  return NextResponse.json({
    revalidated: true,
    documentType: payload._type,
    invalidated,
  });
}
