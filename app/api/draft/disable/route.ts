/**
 * Draft Mode disable endpoint.
 *
 * Turns off Next.js Draft Mode and redirects back to the site (or to a `?slug`
 * target if provided). Linked from the visual-editing overlay's "exit preview"
 * affordance and usable directly at /api/draft/disable.
 */

import { draftMode } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const draft = await draftMode();
  draft.disable();

  // Only allow same-origin relative redirects to avoid open-redirect abuse.
  const slug = request.nextUrl.searchParams.get("slug") ?? "/";
  const target = slug.startsWith("/") ? slug : "/";

  return NextResponse.redirect(new URL(target, request.url));
}
