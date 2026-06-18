import type { Metadata } from "next"
import type { PortableTextBlock } from "@portabletext/react"
import { buildMetadata } from "@/lib/seo/metadata"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_PROGRAMS_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { PortableBody } from "@/components/sections/RichText"

export const metadata: Metadata = buildMetadata({
  title: "Where I Want to Train",
  description:
    "Graduate programs in cancer prevention and population science that Logan Hanks is aiming for — and why.",
  path: "/programs",
})

interface Program {
  _id: string
  name: string
  slug?: { current: string }
  program?: string
  department?: string
  sourceUrl?: string
  body?: PortableTextBlock[]
}

async function getPrograms(): Promise<Program[]> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.content)
  try {
    return (await sanityFetch<Program[]>(ALL_PROGRAMS_QUERY)) ?? []
  } catch {
    return []
  }
}

export default async function ProgramsPage() {
  const programs = await getPrograms()

  return (
    <article className="container" style={{ maxWidth: "760px", padding: "4rem 1.5rem 6rem" }}>
      <header style={{ marginBottom: "2.5rem" }}>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          Where I want to train
        </h1>
        <p style={{ fontSize: "1.05rem", color: "var(--text-2)", lineHeight: 1.65, maxWidth: "60ch" }}>
          The graduate programs I&rsquo;m aiming for in cancer prevention and population science —
          the places doing the methodological and community-engaged work I want to learn, and an
          honest note on why each one.
        </p>
      </header>

      {programs.length === 0 ? (
        <p style={{ color: "var(--text-2)" }}>Program notes are coming together.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          {programs.map((p) => (
            <section
              key={p._id}
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "1.75rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  color: "var(--text)",
                  marginBottom: "0.35rem",
                }}
              >
                {p.name}
              </h2>
              {(p.program || p.department) && (
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    letterSpacing: "0.02em",
                    color: "var(--blue-dk)",
                    marginBottom: "1rem",
                  }}
                >
                  {[p.program, p.department].filter(Boolean).join(" · ")}
                </p>
              )}
              {p.body && p.body.length > 0 ? (
                <div className="prose-body">
                  <PortableBody value={p.body} />
                </div>
              ) : null}
              {p.sourceUrl ? (
                <p style={{ marginTop: "0.75rem", fontSize: "0.8rem" }}>
                  <a
                    href={p.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--blue)", textDecoration: "underline" }}
                  >
                    Program page →
                  </a>
                </p>
              ) : null}
            </section>
          ))}
        </div>
      )}
    </article>
  )
}
