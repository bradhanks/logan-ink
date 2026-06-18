import type { CSSProperties } from "react"
import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { getFieldFeed } from "@/lib/feed/aggregate"
import type { FeedItem } from "@/lib/feed/types"

export const metadata: Metadata = buildMetadata({
  title: "Field",
  description:
    "Research updates, publications, and dispatches from the field — aggregated from PubMed, NIH RePORTER, ORCID, and Bluesky.",
  path: "/field",
})

// ---------------------------------------------------------------------------
// Cached data loader
// ---------------------------------------------------------------------------

async function loadFeed() {
  "use cache"
  cacheLife(CACHE.feed)
  cacheTag(cacheTags.feed)
  return getFieldFeed()
}

// ---------------------------------------------------------------------------
// Source label map
// ---------------------------------------------------------------------------

const SOURCE_LABELS: Record<string, string> = {
  pubmed: "PubMed",
  reporter: "NIH RePORTER",
  orcid: "ORCID",
  rss: "RSS",
  bluesky: "Bluesky",
}

function sourceLabel(source: string): string {
  return SOURCE_LABELS[source] ?? source
}

// ---------------------------------------------------------------------------
// Source badge colours (using CSS vars from globals.css)
// ---------------------------------------------------------------------------

const SOURCE_BADGE_STYLE: Record<string, CSSProperties> = {
  pubmed: { background: "var(--blue-dim)", color: "var(--blue-dk)" },
  reporter: { background: "var(--teal-dk)", color: "#fff", opacity: 0.85 },
  orcid: { background: "var(--gold)", color: "#fff", opacity: 0.85 },
  rss: { background: "var(--surface-2)", color: "var(--text-2)" },
  bluesky: { background: "var(--rose-dim)", color: "var(--rose-dk)" },
}

function badgeStyle(source: string): CSSProperties {
  return (
    SOURCE_BADGE_STYLE[source] ?? {
      background: "var(--surface-2)",
      color: "var(--text-2)",
    }
  )
}

// ---------------------------------------------------------------------------
// Date formatting — safe for static render (no new Date())
// ---------------------------------------------------------------------------

/** Format an ISO date string to a human-readable date without constructing
 *  a Date object at render time. Accepts YYYY-MM-DD or full ISO timestamps. */
function formatDate(iso: string): string {
  if (typeof iso !== "string" || !iso) return ""
  // Slice the YYYY-MM-DD portion and reformat to e.g. "Jun 17, 2026"
  const datePart = iso.slice(0, 10) // "YYYY-MM-DD"
  const [year, monthStr, day] = datePart.split("-")
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ]
  const monthIndex = parseInt(monthStr, 10) - 1
  const monthName = months[monthIndex] ?? monthStr
  return `${monthName} ${parseInt(day, 10)}, ${year}`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SourceBadge({ source }: { source: string }) {
  return (
    <span
      style={{
        ...badgeStyle(source),
        display: "inline-block",
        fontSize: "0.6rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "0.15em 0.55em",
        borderRadius: "0.3rem",
        verticalAlign: "middle",
        lineHeight: 1.6,
      }}
    >
      {sourceLabel(source)}
    </span>
  )
}

function FeedCard({ item }: { item: FeedItem }) {
  return (
    <article
      className="glass"
      style={{
        padding: "1.25rem 1.5rem",
        borderRadius: "var(--r)",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.75rem",
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--text)",
            lineHeight: 1.45,
            margin: 0,
            flex: "1 1 auto",
          }}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "inherit",
              textDecorationLine: "underline",
              textDecorationColor: "var(--border-2)",
              textUnderlineOffset: "3px",
            }}
          >
            {item.title}
          </a>
        </h2>
        <SourceBadge source={item.source} />
      </div>

      {item.authors && item.authors.length > 0 && (
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--text-3)",
            margin: 0,
            fontFamily: "var(--font-sans)",
          }}
        >
          {item.authors.join(", ")}
        </p>
      )}

      {item.summary && (
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-2)",
            lineHeight: 1.6,
            margin: 0,
            fontFamily: "var(--font-sans)",
          }}
        >
          {item.summary}
        </p>
      )}

      <time
        dateTime={item.date}
        style={{
          fontSize: "0.75rem",
          color: "var(--text-3)",
          fontFamily: "var(--font-mono)",
          marginTop: "0.25rem",
        }}
      >
        {formatDate(item.date)}
      </time>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function FieldPage() {
  const { items, updatedAt, errors } = await loadFeed()

  // Group items by source (preserving insertion order of first occurrence)
  const bySource = new Map<string, FeedItem[]>()
  for (const item of items) {
    const group = bySource.get(item.source) ?? []
    group.push(item)
    bySource.set(item.source, group)
  }

  // Extract just the date portion of updatedAt for display (no new Date())
  const updatedDatePart = updatedAt.slice(0, 10) // YYYY-MM-DD
  const updatedTimePartRaw = updatedAt.slice(11, 16) // HH:MM
  const updatedDisplay = `${formatDate(updatedDatePart)} at ${updatedTimePartRaw} UTC`

  return (
    <div
      style={{
        maxWidth: "52rem",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
      }}
    >
      {/* Page header */}
      <header style={{ marginBottom: "2.5rem" }}>
        <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>
          Field
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          Field Feed
        </h1>
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.95rem",
            color: "var(--text-2)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.6,
          }}
        >
          Research publications, grants, and dispatches from tracked researchers
          — aggregated live from PubMed, NIH RePORTER, ORCID, RSS, and Bluesky.
        </p>
        <p
          style={{
            marginTop: "0.5rem",
            fontSize: "0.75rem",
            color: "var(--text-3)",
            fontFamily: "var(--font-mono)",
          }}
        >
          Updated {updatedDisplay}
        </p>
      </header>

      {/* Source-level errors — honest, non-scary */}
      {errors.length > 0 && (
        <div
          role="status"
          aria-label="Feed source warnings"
          style={{
            marginBottom: "2rem",
            padding: "1rem 1.25rem",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--r)",
          }}
        >
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--text-2)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: "0.4rem",
              fontFamily: "var(--font-sans)",
            }}
          >
            Partial results
          </p>
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "0.2rem",
            }}
          >
            {errors.map((err) => {
              // err is "sourceName: message"
              const colonIdx = err.indexOf(":")
              const sourceName =
                colonIdx > -1 ? err.slice(0, colonIdx) : err
              return (
                <li
                  key={sourceName}
                  style={{
                    fontSize: "0.8rem",
                    color: "var(--text-3)",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  Couldn&apos;t reach{" "}
                  <strong style={{ color: "var(--text-2)" }}>
                    {sourceLabel(sourceName)}
                  </strong>{" "}
                  — results from this source are temporarily unavailable.
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div
          role="status"
          style={{
            padding: "3rem 1.5rem",
            textAlign: "center",
            color: "var(--text-3)",
            fontFamily: "var(--font-sans)",
            fontSize: "0.95rem",
          }}
        >
          <p style={{ marginBottom: "0.5rem" }}>No items yet.</p>
          <p style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
            The feed populates from live public APIs (PubMed, NIH RePORTER,
            ORCID, RSS, and Bluesky). Check back shortly.
          </p>
        </div>
      )}

      {/* Feed grouped by source */}
      {bySource.size > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          {Array.from(bySource.entries()).map(([source, sourceItems]) => (
            <section key={source} aria-labelledby={`source-${source}`}>
              <h2
                id={`source-${source}`}
                style={{
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: "var(--blue)",
                  marginBottom: "1rem",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {sourceLabel(source)}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                {sourceItems.map((item) => (
                  <FeedCard key={item.url} item={item} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}
