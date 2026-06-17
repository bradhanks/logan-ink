import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Writing",
  description: "Essays, articles, and writing by Logan Hanks.",
  path: "/writing",
})

export default function WritingPage() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "4rem 1.5rem",
      }}
    >
      <div>
        <p className="eyebrow" style={{ marginBottom: "1rem" }}>Coming soon</p>
        <h1
          style={{
            fontFamily: "var(--font-fraunces), Georgia, serif",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.15,
          }}
        >
          Writing
        </h1>
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "1rem",
            color: "var(--text-2)",
            fontFamily: "var(--font-sans)",
          }}
        >
          This page is being built.
        </p>
      </div>
    </div>
  )
}
