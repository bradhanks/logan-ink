import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { cacheLife, cacheTag } from "next/cache"
import { CACHE, cacheTags } from "@/lib/cache"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_ESSAYS_QUERY, ESSAY_BY_SLUG_QUERY } from "@/lib/sanity/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { PortableBody } from "@/components/sections/RichText"
import { Tldr } from "@/components/writing/Tldr"
import { CollaborateCta } from "@/components/writing/CollaborateCta"
import type { PortableTextBlock } from "@portabletext/react"

type EssayListItem = {
  _id: string
  title: string
  slug: { current: string }
  kind: "essay" | "newsletter"
  publishedAt: string | null
  excerpt: string | null
  tags: string[] | null
  collaborateCta: boolean | null
}

type EssayDetail = EssayListItem & {
  body: PortableTextBlock[] | null
}

function formatDate(iso: string | null): string {
  if (!iso) return ""
  // iso is YYYY-MM-DD from Sanity date field
  const [year, month, day] = iso.split("-")
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const m = parseInt(month, 10) - 1
  return `${months[m]} ${parseInt(day, 10)}, ${year}`
}

// Cached data loaders — called by both generateMetadata and the page component
// so both see the same cached response.

async function getEssay(slug: string): Promise<EssayDetail | null> {
  "use cache"
  cacheLife(CACHE.detail)
  cacheTag(cacheTags.page(slug))
  return sanityFetch<EssayDetail | null>(ESSAY_BY_SLUG_QUERY, { slug })
}

async function getAllEssays(): Promise<EssayListItem[]> {
  "use cache"
  cacheLife(CACHE.feed)
  cacheTag(cacheTags.feed)
  return sanityFetch<EssayListItem[]>(ALL_ESSAYS_QUERY)
}

export async function generateStaticParams() {
  const essays = await getAllEssays()
  const params = essays.map((e) => ({ slug: e.slug.current }))
  // Next.js 16 with Cache Components requires at least one result at build time.
  // Return a sentinel when Sanity is empty; notFound() handles it at render time.
  if (params.length === 0) return [{ slug: "_placeholder" }]
  return params
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const essay = await getEssay(slug)
  if (!essay) return buildMetadata({ title: "Not Found", path: `/writing/${slug}` })
  return buildMetadata({
    title: essay.title,
    description: essay.excerpt ?? undefined,
    path: `/writing/${slug}`,
  })
}

export default async function EssayPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  // notFound() must be called outside a "use cache" boundary
  const [essay, allEssays] = await Promise.all([
    getEssay(slug),
    getAllEssays(),
  ])

  if (!essay) notFound()

  return <EssayContent essay={essay} allEssays={allEssays} slug={slug} />
}

// Separate cached component so the render tree itself is cached
async function EssayContent({
  essay,
  allEssays,
  slug,
}: {
  essay: EssayDetail
  allEssays: EssayListItem[]
  slug: string
}) {
  "use cache"
  cacheLife(CACHE.detail)
  cacheTag(cacheTags.page(slug))

  // Prev/next (essays are ordered newest-first)
  const idx = allEssays.findIndex((e) => e.slug.current === slug)
  const prev = idx < allEssays.length - 1 ? allEssays[idx + 1] : null
  const next = idx > 0 ? allEssays[idx - 1] : null

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: essay.title,
    datePublished: essay.publishedAt ?? undefined,
    author: { "@type": "Person", name: "Logan Hanks" },
    description: essay.excerpt ?? undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div>
        <article
          className="container"
          style={{ paddingTop: "4rem", paddingBottom: "6rem", maxWidth: "720px" }}
          aria-label={essay.title}
        >
          {/* Header */}
          <header style={{ marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
              <span
                className={`tag ${essay.kind === "newsletter" ? "tag-rose" : "tag-blue"}`}
              >
                {essay.kind}
              </span>
              {essay.publishedAt && (
                <time
                  dateTime={essay.publishedAt}
                  style={{ fontSize: "0.82rem", color: "var(--text-3)", fontFamily: "var(--font-sans)" }}
                >
                  {formatDate(essay.publishedAt)}
                </time>
              )}
            </div>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
                letterSpacing: "-0.03em",
                color: "var(--text)",
                lineHeight: 1.2,
              }}
            >
              {essay.title}
            </h1>
          </header>

          {/* TL;DR */}
          {essay.excerpt && <Tldr text={essay.excerpt} />}

          {/* Tags */}
          {essay.tags && essay.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "2rem" }}>
              {essay.tags.map((tag) => (
                <span key={tag} className="tag tag-teal">{tag}</span>
              ))}
            </div>
          )}

          {/* Body */}
          {essay.body && (
            <div style={{ fontFamily: "var(--font-serif)", fontSize: "1.0625rem", lineHeight: 1.75 }}>
              <PortableBody value={essay.body} />
            </div>
          )}

          {/* Collaborate CTA */}
          {essay.collaborateCta && <CollaborateCta />}

          {/* Prev / Next */}
          {(prev || next) && (
            <nav
              aria-label="More writing"
              style={{
                marginTop: "4rem",
                paddingTop: "2rem",
                borderTop: "1px solid var(--border)",
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              {prev ? (
                <a
                  href={`/writing/${prev.slug.current}`}
                  style={{ color: "var(--text-2)", fontFamily: "var(--font-sans)", fontSize: "0.875rem" }}
                >
                  <span style={{ color: "var(--text-3)", display: "block", fontSize: "0.72rem", marginBottom: "0.25rem" }}>
                    ← Earlier
                  </span>
                  {prev.title}
                </a>
              ) : (
                <div />
              )}
              {next ? (
                <a
                  href={`/writing/${next.slug.current}`}
                  style={{
                    color: "var(--text-2)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    textAlign: "right",
                  }}
                >
                  <span style={{ color: "var(--text-3)", display: "block", fontSize: "0.72rem", marginBottom: "0.25rem" }}>
                    Later →
                  </span>
                  {next.title}
                </a>
              ) : (
                <div />
              )}
            </nav>
          )}
        </article>
      </div>
    </>
  )
}
