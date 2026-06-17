/**
 * Default Open Graph image for logan.ink.
 *
 * Renders a branded 1200×630 image via next/og ImageResponse. Used as the
 * site-wide social share card when no page-specific OG image is defined.
 *
 * Font embedding: attempts to fetch Outfit (sans-serif) from Google Fonts at
 * runtime. If the fetch fails (e.g. build-time network restrictions), the image
 * falls back gracefully to the system sans-serif — it will never throw.
 */

import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Logan Hanks — Cancer-prevention & population-science research";

export const size = { width: 1200, height: 630 };

export const contentType = "image/png";

// Brand palette
const BG = "#070C1A";
const BLUE = "#6DB6D8";
const ROSE = "#D48EA8";
const WARM = "#F8F5F0";
const DIM = "rgba(248, 245, 240, 0.55)";

async function loadFont(): Promise<ArrayBuffer | null> {
  try {
    // Request only the weight range we need (600) to keep the buffer small
    const url =
      "https://fonts.googleapis.com/css2?family=Outfit:wght@600&display=swap";
    const css = await fetch(url, {
      headers: {
        // Spoof a modern user-agent so Google returns woff2 format info
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    }).then((r) => r.text());

    // Extract the woff2 URL from the returned CSS
    const match = css.match(/src: url\(([^)]+\.woff2[^)]*)\)/);
    if (!match?.[1]) return null;

    const woffUrl = match[1];
    const fontRes = await fetch(woffUrl);
    if (!fontRes.ok) return null;
    return fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function Image() {
  const fontData = await loadFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: BG,
          padding: "60px 72px",
          position: "relative",
        }}
      >
        {/* Decorative gradient blob — top-right */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BLUE}22 0%, transparent 70%)`,
          }}
        />
        {/* Decorative gradient blob — bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${ROSE}1A 0%, transparent 70%)`,
          }}
        />

        {/* Domain badge */}
        <div
          style={{
            position: "absolute",
            top: 56,
            right: 72,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: BLUE,
            }}
          />
          <span
            style={{
              fontFamily: fontData ? "Outfit" : "sans-serif",
              fontSize: 18,
              color: DIM,
              letterSpacing: "0.08em",
              textTransform: "lowercase",
            }}
          >
            logan.ink
          </span>
        </div>

        {/* Accent line */}
        <div
          style={{
            width: 56,
            height: 3,
            background: `linear-gradient(90deg, ${BLUE}, ${ROSE})`,
            borderRadius: 2,
            marginBottom: 28,
          }}
        />

        {/* Name */}
        <div
          style={{
            fontFamily: fontData ? "Outfit" : "sans-serif",
            fontSize: 80,
            fontWeight: 600,
            color: WARM,
            lineHeight: 1.0,
            letterSpacing: "-0.02em",
            marginBottom: 20,
          }}
        >
          Logan Hanks
        </div>

        {/* Tagline */}
        <div
          style={{
            fontFamily: fontData ? "Outfit" : "sans-serif",
            fontSize: 26,
            color: DIM,
            lineHeight: 1.4,
            maxWidth: 680,
          }}
        >
          Cancer-prevention &amp; population-science research
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Outfit",
              data: fontData,
              style: "normal",
              weight: 600,
            },
          ]
        : [],
    },
  );
}
