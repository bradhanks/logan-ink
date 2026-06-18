import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import { fraunces, newsreader, outfit } from "@/lib/fonts";
import { getInitialThemeScript } from "@/lib/theme";
import { baseMetadata } from "@/lib/seo/metadata";
import { siteConfig } from "@/lib/site-config";
import { ConsentBanner } from "@/components/layout/ConsentBanner";
import { VisualEditingGate } from "@/components/sanity/VisualEditingGate";
import { WebVitals } from "./web-vitals";
import "./globals.css";

// Page metadata (title/description/OG) is composed from lib/metadata.
// Individual pages override with `buildMetadata({ ... })`.
export const metadata: Metadata = baseMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor.light },
    { media: "(prefers-color-scheme: dark)", color: siteConfig.themeColor.dark },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${newsreader.variable} ${outfit.variable} h-full antialiased`}
    >
      <head>
        {/* Synchronous theme resolution before first paint — prevents FOUC.
            Content is a static IIFE string with no user input; not an XSS risk. */}
        <script dangerouslySetInnerHTML={{ __html: getInitialThemeScript() }} />
      </head>
      <body className="min-h-full flex flex-col">
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-TXP27537"} />
        {children}
        <ConsentBanner />
        {/* Draft-Mode-only visual editing overlays. Behind Suspense so the
            draftMode() read does not force normal pages to render dynamically. */}
        <Suspense fallback={null}>
          <VisualEditingGate />
        </Suspense>
        <WebVitals />
      </body>
    </html>
  );
}
