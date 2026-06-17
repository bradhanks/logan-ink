import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { sanityFetch } from "@/lib/sanity/client"
import {
  ALL_RESEARCH_PROJECTS_QUERY,
  ALL_PUBLICATIONS_QUERY,
} from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { absoluteUrl } from "@/lib/site-config"

export const metadata: Metadata = buildMetadata({
  title: "Research",
  description:
    "Research projects and publications from Logan Hanks — population science, HPV vaccination, and cancer control.",
  path: "/research",
})

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

interface ResearchProject {
  _id: string
  title: string
  slug?: { current: string }
  summary?: string
  role?: string
  methods?: string[]
  featured?: boolean
}

interface Publication {
  _id: string
  title: string
  authors?: string[]
  venue?: string
  year?: number
  status?: "published" | "inPrep" | "placeholder"
  doi?: string
  url?: string
}

// ---------------------------------------------------------------------------
// Cached data fetches
// ---------------------------------------------------------------------------

async function getResearchProjects(): Promise<ResearchProject[]> {
  "use cache"
  cacheLife(CACHE.gallery)
  cacheTag(cacheTags.gallery)
  return sanityFetch<ResearchProject[]>(ALL_RESEARCH_PROJECTS_QUERY) ?? []
}

async function getPublications(): Promise<Publication[]> {
  "use cache"
  cacheLife(CACHE.gallery)
  cacheTag(cacheTags.gallery)
  return sanityFetch<Publication[]>(ALL_PUBLICATIONS_QUERY) ?? []
}

// ---------------------------------------------------------------------------
// JSON-LD builder — only for published items
// ---------------------------------------------------------------------------

function buildJsonLd(publications: Publication[]) {
  const published = publications.filter((p) => p.status === "published")
  if (published.length === 0) return null

  return {
    "@context": "https://schema.org",
    "@graph": published.map((pub) => {
      const article: Record<string, unknown> = {
        "@type": "ScholarlyArticle",
        name: pub.title,
        ...(pub.authors && pub.authors.length > 0
          ? {
              author: pub.authors.map((a) => ({
                "@type": "Person",
                name: a,
              })),
            }
          : {}),
        ...(pub.venue ? { isPartOf: { "@type": "Periodical", name: pub.venue } } : {}),
        ...(pub.year ? { datePublished: String(pub.year) } : {}),
        ...(pub.doi ? { identifier: `https://doi.org/${pub.doi}` } : {}),
        ...(pub.url ? { url: pub.url } : pub.doi ? { url: `https://doi.org/${pub.doi}` } : {}),
        mainEntityOfPage: absoluteUrl("/research"),
      }
      return article
    }),
  }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function MethodTag({ label }: { label: string }) {
  return (
    <span
      className="tag tag-blue"
      style={{ display: "inline-block", marginRight: "0.4rem", marginBottom: "0.3rem" }}
    >
      {label}
    </span>
  )
}

function ProjectCard({ project }: { project: ResearchProject }) {
  return (
    <article
      className="glass"
      style={{ padding: "1.5rem", marginBottom: "1.25rem" }}
    >
      {project.featured && (
        <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>
          Featured
        </p>
      )}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1.125rem",
          color: "var(--text)",
          margin: "0 0 0.35rem",
          lineHeight: 1.3,
        }}
      >
        {project.title}
      </h2>
      {project.role && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.8rem",
            color: "var(--text-3)",
            margin: "0 0 0.75rem",
          }}
        >
          {project.role}
        </p>
      )}
      {project.summary && (
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "0.95rem",
            color: "var(--text-2)",
            lineHeight: 1.65,
            margin: "0 0 1rem",
          }}
        >
          {project.summary}
        </p>
      )}
      {project.methods && project.methods.length > 0 && (
        <div aria-label="Methods">
          {project.methods.map((m) => (
            <MethodTag key={m} label={m} />
          ))}
        </div>
      )}
    </article>
  )
}

function PublicationRow({ pub }: { pub: Publication }) {
  const href = pub.url ?? (pub.doi ? `https://doi.org/${pub.doi}` : null)

  const statusLabel: Record<string, string> = {
    inPrep: "In prep",
    placeholder: "Forthcoming",
  }

  return (
    <li
      style={{
        padding: "1.25rem 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.95rem",
                color: "var(--text)",
                fontWeight: 500,
                lineHeight: 1.4,
                textDecoration: "underline",
                textDecorationColor: "var(--border-2)",
                textUnderlineOffset: "3px",
              }}
            >
              {pub.title}
            </a>
          ) : (
            <span
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "0.95rem",
                color: "var(--text)",
                fontWeight: 500,
                lineHeight: 1.4,
              }}
            >
              {pub.title}
            </span>
          )}

          {pub.authors && pub.authors.length > 0 && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                color: "var(--text-3)",
                margin: "0.25rem 0 0",
                lineHeight: 1.5,
              }}
            >
              {pub.authors.join(", ")}
            </p>
          )}

          {(pub.venue || pub.year) && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.8rem",
                color: "var(--text-3)",
                margin: "0.2rem 0 0",
                fontStyle: "italic",
              }}
            >
              {[pub.venue, pub.year].filter(Boolean).join(", ")}
            </p>
          )}
        </div>

        {pub.status && pub.status !== "published" && (
          <span
            className="tag tag-rose"
            style={{ flexShrink: 0, alignSelf: "flex-start" }}
          >
            {statusLabel[pub.status] ?? pub.status}
          </span>
        )}
      </div>
    </li>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ResearchPage() {
  const [projects, publications] = await Promise.all([
    getResearchProjects(),
    getPublications(),
  ])

  const jsonLd = buildJsonLd(publications)

  return (
    <>
      {jsonLd && (
        // Safe: content is server-constructed from typed Sanity data and
        // serialised with JSON.stringify — no raw HTML or user-supplied markup.
        // JSON.stringify escapes all special characters, making XSS impossible.
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <article>
        {/* ── Header ────────────────────────────────────────────── */}
        <header
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "5rem 0 3rem",
          }}
        >
          <div className="container">
            <div style={{ maxWidth: "52rem" }}>
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>
                Research
              </p>
              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
                  letterSpacing: "-0.03em",
                  color: "var(--text)",
                  lineHeight: 1.1,
                  margin: 0,
                }}
              >
                Projects &amp; publications
              </h1>
              <p
                style={{
                  marginTop: "1.25rem",
                  fontSize: "1.0625rem",
                  color: "var(--text-2)",
                  fontFamily: "var(--font-serif)",
                  lineHeight: 1.65,
                  maxWidth: "38rem",
                }}
              >
                Population science on HPV vaccination, cancer control, and
                health equity in the Mountain West. Methods-forward; narrative
                where it matters.
              </p>
            </div>
          </div>
        </header>

        {/* ── Projects ──────────────────────────────────────────── */}
        <section style={{ padding: "3.5rem 0 1rem" }}>
          <div className="container">
            <div style={{ maxWidth: "52rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-3)",
                  margin: "0 0 2rem",
                }}
              >
                Projects
              </h2>

              {projects.length === 0 ? (
                <p
                  style={{
                    color: "var(--text-3)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    padding: "3rem 0",
                    textAlign: "center",
                  }}
                >
                  Projects will appear here as they are added.
                </p>
              ) : (
                projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── Publications ──────────────────────────────────────── */}
        <section style={{ padding: "2rem 0 5rem" }}>
          <div className="container">
            <div style={{ maxWidth: "52rem" }}>
              <h2
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--text-3)",
                  margin: "0 0 0.5rem",
                }}
              >
                Publications
              </h2>

              {publications.length === 0 ? (
                <p
                  style={{
                    color: "var(--text-3)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    padding: "3rem 0",
                    textAlign: "center",
                  }}
                >
                  Publications will appear here as they are added.
                </p>
              ) : (
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    borderTop: "1px solid var(--border)",
                  }}
                  aria-label="Publications list"
                >
                  {publications.map((pub) => (
                    <PublicationRow key={pub._id} pub={pub} />
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </article>
    </>
  )
}
