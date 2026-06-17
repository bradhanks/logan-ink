import { NextResponse, type NextRequest } from "next/server";
import { contentSecurityPolicy } from "@/lib/security/csp";
import { rateLimit } from "@/lib/rate-limit";
import { siteConfig } from "@/lib/site-config";

/**
 * Platform-level request handling that sits in front of every route:
 *   1. Rate-limit the public API + MCP surfaces (abuse protection).
 *   2. Set a Content-Security-Policy (relaxed for the embedded Studio).
 *   3. Enforce index hygiene — only the canonical production host is indexable;
 *      preview/branch deployments and utility paths get `noindex`.
 *
 * Kept here (not in next.config `headers()`) because the CSP and robots
 * behavior vary per request (path + host), which static headers can't express.
 *
 * Uses Next.js 16's Proxy convention (`proxy.ts`, formerly `middleware.ts`).
 */

const PROD_HOST = siteConfig.domain; // "logan.ink"

// Never index these regardless of host.
const NOINDEX_PREFIXES = ["/studio", "/api", "/mcp", "/draft"];

// Throttled surfaces. Web-vitals beacons are exempt (fire-and-forget, noisy).
const RATE_LIMITED_PREFIXES = ["/api", "/mcp"];
const RATE_LIMIT = { limit: 60, windowMs: 60_000 }; // per IP, per endpoint, per minute

function clientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "anonymous"
  );
}

/** Bucket key by endpoint (first two path segments) so endpoints don't share a quota. */
function endpointKey(pathname: string): string {
  const [, a = "", b = ""] = pathname.split("/");
  return `/${a}/${b}`;
}

export function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // 1. Rate limiting.
  const isRateLimited =
    RATE_LIMITED_PREFIXES.some((p) => pathname.startsWith(p)) &&
    !pathname.startsWith("/api/vitals");

  if (isRateLimited) {
    const key = `${clientIp(request)}:${endpointKey(pathname)}`;
    const result = rateLimit(key, RATE_LIMIT);
    if (!result.success) {
      const retryAfter = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "Retry-After": String(retryAfter),
          "RateLimit-Limit": String(result.limit),
          "RateLimit-Remaining": String(result.remaining),
        },
      });
    }
  }

  const response = NextResponse.next();

  // 2. Content-Security-Policy.
  const variant = pathname.startsWith("/studio") ? "studio" : "site";
  response.headers.set("Content-Security-Policy", contentSecurityPolicy(variant));

  // 3. Index hygiene.
  const isPreviewHost = host !== PROD_HOST && host !== `www.${PROD_HOST}`;
  const isUtilityPath = NOINDEX_PREFIXES.some((p) => pathname.startsWith(p));
  if (isPreviewHost || isUtilityPath) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  // Run on everything except Next internals + static asset files.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf)$).*)",
  ],
};
