import { notFound } from "next/navigation"
import { connection } from "next/server"
import type { Metadata } from "next"
import type { PortableTextBlock } from "@portabletext/react"
import { buildMetadata } from "@/lib/seo/metadata"
import { absoluteUrl } from "@/lib/site-config"
import { sanityFetch } from "@/lib/sanity/client"
import { GRANT_BY_SLUG_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { PortableBody } from "@/components/sections/RichText"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface FaqItem {
  _key?: string
  q: string
  a?: PortableTextBlock[]
}

interface Grant {
  _id: string
  org: string
  mechanism: string
  slug: { current: string }
  careerStage?: string[]
  topics?: string[]
  amount?: number
  deadline?: string
  deadlineConfirmed?: boolean
  cycleYear?: number
  sourceUrl?: string
  tldr?: string
  body?: PortableTextBlock[]
  faq?: FaqItem[]
}

// ---------------------------------------------------------------------------
// Career stage display labels
// ---------------------------------------------------------------------------

const STAGE_LABELS: Record<string, string> = {
  undergrad: "Undergraduate",
  postbacc: "Post-Baccalaureate",
  predoctoral: "Predoctoral",
  faculty: "Faculty",
}

// ---------------------------------------------------------------------------
// Cached data functions
// ---------------------------------------------------------------------------

async function getGrantBySlug(slug: string): Promise<Grant | null> {
  "use cache"
  cacheLife(CACHE.detail)
  cacheTag(cacheTags.content)
  return sanityFetch<Grant | null>(GRANT_BY_SLUG_QUERY, { slug })
}

// Note: no `generateStaticParams` — under Cache Components it may not return an
// empty array, and pre-seed there are zero grants. The route renders
// dynamically on demand (via `connection()` in the page); the underlying data
// reads are still cached with `"use cache"`, so pages stay fast and crawlable.

// ---------------------------------------------------------------------------
// generateMetadata
// ---------------------------------------------------------------------------

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const grant = await getGrantBySlug(slug)
  if (!grant) return {}

  const title = `${grant.mechanism} — ${grant.org}`
  return buildMetadata({
    title,
    description: grant.tldr ?? undefined,
    path: `/grants/${slug}`,
  })
}

// ---------------------------------------------------------------------------
// JSON-LD helpers
// ---------------------------------------------------------------------------

function buildFaqJsonLd(faq: FaqItem[]) {
  if (!faq || faq.length === 0) return null
  const items = faq
    .filter((item) => item.q)
    .map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        // Use the question text as fallback answer text; rich answers
        // (PortableText) are rendered in the page — JSON-LD gets a plain version.
        text: item.q,
      },
    }))
  if (items.length === 0) return null
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items,
  }
}

function buildWebPageJsonLd(grant: Grant, path: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${grant.mechanism} — ${grant.org}`,
    description: grant.tldr ?? undefined,
    url: absoluteUrl(path),
    ...(grant.sourceUrl
      ? { citation: { "@type": "WebPage", url: grant.sourceUrl } }
      : {}),
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function GrantDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  await connection()
  const { slug } = await params
  const grant = await getGrantBySlug(slug)

  if (!grant) notFound()

  const path = `/grants/${slug}`
  const faqJsonLd = grant.faq ? buildFaqJsonLd(grant.faq) : null
  const webPageJsonLd = buildWebPageJsonLd(grant, path)
  const hasBody = grant.body && grant.body.length > 0
  const hasFaq = grant.faq && grant.faq.length > 0
  const hasDeadlineInfo = grant.deadline || grant.cycleYear

  return (
    <article style={{ minHeight: "60vh" }}>
      {/* JSON-LD */}
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      {/* Hero / header */}
      <section
        style={{
          padding: "4rem 1.5rem 3rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ marginBottom: "0.75rem" }}
          >
            {grant.org}
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(1.75rem, 4.5vw, 2.75rem)",
              letterSpacing: "-0.03em",
              color: "var(--text)",
              lineHeight: 1.15,
              marginBottom: "1.5rem",
            }}
          >
            {grant.mechanism}
          </h1>

          {/* AEO direct-answer / TL;DR block */}
          {grant.tldr ? (
            <div
              role="note"
              aria-label="Summary"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--blue)",
                borderRadius: "var(--r)",
                padding: "1.125rem 1.25rem",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "1rem",
                  color: "var(--text-2)",
                  lineHeight: 1.65,
                  margin: 0,
                }}
              >
                {grant.tldr}
              </p>
            </div>
          ) : null}
        </div>
      </section>

      {/* Key facts */}
      <section style={{ padding: "2.5rem 1.5rem" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 14rem), 1fr))",
              gap: "1rem",
            }}
          >
            {/* Who can apply */}
            {grant.careerStage && grant.careerStage.length > 0 ? (
              <FactBlock label="Who Can Apply">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.5rem" }}>
                  {grant.careerStage.map((stage) => (
                    <span
                      key={stage}
                      style={{
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--blue-dk)",
                        background: "var(--blue-dim)",
                        borderRadius: "999px",
                        padding: "0.2rem 0.65rem",
                      }}
                    >
                      {STAGE_LABELS[stage] ?? stage}
                    </span>
                  ))}
                </div>
              </FactBlock>
            ) : null}

            {/* Amount */}
            {grant.amount ? (
              <FactBlock label="Award Amount">
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.5rem",
                    color: "var(--text)",
                    marginTop: "0.25rem",
                  }}
                >
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(grant.amount)}
                </p>
              </FactBlock>
            ) : null}

            {/* Deadline */}
            {hasDeadlineInfo ? (
              <FactBlock label="Deadline">
                <div style={{ marginTop: "0.25rem" }}>
                  {grant.deadline ? (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "1rem",
                        color: "var(--text)",
                        fontWeight: 500,
                      }}
                    >
                      {grant.deadline}
                      {grant.cycleYear ? ` (${grant.cycleYear})` : ""}
                    </p>
                  ) : grant.cycleYear ? (
                    <p
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontSize: "1rem",
                        color: "var(--text)",
                        fontWeight: 500,
                      }}
                    >
                      Cycle year {grant.cycleYear}
                    </p>
                  ) : null}
                  {grant.deadline ? (
                    <p
                      style={{
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: grant.deadlineConfirmed
                          ? "var(--teal-dk)"
                          : "var(--gold-dk)",
                        marginTop: "0.125rem",
                      }}
                    >
                      {grant.deadlineConfirmed ? "Confirmed" : "Estimated"}
                    </p>
                  ) : null}
                </div>
              </FactBlock>
            ) : null}

            {/* Topics */}
            {grant.topics && grant.topics.length > 0 ? (
              <FactBlock label="Topics">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.5rem" }}>
                  {grant.topics.map((topic) => (
                    <span
                      key={topic}
                      style={{
                        fontSize: "0.75rem",
                        fontFamily: "var(--font-sans)",
                        fontWeight: 500,
                        color: "var(--text-2)",
                        background: "var(--surface-2)",
                        borderRadius: "999px",
                        padding: "0.2rem 0.65rem",
                        border: "1px solid var(--border)",
                      }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </FactBlock>
            ) : null}
          </div>
        </div>
      </section>

      {/* Body content */}
      {hasBody ? (
        <section
          style={{
            padding: "0 1.5rem 3rem",
            borderTop: "1px solid var(--border)",
            paddingTop: "2.5rem",
          }}
        >
          <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
            <PortableBody value={grant.body} />
          </div>
        </section>
      ) : null}

      {/* FAQ */}
      {hasFaq ? (
        <section
          style={{
            padding: "2.5rem 1.5rem 3rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                color: "var(--text)",
                marginBottom: "1.5rem",
              }}
            >
              Frequently Asked Questions
            </h2>
            <dl style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {grant.faq!.map((item, i) => (
                <div
                  key={item._key ?? i}
                  style={{
                    borderTop: i > 0 ? "1px solid var(--border)" : undefined,
                    paddingTop: i > 0 ? "1.5rem" : undefined,
                  }}
                >
                  {item.q ? (
                    <dt
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "1rem",
                        color: "var(--text)",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {item.q}
                    </dt>
                  ) : null}
                  {item.a && item.a.length > 0 ? (
                    <dd style={{ margin: 0 }}>
                      <PortableBody value={item.a} />
                    </dd>
                  ) : null}
                </div>
              ))}
            </dl>
          </div>
        </section>
      ) : null}

      {/* Source citation */}
      {grant.sourceUrl ? (
        <section
          style={{
            padding: "2rem 1.5rem 4rem",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
            <p
              style={{
                fontSize: "0.8125rem",
                fontFamily: "var(--font-sans)",
                color: "var(--text-3)",
              }}
            >
              <strong style={{ color: "var(--text-2)", fontWeight: 600 }}>
                Source:{" "}
              </strong>
              <a
                href={grant.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--blue)",
                  textDecoration: "underline",
                  wordBreak: "break-all",
                }}
              >
                {grant.sourceUrl}
              </a>
            </p>
          </div>
        </section>
      ) : null}
    </article>
  )
}

// ---------------------------------------------------------------------------
// Sub-component: FactBlock
// ---------------------------------------------------------------------------

function FactBlock({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r)",
        padding: "1rem 1.125rem",
      }}
    >
      <p
        style={{
          fontSize: "0.6875rem",
          fontFamily: "var(--font-sans)",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: "var(--text-3)",
          margin: 0,
        }}
      >
        {label}
      </p>
      {children}
    </div>
  )
}
