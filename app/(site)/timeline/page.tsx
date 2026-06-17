import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_TIMELINE_ENTRIES_QUERY, SITE_SETTINGS_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { TimelineCard, type TimelineEntry } from "@/components/timeline/TimelineCard"

export const metadata: Metadata = buildMetadata({
  title: "Timeline",
  description: "A running log of where Logan Hanks has been, what she's working on, and what's next.",
  path: "/timeline",
})

// ---------------------------------------------------------------------------
// Data fetch (cached)
// ---------------------------------------------------------------------------

async function getTimelineEntries(): Promise<TimelineEntry[]> {
  "use cache"
  cacheLife(CACHE.feed)
  cacheTag(cacheTags.feed)
  return sanityFetch<TimelineEntry[]>(ALL_TIMELINE_ENTRIES_QUERY) ?? []
}

interface SiteSettings {
  nowStatus?: string
}

async function getSiteSettings(): Promise<SiteSettings | null> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.content)
  return sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
}

// ---------------------------------------------------------------------------
// Group entries by year
// ---------------------------------------------------------------------------

function groupByYear(entries: TimelineEntry[]): Map<string, TimelineEntry[]> {
  const map = new Map<string, TimelineEntry[]>()
  for (const entry of entries) {
    const year = entry.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(entry)
  }
  return map
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function TimelinePage() {
  const [entries, settings] = await Promise.all([
    getTimelineEntries(),
    getSiteSettings(),
  ])

  const grouped = groupByYear(entries)
  const years = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a))

  return (
    <article>
      {/* ── Header ──────────────────────────────────────────────── */}
      <header
        style={{
          borderBottom: "1px solid var(--border)",
          padding: "5rem 0 3rem",
        }}
      >
        <div className="container">
          <div style={{ maxWidth: "42rem" }}>
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>
              Timeline
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
              What's been happening
            </h1>

            {/* "Now" status line */}
            {settings?.nowStatus && (
              <div
                style={{
                  marginTop: "1.75rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "0.6rem",
                }}
              >
                <span
                  className="pulse"
                  style={{ marginTop: "0.35rem", flexShrink: 0 }}
                  aria-hidden="true"
                />
                <p
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "0.9rem",
                    color: "var(--text-2)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: "var(--text-3)", marginRight: "0.4rem" }}>
                    Now:
                  </span>
                  {settings.nowStatus}
                </p>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── Entries ─────────────────────────────────────────────── */}
      <section style={{ padding: "3rem 0 5rem" }}>
        <div className="container">
          <div style={{ maxWidth: "42rem" }}>
            {entries.length === 0 ? (
              /* Empty state */
              <div
                style={{
                  padding: "4rem 0",
                  textAlign: "center",
                  color: "var(--text-3)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                }}
              >
                <p style={{ margin: 0 }}>No entries yet — check back soon.</p>
              </div>
            ) : (
              <div>
                {years.map((year) => (
                  <section key={year} style={{ marginBottom: "3rem" }}>
                    {/* Year heading */}
                    <h2
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--text-3)",
                        margin: "0 0 1.5rem",
                      }}
                    >
                      {year}
                    </h2>

                    {/* Track */}
                    <div
                      style={{
                        position: "relative",
                      }}
                    >
                      {/* Vertical line */}
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: "0.28rem",
                          top: "0.65rem",
                          bottom: 0,
                          width: "1px",
                          background: "var(--border)",
                        }}
                      />

                      {grouped.get(year)!.map((entry, idx) => (
                        <TimelineCard
                          key={entry._id}
                          entry={entry}
                          isFirst={idx === 0}
                        />
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </article>
  )
}
