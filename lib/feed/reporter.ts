import type { FeedItem, FeedDeps } from './types'
import type { TrackedResearcher } from './tracked'

/**
 * NIH RePORTER client — funded projects for tracked researchers.
 *
 * Uses the public RePORTER v2 search endpoint. Per NCBI/NIH courtesy policy we
 * include `tool` and `email` query params on the request URL.
 */

const REPORTER = 'https://api.reporter.nih.gov/v2/projects/search'

const TOOL = 'logan.ink-field-feed'
const EMAIL = 'feed@logan.ink'

type RawProject = {
  project_num?: string
  project_title?: string
  award_notice_date?: string
  project_start_date?: string
  abstract_text?: string
  principal_investigators?: { full_name?: string }[]
  contact_pi_name?: string
}

function withParams(base: string): string {
  const url = new URL(base)
  url.searchParams.set('tool', TOOL)
  url.searchParams.set('email', EMAIL)
  return url.toString()
}

function lastName(name: string): string {
  return name.trim().split(/\s+/).pop()?.toLowerCase() ?? ''
}

/**
 * Confident-attribution: keep a project only if the tracked researcher's last
 * name appears among the PIs (or the contact PI). RePORTER PI names are
 * formatted "LAST, FIRST".
 */
function isAttributable(p: RawProject, r: TrackedResearcher): boolean {
  const last = lastName(r.name)
  if (!last) return false
  const pis = (p.principal_investigators ?? [])
    .map((pi) => (pi.full_name ?? '').toLowerCase())
    .concat((p.contact_pi_name ?? '').toLowerCase())
  return pis.some((n) => n.includes(last))
}

function toFeedItem(p: RawProject): FeedItem | null {
  const num = p.project_num
  const title = p.project_title
  if (!num || !title) return null
  const date = (p.award_notice_date ?? p.project_start_date ?? '').split('T')[0]
  return {
    source: 'reporter',
    title,
    url: `https://reporter.nih.gov/project-details/${num}`,
    date,
    summary: p.abstract_text,
    authors: (p.principal_investigators ?? [])
      .map((pi) => pi.full_name)
      .filter((n): n is string => !!n),
  }
}

async function fetchForResearcher(
  r: TrackedResearcher,
  fetchImpl: typeof fetch,
): Promise<FeedItem[]> {
  const last = r.name.trim().split(/\s+/).pop() ?? ''
  const first = r.name.trim().split(/\s+/)[0] ?? ''
  const body = {
    criteria: {
      pi_names: [{ last_name: last, first_name: first }],
    },
    limit: 20,
    sort_field: 'award_notice_date',
    sort_order: 'desc',
  }

  let projects: RawProject[] = []
  try {
    const res = await fetchImpl(withParams(REPORTER), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    projects = json?.results ?? []
  } catch {
    return []
  }
  if (!Array.isArray(projects)) return []

  const items: FeedItem[] = []
  for (const p of projects) {
    if (!isAttributable(p, r)) continue
    const item = toFeedItem(p)
    if (item) items.push(item)
  }
  return items
}

export async function fetchReporter(
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
