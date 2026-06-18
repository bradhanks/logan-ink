import { sanityClient } from "@/lib/sanity/client"
import { ALL_GRANTS_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { absoluteUrl } from "@/lib/site-config"

interface Grant {
  org?: string
  mechanism?: string
  slug?: { current: string }
  deadline?: string
  deadlineConfirmed?: boolean
  cycleYear?: number
  sourceUrl?: string
  tldr?: string
}

async function getGrantsWithDeadlines(): Promise<Grant[]> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.content)
  try {
    const grants = await sanityClient.fetch<Grant[]>(ALL_GRANTS_QUERY)
    return (grants ?? []).filter((g) => typeof g.deadline === "string")
  } catch {
    return []
  }
}

// Escape per RFC 5545 (commas, semicolons, backslashes, newlines).
function esc(s: string): string {
  return s.replace(/[\\;,]/g, (m) => "\\" + m).replace(/\n/g, "\\n")
}

export async function GET() {
  const grants = await getGrantsWithDeadlines()
  // Fixed DTSTAMP avoids a non-deterministic new Date() in the render path.
  const stamp = "20260101T000000Z"

  const events = grants
    .map((g) => {
      const date = (g.deadline as string).slice(0, 10).replace(/-/g, "") // YYYYMMDD
      const status = g.deadlineConfirmed ? "" : "[Estimated] "
      const title = `${status}${g.org ?? ""} — ${g.mechanism ?? "Grant"} deadline`
      const uid = `grant-${g.slug?.current ?? date}@logan.ink`
      const url = g.sourceUrl || absoluteUrl(`/grants/${g.slug?.current ?? ""}`)
      const desc = [g.tldr, g.cycleYear ? `Cycle: ${g.cycleYear}` : "", url]
        .filter(Boolean)
        .join(" — ")
      return [
        "BEGIN:VEVENT",
        `UID:${uid}`,
        `DTSTAMP:${stamp}`,
        `DTSTART;VALUE=DATE:${date}`,
        `SUMMARY:${esc(title)}`,
        `DESCRIPTION:${esc(desc)}`,
        `URL:${esc(url)}`,
        "END:VEVENT",
      ].join("\r\n")
    })
    .join("\r\n")

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//logan.ink//Grant Deadlines//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:logan.ink — Grant Deadlines",
    events,
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n")

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="logan-ink-grant-deadlines.ics"',
    },
  })
}
