import type { Metadata } from "next"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE, cacheTags } from "@/lib/cache"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_ESSAYS_QUERY } from "@/lib/sanity/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { EssayCard } from "@/components/writing/EssayCard"

export const metadata: Metadata = buildMetadata({
  title: "Writing",
  description: "Essays and newsletter from Logan Hanks",
  path: "/writing",
})

type EssayListItem = {
  _id: string
  title: string
  slug: { current: string }
  kind: "essay" | "newsletter"
  publishedAt: string | null
  excerpt: string | null
  tags: string[] | null
}

export default async function WritingPage() {
  "use cache"
  cacheLife(CACHE.feed)
  cacheTag(cacheTags.feed)

  const essays = await sanityFetch<EssayListItem[]>(ALL_ESSAYS_QUERY)

  return (
    <main className="container" style={{ paddingTop: "4rem", paddingBottom: "6rem" }}>
      <header style={{ marginBottom: "3rem" }}>
        <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>Logan Hanks</p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.15,
          }}
        >
          Writing
        </h1>
        <p style={{ marginTop: "0.75rem", color: "var(--text-2)", fontFamily: "var(--font-sans)", maxWidth: "52ch" }}>
          Essays and newsletter on research, science communication, and grad-school life.
        </p>
      </header>

      {essays.length === 0 ? (
        <div
          className="glass"
          style={{ padding: "3rem 2rem", textAlign: "center", color: "var(--text-3)", fontFamily: "var(--font-sans)" }}
        >
          <p>No posts yet — check back soon.</p>
        </div>
      ) : (
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {essays.map((essay) => (
            <li key={essay._id}>
              <EssayCard essay={essay} />
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}
