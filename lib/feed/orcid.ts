import type { FeedItem, FeedDeps } from './types'
import type { TrackedResearcher } from './tracked'

/**
 * ORCID public API client — a researcher's "works" (publications, datasets).
 *
 * Only researchers with a configured `orcid` are queried; because the lookup
 * is keyed by the exact ORCID iD, every returned work is confidently
 * attributable to the tracked researcher (no name disambiguation needed).
 */

const ORCID_BASE = 'https://pub.orcid.org/v3.0'

type OrcidExternalId = {
  'external-id-type'?: string
  'external-id-value'?: string
  'external-id-url'?: { value?: string }
}

type OrcidWorkSummary = {
  title?: { title?: { value?: string } }
  'publication-date'?: {
    year?: { value?: string }
    month?: { value?: string }
    day?: { value?: string }
  }
  url?: { value?: string }
  'external-ids'?: { 'external-id'?: OrcidExternalId[] }
}

type OrcidWorkGroup = { 'work-summary'?: OrcidWorkSummary[] }
type OrcidWorks = { group?: OrcidWorkGroup[] }

function pad(v?: string): string | undefined {
  if (!v) return undefined
  return v.padStart(2, '0')
}

function formatDate(pubDate: OrcidWorkSummary['publication-date']): string {
  const year = pubDate?.year?.value
  if (!year) return ''
  const month = pad(pubDate?.month?.value)
  const day = pad(pubDate?.day?.value)
  if (month && day) return `${year}-${month}-${day}`
  if (month) return `${year}-${month}`
  return year
}

/** Resolve a best URL: explicit work url, else a DOI external id. */
function resolveUrl(summary: OrcidWorkSummary): string | undefined {
  if (summary.url?.value) return summary.url.value
  const ids = summary['external-ids']?.['external-id'] ?? []
  const doi = ids.find((i) => i['external-id-type']?.toLowerCase() === 'doi')
  if (doi) {
    if (doi['external-id-url']?.value) return doi['external-id-url'].value
    if (doi['external-id-value']) return `https://doi.org/${doi['external-id-value']}`
  }
  const withUrl = ids.find((i) => i['external-id-url']?.value)
  return withUrl?.['external-id-url']?.value
}

function toFeedItem(summary: OrcidWorkSummary, name: string): FeedItem | null {
  const title = summary.title?.title?.value
  const url = resolveUrl(summary)
  if (!title || !url) return null
  return {
    source: 'orcid',
    title,
    url,
    date: formatDate(summary['publication-date']),
    authors: [name],
  }
}

async function fetchForResearcher(
  r: TrackedResearcher,
  fetchImpl: typeof fetch,
): Promise<FeedItem[]> {
  if (!r.orcid) return []

  let works: OrcidWorks | undefined
  try {
    const res = await fetchImpl(`${ORCID_BASE}/${r.orcid}/works`, {
      headers: { accept: 'application/json' },
    })
    works = await res.json()
  } catch {
    return []
  }

  const groups = works?.group
  if (!Array.isArray(groups)) return []

  const items: FeedItem[] = []
  for (const group of groups) {
    const summary = group['work-summary']?.[0]
    if (!summary) continue
    const item = toFeedItem(summary, r.name)
    if (item) items.push(item)
  }
  return items
}

export async function fetchOrcid(
  researchers: TrackedResearcher[],
  deps?: FeedDeps,
): Promise<FeedItem[]> {
  const fetchImpl = deps?.fetchImpl ?? fetch
  if (!Array.isArray(researchers) || researchers.length === 0) return []
  const all = await Promise.all(
    researchers.map((r) => fetchForResearcher(r, fetchImpl)),
  )
  return all.flat()
}
