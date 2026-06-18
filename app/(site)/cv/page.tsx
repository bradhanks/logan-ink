import type { Metadata } from "next"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { sanityFetch } from "@/lib/sanity/client"
import {
  SITE_SETTINGS_QUERY,
  ALL_RESEARCH_PROJECTS_QUERY,
} from "@/lib/sanity/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import { siteConfig } from "@/lib/site-config"
import { PrintButton } from "./PrintButton"
import { VCardButton, type VCardFields } from "./VCardButton"

export const metadata: Metadata = buildMetadata({
  title: "CV",
  description: "Curriculum vitae for Logan Hanks — researcher in psychology and social science.",
  path: "/cv",
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SiteSettings = {
  name: string | null
  tagline: string | null
  nowStatus: string | null
  contactEmail: string | null
  orcid: string | null
  scholar: string | null
  socials: Array<{ platform: string | null; url: string | null }> | null
}

type ResearchProject = {
  _id: string
  title: string
  summary: string | null
  role: string | null
  methods: string[] | null
  featured: boolean | null
}

type Publication = {
  _id: string
  title: string
  authors: string[] | null
  venue: string | null
  year: number | null
  status: string | null
  doi: string | null
  url: string | null
}

// ---------------------------------------------------------------------------
// Cached data loaders
// ---------------------------------------------------------------------------

async function getSiteSettings(): Promise<SiteSettings | null> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.content)
  return sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
}

async function getResearchProjects(): Promise<ResearchProject[]> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.content)
  return sanityFetch<ResearchProject[]>(ALL_RESEARCH_PROJECTS_QUERY)
}

async function getPublications(): Promise<Publication[]> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.content)
  // Filter to published-only in the query via status field
  return sanityFetch<Publication[]>(
    `*[_type == "publication" && status == "published"] | order(year desc) {
      _id, _type, title, authors, venue, year, status, doi, url
    }`,
  )
}

// ---------------------------------------------------------------------------
// Static fallbacks
// ---------------------------------------------------------------------------

const EDUCATION = [
  {
    degree: "B.S. (in progress)",
    field: "Population & public health sciences",
    institution: "Utah State University",
    years: "2024 – 2028 (expected)",
  },
]

const SKILLS = [
  "Qualitative methods",
  "Quantitative methods",
  "Science communication",
  "R · Python",
  "Systematic review",
]

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="cv-section-heading"
      style={{
        fontFamily: "var(--font-display)",
        fontWeight: 700,
        fontSize: "1.125rem",
        color: "var(--text)",
        letterSpacing: "-0.01em",
        marginBottom: "0.875rem",
        paddingBottom: "0.375rem",
        borderBottom: "1px solid var(--border)",
      }}
    >
      {children}
    </h2>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function CvPage() {
  const [settings, projects, publications] = await Promise.all([
    getSiteSettings(),
    getResearchProjects(),
    getPublications(),
  ])

  const name = settings?.name ?? siteConfig.name
  const tagline = settings?.tagline ?? siteConfig.description
  const email = settings?.contactEmail ?? null
  const orcid = settings?.orcid ?? null
  const scholar = settings?.scholar ?? null

  const vcardFields: VCardFields = {
    name,
    email,
    website: siteConfig.url,
  }

  return (
    <>
      {/* Print styles — scoped via a style tag inside the document */}
      <style>{`
        @media print {
          /* Hide site chrome */
          header, footer, nav,
          [data-nav], [data-footer],
          .cv-actions {
            display: none !important;
          }
          /* Reset page background */
          body, #main {
            background: #fff !important;
            color: #000 !important;
          }
          /* Single-column, black on white */
          .cv-root {
            max-width: 100% !important;
            padding: 0 !important;
          }
          .cv-root a {
            color: #000 !important;
            text-decoration: underline;
          }
          /* Avoid breaking across page */
          .cv-entry {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          @page {
            margin: 1.5cm 2cm;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cv-actions button {
            transition: none !important;
          }
        }
      `}</style>

      <article
        className="cv-root container"
        style={{ paddingTop: "4rem", paddingBottom: "6rem", maxWidth: "720px" }}
        aria-label="Curriculum Vitae"
      >
        {/* ── Header ── */}
        <header style={{ marginBottom: "2.5rem" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3rem)",
              letterSpacing: "-0.03em",
              color: "var(--text)",
              lineHeight: 1.15,
              marginBottom: "0.5rem",
            }}
          >
            {name}
          </h1>
          {tagline && (
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "1rem",
                color: "var(--text-2)",
                lineHeight: 1.5,
                marginBottom: "1rem",
                maxWidth: "54ch",
              }}
            >
              {tagline}
            </p>
          )}

          {/* Contact line */}
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              color: "var(--text-3)",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.75rem",
              alignItems: "center",
            }}
          >
            {email && (
              <a
                href={`mailto:${email}`}
                style={{ color: "var(--blue)", textDecoration: "none" }}
              >
                {email}
              </a>
            )}
            <a
              href={siteConfig.url}
              style={{ color: "var(--blue)", textDecoration: "none" }}
            >
              {siteConfig.domain}
            </a>
            {orcid && (
              <a
                href={`https://orcid.org/${orcid}`}
                style={{ color: "var(--blue)", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                ORCID {orcid}
              </a>
            )}
            {scholar && (
              <a
                href={scholar}
                style={{ color: "var(--blue)", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Scholar
              </a>
            )}
          </p>
        </header>

        {/* ── Action buttons (hidden in print) ── */}
        <div
          className="cv-actions"
          style={{ display: "flex", gap: "0.625rem", marginBottom: "3rem", flexWrap: "wrap" }}
        >
          <PrintButton />
          <VCardButton fields={vcardFields} />
        </div>

        {/* ── Education ── */}
        <section style={{ marginBottom: "2.5rem" }} aria-labelledby="cv-education">
          <SectionHeading>
            <span id="cv-education">Education</span>
          </SectionHeading>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            {EDUCATION.map((edu, i) => (
              <li key={i} className="cv-entry">
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    color: "var(--text)",
                    margin: 0,
                  }}
                >
                  {edu.degree}, {edu.field}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.875rem",
                    color: "var(--text-2)",
                    margin: "0.125rem 0 0",
                  }}
                >
                  {edu.institution} · {edu.years}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Research Projects ── */}
        <section style={{ marginBottom: "2.5rem" }} aria-labelledby="cv-research">
          <SectionHeading>
            <span id="cv-research">Research</span>
          </SectionHeading>
          {projects.length === 0 ? (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--text-3)" }}>
              Research is in progress — projects appear here as they take shape.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {projects.map((proj) => (
                <li key={proj._id} className="cv-entry">
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 600,
                      fontSize: "0.9375rem",
                      color: "var(--text)",
                      margin: 0,
                    }}
                  >
                    {proj.title}
                    {proj.role && (
                      <span style={{ fontWeight: 400, color: "var(--text-3)", marginLeft: "0.5rem" }}>
                        · {proj.role}
                      </span>
                    )}
                  </p>
                  {proj.summary && (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.875rem",
                        color: "var(--text-2)",
                        lineHeight: 1.55,
                        margin: "0.25rem 0 0",
                      }}
                    >
                      {proj.summary}
                    </p>
                  )}
                  {proj.methods && proj.methods.length > 0 && (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "0.8rem",
                        color: "var(--text-3)",
                        margin: "0.375rem 0 0",
                      }}
                    >
                      Methods: {proj.methods.join(", ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ── Publications ── */}
        <section style={{ marginBottom: "2.5rem" }} aria-labelledby="cv-publications">
          <SectionHeading>
            <span id="cv-publications">Publications</span>
          </SectionHeading>
          {publications.length === 0 ? (
            <p style={{ fontFamily: "var(--font-sans)", fontSize: "0.875rem", color: "var(--text-3)" }}>
              No peer-reviewed publications yet — working toward a first author
              credit before graduate applications.
            </p>
          ) : (
            <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "1.125rem" }}>
              {publications.map((pub) => (
                <li key={pub._id} className="cv-entry">
                  <p
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.9375rem",
                      color: "var(--text)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    {pub.authors && pub.authors.length > 0 && (
                      <span style={{ color: "var(--text-2)" }}>
                        {pub.authors.join(", ")}.{" "}
                      </span>
                    )}
                    {pub.url ? (
                      <a
                        href={pub.url}
                        style={{ color: "var(--text)", fontWeight: 600, textDecoration: "underline" }}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {pub.title}
                      </a>
                    ) : (
                      <strong>{pub.title}</strong>
                    )}
                    {pub.venue && <span style={{ color: "var(--text-2)" }}> · {pub.venue}</span>}
                    {pub.year && <span style={{ color: "var(--text-3)" }}> ({pub.year})</span>}
                    {pub.doi && (
                      <span>
                        {" "}·{" "}
                        <a
                          href={`https://doi.org/${pub.doi}`}
                          style={{ color: "var(--blue)", fontSize: "0.82rem" }}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          DOI
                        </a>
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </section>

        {/* ── Skills ── */}
        <section aria-labelledby="cv-skills">
          <SectionHeading>
            <span id="cv-skills">Skills &amp; Methods</span>
          </SectionHeading>
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
            {SKILLS.map((skill) => (
              <li key={skill}>
                <span
                  className="tag"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.8125rem",
                    color: "var(--text-2)",
                    background: "var(--surface)",
                    borderRadius: "999px",
                    padding: "0.25rem 0.625rem",
                    display: "inline-block",
                  }}
                >
                  {skill}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </article>
    </>
  )
}
