import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { connection } from "next/server"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { sanityFetch } from "@/lib/sanity/client"
import { GLOSSARY_TERM_BY_SLUG_QUERY } from "@/lib/sanity/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { PortableBody } from "@/components/sections/RichText"
import type { PortableTextBlock } from "@portabletext/react"
import Link from "next/link"

type RelatedTerm = {
  term: string
  slug: { current: string }
}

type GlossaryTermDetail = {
  _id: string
  term: string
  slug: { current: string }
  shortDef: string | null
  body: PortableTextBlock[] | null
  related: RelatedTerm[] | null
}

// ---------------------------------------------------------------------------
// Cached data loader — called by both generateMetadata and the page component.
// ---------------------------------------------------------------------------

async function getGlossaryTerm(slug: string): Promise<GlossaryTermDetail | null> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.content)
  cacheTag(cacheTags.page(slug))
  return sanityFetch<GlossaryTermDetail | null>(GLOSSARY_TERM_BY_SLUG_QUERY, { slug })
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ term: string }>
}): Promise<Metadata> {
  const { term: slug } = await params
  const termDoc = await getGlossaryTerm(slug)
  if (!termDoc) {
    return buildMetadata({ title: "Not Found", path: `/glossary/${slug}` })
  }
  return buildMetadata({
    title: termDoc.term,
    description: termDoc.shortDef ?? undefined,
    path: `/glossary/${slug}`,
  })
}

// ---------------------------------------------------------------------------
// Page component — dynamic on demand via connection()
// (No generateStaticParams: at build time there are zero Sanity terms, which
//  would cause EmptyGenerateStaticParamsError. Instead we opt into dynamic
//  rendering; data reads stay cached via "use cache".)
// ---------------------------------------------------------------------------

export default async function GlossaryTermPage({
  params,
}: {
  params: Promise<{ term: string }>
}) {
  // connection() opts this route into dynamic rendering so it is never
  // pre-rendered as a static export (avoids the empty-params build error).
  await connection()

  const { term: slug } = await params
  const termDoc = await getGlossaryTerm(slug)

  if (!termDoc) notFound()

  // JSON-LD — DefinedTerm schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: termDoc.term,
    description: termDoc.shortDef ?? undefined,
    url: `https://logan.ink/glossary/${termDoc.slug.current}`,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "Methods Glossary",
      url: "https://logan.ink/glossary",
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article
        className="container"
        style={{ paddingTop: "4rem", paddingBottom: "6rem", maxWidth: "720px" }}
        aria-label={termDoc.term}
      >
        {/* Back link */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: "2rem" }}>
          <Link
            href="/glossary"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              color: "var(--text-3)",
              textDecoration: "none",
            }}
          >
            ← Glossary
          </Link>
        </nav>

        {/* Term header */}
        <header style={{ marginBottom: "2rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
              letterSpacing: "-0.03em",
              color: "var(--text)",
              lineHeight: 1.2,
              marginBottom: "1.25rem",
            }}
          >
            {termDoc.term}
          </h1>

          {/* TL;DR / direct-answer block — AEO */}
          {termDoc.shortDef && (
            <div
              role="note"
              aria-label="Quick definition"
              style={{
                borderLeft: "3px solid var(--blue)",
                paddingLeft: "1.125rem",
                paddingTop: "0.625rem",
                paddingBottom: "0.625rem",
                background: "var(--blue-dim)",
                borderRadius: "0 var(--r) var(--r) 0",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1.0625rem",
                  fontWeight: 500,
                  color: "var(--text)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {termDoc.shortDef}
              </p>
            </div>
          )}
        </header>

        {/* Portable Text body */}
        {termDoc.body && termDoc.body.length > 0 && (
          <section
            aria-label="Full definition"
            style={{ fontFamily: "var(--font-serif)", fontSize: "1.0625rem", lineHeight: 1.75 }}
          >
            <PortableBody value={termDoc.body} />
          </section>
        )}

        {/* Related terms */}
        {termDoc.related && termDoc.related.length > 0 && (
          <nav
            aria-label="Related terms"
            style={{
              marginTop: "3rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid var(--border)",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--text-3)",
                marginBottom: "0.875rem",
              }}
            >
              Related terms
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
              }}
            >
              {termDoc.related.map((rel) => (
                <li key={rel.slug.current}>
                  <Link
                    href={`/glossary/${rel.slug.current}`}
                    style={{
                      display: "inline-block",
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.875rem",
                      color: "var(--blue)",
                      padding: "0.25rem 0.625rem",
                      border: "1px solid var(--blue-dim)",
                      borderRadius: "999px",
                      textDecoration: "none",
                      background: "var(--blue-dim)",
                      transition: "background var(--duration-fast)",
                    }}
                  >
                    {rel.term}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </>
  )
}
