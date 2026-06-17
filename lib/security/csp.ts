/**
 * Content-Security-Policy construction.
 *
 * Two policies, applied by `middleware.ts` based on path:
 *  - `site`   — every public page. Strict-ish, allows GTM + Sanity image CDN.
 *  - `studio` — only `/studio` (embedded Sanity Studio + Presentation), which
 *               legitimately needs eval, blob workers, and websockets.
 *
 * ── Known caveat: `'unsafe-inline'` in `script-src` ──────────────────────────
 * The site ships two inline scripts that can't easily be nonce'd while pages
 * stay statically prerendered (Cache Components / PPR): the no-flash theme
 * bootstrap and Google Tag Manager. A per-request nonce would force every page
 * dynamic, defeating PPR. The hardening path (do this once the inline scripts
 * are final): replace `'unsafe-inline'` with `'sha256-...'` hashes of the theme
 * script + GTM loader, or move to a nonce and accept dynamic rendering for the
 * HTML shell. Tracked as a follow-up; everything else is already locked down.
 */

const GTM = "https://www.googletagmanager.com";
const GA = "https://www.google-analytics.com https://*.analytics.google.com";
const SANITY_API = "https://*.api.sanity.io https://*.apicdn.sanity.io";
const SANITY_WS = "wss://*.api.sanity.io";

/** Directives shared by both policies. */
const common = {
  "default-src": ["'self'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  // 'self' so the same-origin Studio (Presentation) can iframe site pages,
  // while still blocking cross-origin clickjacking.
  "frame-ancestors": ["'self'"],
  "object-src": ["'none'"],
  "font-src": ["'self'", "data:"],
  // External content images (Sanity CDN + feed avatars) — pragmatic `https:`
  // rather than maintaining a per-host allowlist for user-rendered media.
  "img-src": ["'self'", "data:", "blob:", "https:"],
  "style-src": ["'self'", "'unsafe-inline'"],
};

function serialize(directives: Record<string, string[]>): string {
  return Object.entries(directives)
    .map(([key, values]) => (values.length ? `${key} ${values.join(" ")}` : key))
    .concat("upgrade-insecure-requests")
    .join("; ");
}

export type CspVariant = "site" | "studio";

export function contentSecurityPolicy(variant: CspVariant): string {
  if (variant === "studio") {
    return serialize({
      ...common,
      // Studio bundles eval'd code and spins up blob: web workers.
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
      "worker-src": ["'self'", "blob:"],
      "connect-src": ["'self'", SANITY_API, SANITY_WS, GTM, GA].flatMap((s) =>
        s.split(" "),
      ),
      "frame-src": ["'self'", GTM],
    });
  }

  return serialize({
    ...common,
    "script-src": ["'self'", "'unsafe-inline'", GTM, ...GA.split(" ")],
    // Sanity endpoints included so client-side live/visual editing works on
    // preview routes without a separate policy.
    "connect-src": ["'self'", GTM, ...GA.split(" "), ...SANITY_API.split(" ")],
    // GTM's <noscript> fallback frames ns.html.
    "frame-src": ["'self'", GTM],
  });
}
