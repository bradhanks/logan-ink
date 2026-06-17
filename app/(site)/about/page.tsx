import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { sanityFetch } from "@/lib/sanity/client"
import { SITE_SETTINGS_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { PortableBody } from "@/components/sections/RichText"
import type { PortableTextBlock } from "@portabletext/react"

export const metadata: Metadata = buildMetadata({
  title: "About",
  description:
    "Logan Hanks — researcher, writer, and grant strategist working at the intersection of rigorous quantitative science and narrative craft.",
  path: "/about",
})

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

interface SiteSettings {
  name?: string
  tagline?: string
  nowStatus?: string
  contactEmail?: string
  orcid?: string
  scholar?: string
  bio?: PortableTextBlock[]
}

// ---------------------------------------------------------------------------
// Cached data fetch
// ---------------------------------------------------------------------------

async function getSiteSettings(): Promise<SiteSettings | null> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.content)
  return sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function AboutPage() {
  const settings = await getSiteSettings()

  const hasBio = settings?.bio && settings.bio.length > 0

  return (
    <article>
      {/* ── Page header ─────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "5rem 0 3rem",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "42rem" }}>
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>
              About
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
              Both hemispheres,
              <br />
              at full ramp.
            </h1>
            {settings?.tagline && (
              <p
                style={{
                  marginTop: "1.25rem",
                  fontSize: "1.125rem",
                  color: "var(--text-2)",
                  fontFamily: "var(--font-serif)",
                  lineHeight: 1.65,
                }}
              >
                {settings.tagline}
              </p>
            )}
          </div>
        </div>
      </header>

      {/* ── Bio body ────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 0 2rem" }}>
        <div className="container">
          <div style={{ maxWidth: "42rem" }}>
            {hasBio ? (
              <PortableBody value={settings!.bio} />
            ) : (
              // Prose fallback with verified biographical facts
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "1.0625rem",
                  lineHeight: 1.7,
                  color: "var(--text-2)",
                }}
              >
                <p style={{ marginBottom: "1.5rem" }}>
                  Logan Hanks is a Tenured Associate Professor in the College of
                  Nursing at the University of Utah, and an Investigator in the
                  Cancer Control &amp; Population Sciences program at the Huntsman
                  Cancer Institute. She leads the Mountain West HPV Vaccination
                  Coalition — a 500-member network spanning clinicians,
                  researchers, and public-health practitioners across the
                  Intermountain West.
                </p>
                <p style={{ marginBottom: "1.5rem" }}>
                  Her work sits at an unusual intersection: the quantitative rigor
                  of population science and the narrative precision of long-form
                  writing. Most researchers operate in one register or the other.
                  She inhabits both, and the friction between them is where her
                  most interesting thinking happens.
                </p>
                <p style={{ marginBottom: "1.5rem" }}>
                  The formative influence on that double practice was Dr. Deanna
                  Kepka, whose mentorship modeled what it looks like to hold
                  a research program, a clinical community, and a public voice
                  at the same time — without softening any of them. That
                  apprenticeship shaped not just a methodological toolkit but
                  a disposition: evidence should be legible, arguments should
                  be honest, and the people affected by the data should be able
                  to read what you wrote about them.
                </p>
                <p style={{ marginBottom: "1.5rem" }}>
                  The HPV coalition grew out of that conviction. Vaccination
                  rates in the Mountain West lag national averages, and the gap
                  is not primarily a knowledge problem — it is a coordination and
                  trust problem. Building a 500-member network means learning to
                  write for a pediatrician and a state health officer and a
                  worried parent and a grant reviewer, sometimes in the same week.
                </p>
                <p>
                  This site is a working record: essays, research notes, a reading
                  list, and a timeline of what is happening now.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Credentials ─────────────────────────────────────────── */}
      <section
        style={{
          padding: "2rem 0 3rem",
          borderTop: "1px solid var(--border)",
          marginTop: "1rem",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "42rem" }}>
            <p
              className="eyebrow"
              style={{ marginBottom: "1.25rem" }}
            >
              Positions
            </p>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {[
                {
                  role: "Tenured Associate Professor",
                  org: "College of Nursing, University of Utah",
                },
                {
                  role: "Investigator, Cancer Control & Population Sciences",
                  org: "Huntsman Cancer Institute",
                },
                {
                  role: "Lead",
                  org: "Mountain West HPV Vaccination Coalition (500 members)",
                },
              ].map(({ role, org }) => (
                <li
                  key={org}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.15rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                      fontSize: "0.9rem",
                      color: "var(--text)",
                    }}
                  >
                    {role}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-sans)",
                      fontSize: "0.84rem",
                      color: "var(--text-3)",
                    }}
                  >
                    {org}
                  </span>
                </li>
              ))}
            </ul>

            {/* External profile links */}
            {(settings?.orcid || settings?.scholar) && (
              <div
                style={{
                  marginTop: "2rem",
                  display: "flex",
                  gap: "0.75rem",
                  flexWrap: "wrap",
                }}
              >
                {settings.orcid && (
                  <a
                    href={`https://orcid.org/${settings.orcid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: "0.8rem", padding: "0.45rem 1rem" }}
                  >
                    ORCID
                  </a>
                )}
                {settings.scholar && (
                  <a
                    href={settings.scholar}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost"
                    style={{ fontSize: "0.8rem", padding: "0.45rem 1rem" }}
                  >
                    Google Scholar
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Contact ─────────────────────────────────────────────── */}
      <section
        id="contact"
        style={{
          padding: "3rem 0 5rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "42rem" }}>
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>
              Get in touch
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                letterSpacing: "-0.02em",
                color: "var(--text)",
                marginBottom: "0.75rem",
              }}
            >
              Say hello.
            </h2>
            <p
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1rem",
                color: "var(--text-2)",
                lineHeight: 1.65,
                marginBottom: "1.5rem",
              }}
            >
              For research inquiries, coalition questions, or just a note —
              the contact page is the right place to start.
            </p>
            <a href="/contact" className="btn-primary">
              Contact
            </a>
          </div>
        </div>
      </section>
    </article>
  )
}
