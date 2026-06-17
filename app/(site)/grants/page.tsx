import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_GRANTS_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { GrantFilters } from "@/components/grants/GrantFilters"
import type { GrantCardData } from "@/components/grants/GrantCard"

export const metadata: Metadata = buildMetadata({
  title: "Grants",
  description:
    "A curated index of research grants and fellowships for undergrads, post-baccs, predoctoral trainees, and faculty — with deadlines, amounts, and plain-English summaries.",
  path: "/grants",
})

async function getAllGrants(): Promise<GrantCardData[]> {
  "use cache"
  cacheLife(CACHE.gallery)
  cacheTag(cacheTags.content)
  return sanityFetch<GrantCardData[]>(ALL_GRANTS_QUERY)
}

export default async function GrantsPage() {
  const grants = await getAllGrants()

  return (
    <main style={{ minHeight: "60vh" }}>
      {/* Page header */}
      <section
        style={{
          padding: "4rem 1.5rem 3rem",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          <p
            className="eyebrow"
            style={{ marginBottom: "0.75rem" }}
          >
            Funding Intelligence
          </p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.25rem)",
              letterSpacing: "-0.03em",
              color: "var(--text)",
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}
          >
            Grants &amp; Fellowships
          </h1>

          {/* AEO direct-answer block */}
          <div
            role="note"
            aria-label="Quick answer"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderLeft: "3px solid var(--blue)",
              borderRadius: "var(--r)",
              padding: "1.125rem 1.25rem",
              maxWidth: "48rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                color: "var(--text-2)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              <strong style={{ color: "var(--text)", fontWeight: 600 }}>
                What grants are available for early-career researchers?
              </strong>{" "}
              This index collects mechanism names, eligibility by career stage
              (undergrad through faculty), award amounts, and cycle-year
              deadlines — with confirmed vs. estimated status — so you can
              quickly identify which programs fit your current position.
            </p>
          </div>
        </div>
      </section>

      {/* Grants section */}
      <section style={{ padding: "3rem 1.5rem 5rem" }}>
        <div style={{ maxWidth: "64rem", margin: "0 auto" }}>
          {grants.length === 0 ? (
            /* Empty state */
            <div
              style={{
                textAlign: "center",
                padding: "5rem 1.5rem",
                color: "var(--text-3)",
                fontFamily: "var(--font-sans)",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.5rem",
                  color: "var(--text-2)",
                  marginBottom: "0.75rem",
                }}
              >
                Grant intelligence coming together.
              </p>
              <p style={{ fontSize: "0.9375rem", lineHeight: 1.65 }}>
                We&rsquo;re curating and verifying grant data before it goes
                live. Check back soon — or reach out if there&rsquo;s a
                specific mechanism you&rsquo;re trying to find.
              </p>
            </div>
          ) : (
            <GrantFilters grants={grants} />
          )}
        </div>
      </section>
    </main>
  )
}
