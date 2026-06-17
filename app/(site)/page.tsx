import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { Wordmark } from "@/components/brand/Wordmark"

export const metadata: Metadata = buildMetadata({
  title: "Logan Hanks",
  description:
    "Logan Hanks — cancer-prevention and population-science research, grant intelligence, and the road to graduate school.",
  path: "/",
})

// Home page stub. The real home is composed from a Sanity `page` document
// (block-based page builder) in the content-layer phase; this placeholder
// renders inside the (site) layout (nav + footer + scroll progress).
export default function HomePage() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-start justify-center gap-6 px-6 py-24">
      <Wordmark />
      <h1
        className="text-4xl sm:text-6xl"
        style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
      >
        Logan Hanks
      </h1>
      <p className="max-w-xl text-lg" style={{ color: "var(--text-2)" }}>
        Cancer-prevention &amp; population-science research, grant intelligence,
        and the road to graduate school. The full, CMS-driven home page is in
        progress.
      </p>
    </section>
  )
}
