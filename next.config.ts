import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

/**
 * Long-lived, immutable cache for hashed/static build output and public assets.
 * The content team should NOT need to touch this — add new asset *types* to the
 * `headers()` matchers below if a new immutable asset folder is introduced.
 */
const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Security headers applied to every route. Kept intentionally CSP-light here so
 * page authors aren't blocked by an over-strict policy during content work; a
 * full Content-Security-Policy should be layered in via middleware once the set
 * of third-party origins (fonts, analytics, media) is finalized.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  // --- Rendering / caching -------------------------------------------------
  // Partial Prerendering + the `use cache` directive. Static shells stream from
  // the CDN; dynamic islands hydrate behind Suspense. See lib/cache.ts.
  cacheComponents: true,

  // Pin the workspace root to this project so Turbopack doesn't infer a parent
  // directory when multiple lockfiles are present.
  turbopack: {
    root: import.meta.dirname,
  },

  // --- Output hygiene ------------------------------------------------------
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // --- Image optimization --------------------------------------------------
  // An ink/portfolio site is image-heavy, so this is the highest-leverage knob.
  images: {
    formats: ["image/avif", "image/webp"],
    // Allowed `quality` values — Next 16 rejects any quality not listed here.
    qualities: [50, 70, 85, 100],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images on the CDN for 31 days before re-optimizing.
    minimumCacheTTL: 60 * 60 * 24 * 31,
    // Add remote CMS / storage origins here when media moves off /public.
    remotePatterns: [],
  },

  // --- Bundle size ---------------------------------------------------------
  // Tree-shake barrel imports from common heavy packages. Add icon/UI libs here
  // as they're introduced (e.g. "lucide-react", "@radix-ui/react-icons").
  experimental: {
    optimizePackageImports: [],
  },

  // --- Headers -------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Static assets served from /public that we control the hashing of.
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff|woff2|otf|ttf)",
        headers: [
          {
            key: "Cache-Control",
            value: `public, max-age=${ONE_YEAR}, immutable`,
          },
        ],
      },
    ];
  },
};

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default withBundleAnalyzer(nextConfig);
