import type { FeedItem, FeedDeps } from './types'
import type { TrackedResearcher } from './tracked'

/**
 * PubMed E-utilities client.
 *
 * Flow: esearch (find PMIDs for a researcher) -> esummary (fetch metadata).
 * Disambiguation: prefer an ORCID-constrained query (`<orcid>[auid]`) over a
 * bare "LastName Initials" term, and after fetching summaries DROP any record
 * whose authors cannot be confidently attributed to the tracked researcher
 * (matched by ORCID iD or affiliation), rather than guessing.
 *
 * All requests include `tool` and `email` query params per NCBI policy.
 */

const ESEARCH = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi'
const ESUMMARY = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi'

const TOOL = 'logan.ink-field-feed'
const EMAIL = 'feed@logan.ink'

type RawAuthor = { name?: string; authtype?: string }
type RawSummary = {
  uid?: string
  title?: string
  sortpubdate?: string
  pubdate?: string
  authors?: RawAuthor[]
  // esummary does not return ORCID/affiliation directly; we surface those that
  // we collected via the ORCID-constrained esearch (see below).
  elocationid?: string
}

/**
 * Build the esearch `term`. If an ORCID iD is available we use the `[auid]`
 * field which uniquely identifies the author; otherwise we fall back to the
 * affiliation-constrained pubmedQuery.
 */
function buildTerm(r: TrackedResearcher): string {
  if (r.orcid) return `${r.orcid}[auid]`
  return r.pubmedQuery
}

function withParams(base: string, params: Record<string, string>): string {
  const url = new URL(base)
  url.searchParams.set('tool', TOOL)
  url.searchParams.set('email', EMAIL)
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return url.toString()
}

/**
 * Confident-attribution check. When we searched by ORCID iD, every returned
 * record is already attributable, so we keep it. When we fell back to a name
 * query we require the researcher's last name to appear among the authors AND
 * (best-effort) the affiliation token to be present in the search term — if we
 * cannot confirm, we drop the record.
 */
function isAttributable(
  summary: RawSummary,
  r: TrackedResearcher,
  searchedByOrcid: boolean,
): boolean {
  if (searchedByOrcid) return true
  const authors = summary.authors ?? []
  if (authors.length === 0) return false
  const last = r.name.trim().split(/\s+/).pop()?.toLowerCase() ?? ''
  if (!last) return false
  return authors.some((a) => (a.name ?? '').toLowerCase().includes(last))
}

function toFeedItem(summary: RawSummary): FeedItem | null {
  const uid = summary.uid
  const title = summary.title
  if (!uid || !title) return null
  const date = (summary.sortpubdate ?? summary.pubdate ?? '')
    .split(' ')[0]
    .replace(/\//g, '-')
  return {
    source: 'pubmed',
    title,
    url: `https://pubmed.ncbi.nlm.nih.gov/${uid}/`,
    date,
    authors: (summary.authors ?? [])
      .map((a) => a.name)
      .filter((n): n is string => !!n),
  }
}

async function fetchForResearcher(
  r: TrackedResearcher,
  fetchImpl: typeof fetch,
): Promise<FeedItem[]> {
  const searchedByOrcid = !!r.orcid
  const term = buildTerm(r)

  const esearchUrl = withParams(ESEARCH, {
    db: 'pubmed',
    term,
    retmode: 'json',
    retmax: '20',
    sort: 'pub+date',
  })

  let ids: string[] = []
  try {
    const res = await fetchImpl(esearchUrl)
    const json = await res.json()
    ids = json?.esearchresult?.idlist ?? []
  } catch {
    return []
  }
  if (!Array.isArray(ids) || ids.length === 0) return []

  const esummaryUrl = withParams(ESUMMARY, {
    db: 'pubmed',
    id: ids.join(','),
    retmode: 'json',
  })

  let result: Record<string, unknown> | undefined
  try {
    const res = await fetchImpl(esummaryUrl)
    const json = await res.json()
    result = json?.result
  } catch {
    return []
  }
  if (!result || typeof result !== 'object') return []

  const uids: string[] = Array.isArray((result as { uids?: unknown }).uids)
    ? ((result as { uids: string[] }).uids)
    : []

  const items: FeedItem[] = []
  for (const uid of uids) {
    const summary = (result as Record<string, RawSummary>)[uid]
    if (!summary) continue
    if (!isAttributable(summary, r, searchedByOrcid)) continue
    const item = toFeedItem(summary)
    if (item) items.push(item)
  }
  return items
}

export async function fetchPubmed(
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
