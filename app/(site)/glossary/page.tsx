import type { Metadata } from "next"
import Link from "next/link"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_GLOSSARY_TERMS_QUERY } from "@/lib/sanity/queries"
import { buildMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = buildMetadata({
  title: "Methods Glossary",
  description:
    "A plain-language reference for qualitative and quantitative research methods used in psychology and social science.",
  path: "/glossary",
})

type GlossaryTermSummary = {
  _id: string
  term: string
  slug: { current: string }
  shortDef: string | null
}

async function getAllGlossaryTerms(): Promise<GlossaryTermSummary[]> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.content)
  return sanityFetch<GlossaryTermSummary[]>(ALL_GLOSSARY_TERMS_QUERY)
}

export default async function GlossaryIndexPage() {
  const terms = await getAllGlossaryTerms()

  // Group alphabetically
  const grouped = terms.reduce<Record<string, GlossaryTermSummary[]>>(
    (acc, term) => {
      const letter = term.term[0]?.toUpperCase() ?? "#"
      if (!acc[letter]) acc[letter] = []
      acc[letter].push(term)
      return acc
    },
    {},
  )
  const letters = Object.keys(grouped).sort()

  return (
    <article
      className="container"
      style={{ paddingTop: "4rem", paddingBottom: "6rem", maxWidth: "720px" }}
    >
      {/* Page header */}
      <header style={{ marginBottom: "3rem" }}>
        <p className="eyebrow" style={{ marginBottom: "0.75rem" }}>
          Logan Hanks
        </p>
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
          Methods Glossary
        </h1>
        <p
          style={{
            marginTop: "1rem",
            color: "var(--text-2)",
            fontFamily: "var(--font-sans)",
            fontSize: "1rem",
            lineHeight: 1.65,
            maxWidth: "58ch",
          }}
        >
          A plain-language reference for research methods used in psychology
          and social science. Each entry gives you a direct answer you can act
          on — plus deeper context when you need it. New terms added as the
          work demands.
        </p>
      </header>

      {/* Empty state */}
      {terms.length === 0 ? (
        <div
          className="glass"
          style={{
            padding: "3rem 2rem",
            textAlign: "center",
            color: "var(--text-3)",
            fontFamily: "var(--font-sans)",
          }}
        >
          <p>Glossary entries are on their way — check back soon.</p>
        </div>
      ) : (
        <section aria-label="Glossary terms">
          {/* Alphabet jump nav */}
          {letters.length > 4 && (
            <nav
              aria-label="Jump to letter"
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.25rem",
                marginBottom: "2.5rem",
              }}
            >
              {letters.map((letter) => (
                <a
                  key={letter}
                  href={`#letter-${letter}`}
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    color: "var(--blue)",
                    padding: "0.2rem 0.45rem",
                    borderRadius: "0.25rem",
                    textDecoration: "none",
                    border: "1px solid var(--border)",
                    lineHeight: 1.4,
                    transition: "background var(--duration-fast)",
                  }}
                >
                  {letter}
                </a>
              ))}
            </nav>
          )}

          {/* Grouped term list */}
          {letters.map((letter) => (
            <section key={letter} id={`letter-${letter}`} aria-label={`Terms starting with ${letter}`}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  color: "var(--text-3)",
                  letterSpacing: "0.03em",
                  marginTop: "2.5rem",
                  marginBottom: "0.75rem",
                  paddingBottom: "0.375rem",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {letter}
              </h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {grouped[letter].map((term) => (
                  <li key={term._id}>
                    <Link
                      href={`/glossary/${term.slug.current}`}
                      style={{
                        display: "block",
                        padding: "0.625rem 0.75rem",
                        borderRadius: "var(--r)",
                        textDecoration: "none",
                        transition: "background var(--duration-fast)",
                      }}
                      className="hover:bg-[var(--surface)]"
                    >
                      <span
                        style={{
                          fontFamily: "var(--font-sans)",
                          fontWeight: 600,
                          fontSize: "0.9375rem",
                          color: "var(--text)",
                          display: "block",
                        }}
                      >
                        {term.term}
                      </span>
                      {term.shortDef && (
                        <span
                          style={{
                            fontFamily: "var(--font-sans)",
                            fontSize: "0.85rem",
                            color: "var(--text-2)",
                            display: "block",
                            marginTop: "0.125rem",
                          }}
                        >
                          {term.shortDef}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </section>
      )}
    </article>
  )
}
