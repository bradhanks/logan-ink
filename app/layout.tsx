import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { baseMetadata } from "@/lib/metadata";
import { siteConfig } from "@/lib/site-config";
import { WebVitals } from "./web-vitals";
import "./globals.css";

// Self-hosted via next/font (no render-blocking external request). `swap`
// avoids invisible text (FOIT); fonts are preloaded by default.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <WebVitals />
      </body>
    </html>
  );
}
