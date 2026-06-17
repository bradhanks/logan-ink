import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_READING_ITEMS_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"

export const metadata: Metadata = buildMetadata({
  title: "Reading",
  description:
    "An annotated reading list — books, papers, and essays that Logan Hanks has found worth remembering.",
  path: "/reading",
})

// ---------------------------------------------------------------------------
// Data types
// ---------------------------------------------------------------------------

interface ReadingItem {
  _id: string
  title: string
  authors?: string
  url?: string
  note?: string
  tags?: string[]
}

// ---------------------------------------------------------------------------
// Cached data fetch
// ---------------------------------------------------------------------------

async function getReadingItems(): Promise<ReadingItem[]> {
  "use cache"
  cacheLife(CACHE.feed)
  cacheTag(cacheTags.feed)
  return sanityFetch<ReadingItem[]>(ALL_READING_ITEMS_QUERY) ?? []
}

// ---------------------------------------------------------------------------
// Tag colour cycling
// ---------------------------------------------------------------------------

const TAG_CLASSES = ["tag-blue", "tag-rose", "tag-teal", "tag-gold"] as const

function tagClass(tag: string): string {
  // Deterministic colour from tag string so it never shifts on re-render.
  let hash = 0
  for (let i = 0; i < tag.length; i++) {
    hash = (hash * 31 + tag.charCodeAt(i)) >>> 0
  }
  return TAG_CLASSES[hash % TAG_CLASSES.length]
}

// ---------------------------------------------------------------------------
// Reading card
// ---------------------------------------------------------------------------

function ReadingCard({ item }: { item: ReadingItem }) {
  return (
    <article
      style={{
        padding: "1.5rem 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
        }}
      >
        {/* Title + link */}
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1rem",
              fontWeight: 500,
              color: "var(--text)",
              lineHeight: 1.4,
              textDecoration: "underline",
              textDecorationColor: "var(--border-2)",
              textUnderlineOffset: "3px",
            }}
          >
            {item.title}
          </a>
        ) : (
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1rem",
              fontWeight: 500,
              color: "var(--text)",
              lineHeight: 1.4,
            }}
          >
            {item.title}
          </span>
        )}

        {/* Authors */}
        {item.authors && (
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              color: "var(--text-3)",
              margin: 0,
            }}
          >
            {item.authors}
          </p>
        )}

        {/* Note / annotation */}
        {item.note && (
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "0.9rem",
              color: "var(--text-2)",
              lineHeight: 1.65,
              margin: "0.35rem 0 0",
            }}
          >
            {item.note}
          </p>
        )}

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div
            style={{ marginTop: "0.5rem", display: "flex", gap: "0.4rem", flexWrap: "wrap" }}
            aria-label="Tags"
          >
            {item.tags.map((tag) => (
              <span key={tag} className={`tag ${tagClass(tag)}`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ReadingPage() {
  const items = await getReadingItems()

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
              Reading
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
              An annotated shelf
            </h1>
            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "1.0625rem",
                color: "var(--text-2)",
                fontFamily: "var(--font-serif)",
                lineHeight: 1.65,
              }}
            >
              Books, papers, and essays worth remembering — with a note on why.
            </p>
          </div>
        </div>
      </header>

      {/* ── List ────────────────────────────────────────────────── */}
      <section style={{ padding: "3rem 0 5rem" }}>
        <div className="container">
          <div style={{ maxWidth: "42rem" }}>
            {items.length === 0 ? (
              <div
                style={{
                  padding: "4rem 0",
                  textAlign: "center",
                  color: "var(--text-3)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9rem",
                }}
              >
                <p style={{ margin: 0 }}>
                  The shelf is being stocked — check back soon.
                </p>
              </div>
            ) : (
              <div
                role="list"
                aria-label="Reading list"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                {items.map((item) => (
                  <div role="listitem" key={item._id}>
                    <ReadingCard item={item} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </article>
  )
}
