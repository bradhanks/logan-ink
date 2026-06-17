import { Suspense } from "react"
import Link from "next/link"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_ESSAYS_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import type { FieldFeedTeaserSection } from "./types"

interface Essay {
  _id: string
  title?: string
  slug?: { current?: string }
  kind?: string
  publishedAt?: string
  excerpt?: string
}

async function getEssays(): Promise<Essay[]> {
  "use cache"
  cacheLife(CACHE.feed)
  cacheTag(cacheTags.feed)
  try {
    return (await sanityFetch<Essay[]>(ALL_ESSAYS_QUERY)) ?? []
  } catch {
    return []
  }
}

export function FieldFeedTeaser({
  section,
}: {
  section: FieldFeedTeaserSection
}) {
  const heading = section.heading?.trim() || "From the field"

  return (
    <section data-section="fieldFeedTeaser" className="py-20">
      <div className="container">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Stay in the loop</p>
            <h2
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
          </div>
          <Link href="/writing" className="btn-ghost shrink-0">
            All writing →
          </Link>
        </div>

        <Suspense fallback={null}>
          <FieldFeedItems limit={section.limit} />
        </Suspense>
      </div>
    </section>
  )
}

async function FieldFeedItems({ limit }: { limit?: number }) {
  const max = typeof limit === "number" && limit > 0 ? limit : 3
  const essays = (await getEssays()).slice(0, max)

  return (
    <>
      {essays.length > 0 ? (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {essays.map((e) => {
              const href = e.slug?.current
                ? `/writing/${e.slug.current}`
                : "/writing"
              return (
                <li key={e._id}>
                  <Link href={href} className="glass block h-full p-6">
                    {e.kind ? (
                      <span className="tag tag-gold mb-3 inline-block">
                        {e.kind}
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
                      {e.title || "Untitled"}
                    </h3>
                    {e.excerpt ? (
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-2)" }}
                      >
                        {e.excerpt}
                      </p>
                    ) : null}
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="glass p-8" style={{ color: "var(--text-3)" }}>
            New writing is on the way.
          </div>
        )}
    </>
  )
}
