import { Suspense } from "react"
import Link from "next/link"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_RESEARCH_PROJECTS_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import type { ResearchGridSection } from "./types"

interface ResearchProject {
  _id: string
  title?: string
  slug?: { current?: string }
  summary?: string
  role?: string
  methods?: string[]
  featured?: boolean
}

async function getResearchProjects(): Promise<ResearchProject[]> {
  "use cache"
  cacheLife(CACHE.gallery)
  cacheTag(cacheTags.gallery)
  try {
    return (await sanityFetch<ResearchProject[]>(ALL_RESEARCH_PROJECTS_QUERY)) ?? []
  } catch {
    return []
  }
}

export function ResearchGrid({ section }: { section: ResearchGridSection }) {
  const heading = section.heading?.trim() || "Where I'm putting my time"

  return (
    <section data-section="researchGrid" className="py-20">
      <div className="container">
        <p className="eyebrow mb-3">Research</p>
        <h2
          className="mb-3"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 4vw, 2.875rem)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          {heading}
        </h2>
        <p className="mb-10 max-w-2xl" style={{ color: "var(--text-2)" }}>
          Working within the Kepka Group&apos;s mission: driving quality
          improvement and expanding access to cancer prevention for underserved
          populations.
        </p>

        <Suspense fallback={<GridSkeleton />}>
          <ResearchGridItems limit={section.limit} />
        </Suspense>
      </div>
    </section>
  )
}

function GridSkeleton() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
      {[0, 1, 2].map((i) => (
        <div key={i} className="glass h-40 p-6 opacity-50" />
      ))}
    </div>
  )
}

async function ResearchGridItems({ limit }: { limit?: number }) {
  const all = await getResearchProjects()
  const projects =
    typeof limit === "number" && limit > 0 ? all.slice(0, limit) : all

  return (
    <>
      {projects.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => {
              const href = p.slug?.current
                ? `/research/${p.slug.current}`
                : undefined
              const card = (
                <article className="glass flex h-full flex-col p-6">
                  {p.role ? (
                    <span className="tag tag-blue mb-3 self-start">
                      {p.role}
                    </span>
                  ) : null}
                  <h3
                    className="mb-2 text-lg"
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      color: "var(--text)",
                    }}
                  >
                    {p.title || "Untitled project"}
                  </h3>
                  {p.summary ? (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--text-2)" }}
                    >
                      {p.summary}
                    </p>
                  ) : null}
                  {p.methods && p.methods.length > 0 ? (
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {p.methods.slice(0, 4).map((m) => (
                        <span key={m} className="tag tag-teal">
                          {m}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </article>
              )
              return href ? (
                <Link key={p._id} href={href} className="block">
                  {card}
                </Link>
              ) : (
                <div key={p._id}>{card}</div>
              )
            })}
          </div>
        ) : (
          <div className="glass p-8" style={{ color: "var(--text-3)" }}>
            Research projects will appear here soon.
          </div>
        )}
    </>
  )
}
