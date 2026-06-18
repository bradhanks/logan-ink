"use client"

import { PortableBody } from "@/components/sections/RichText"
import type { PortableTextBlock } from "@portabletext/react"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface TimelineEntry {
  _id: string
  date: string
  title: string
  body?: PortableTextBlock[]
  category?: string
}

// ---------------------------------------------------------------------------
// Category colour helpers
// ---------------------------------------------------------------------------

const CATEGORY_COLOURS: Record<string, string> = {
  research: "var(--blue)",
  writing: "var(--rose)",
  travel: "var(--teal)",
  milestone: "var(--gold)",
}

function categoryColour(cat?: string): string {
  if (!cat) return "var(--text-3)"
  return CATEGORY_COLOURS[cat.toLowerCase()] ?? "var(--blue)"
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  entry: TimelineEntry
  isFirst?: boolean
}

export function TimelineCard({ entry, isFirst }: Props) {
  const colour = categoryColour(entry.category)

  // Format date as "Month YYYY" without new Date() in static render path.
  // We receive an ISO date string "YYYY-MM-DD" from Sanity.
  const [year, month] =
    typeof entry.date === "string" ? entry.date.split("-") : ["", ""]
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]
  const monthName = monthNames[parseInt(month, 10) - 1] ?? month

  return (
    <article
      style={{
        position: "relative",
        paddingLeft: "2rem",
        paddingBottom: isFirst ? "2rem" : "2.5rem",
      }}
    >
      {/* timeline track dot */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: "0.35rem",
          width: "0.625rem",
          height: "0.625rem",
          borderRadius: "50%",
          background: colour,
          flexShrink: 0,
        }}
      />

      {/* date + category */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          marginBottom: "0.4rem",
          flexWrap: "wrap",
        }}
      >
        <time
          dateTime={entry.date}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-3)",
          }}
        >
          {monthName} {year}
        </time>
        {entry.category && (
          <span
            className="tag"
            style={{
              background: `color-mix(in srgb, ${colour} 14%, transparent)`,
              color: colour,
            }}
          >
            {entry.category}
          </span>
        )}
      </div>

      {/* title */}
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1.1rem",
          color: "var(--text)",
          margin: "0 0 0.5rem",
          lineHeight: 1.3,
        }}
      >
        {entry.title}
      </h2>

      {/* body */}
      {entry.body && entry.body.length > 0 && (
        <div style={{ fontSize: "0.9rem" }}>
          <PortableBody value={entry.body} />
        </div>
      )}
    </article>
  )
}
