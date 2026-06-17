/**
 * Field Feed aggregation layer.
 *
 * Calls all five source clients in parallel, merges results, deduplicates
 * (by URL, and by normalized title + date), sorts by date descending, and
 * records a per-source error string when a source throws or returns nothing.
 *
 * NOTE: This module is intentionally pure / cache-free. The page (or Server
 * Action) that calls getFieldFeed should wrap it with:
 *
 *   "use cache";
 *   cacheLife(CACHE.feed);
 *   cacheTag(cacheTags.feed);
 *
 * Do NOT add "use cache" or import lib/cache.ts here — caching is the
 * caller's responsibility.
 */

import type { FeedItem } from './types'
import type { TrackedResearcher } from './tracked'
import { DEFAULT_TRACKED_RESEARCHERS } from './tracked'
import { fetchPubmed } from './pubmed'
import { fetchReporter } from './reporter'
import { fetchOrcid } from './orcid'
import { fetchRss } from './rss'
import { fetchBluesky } from './bluesky'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Async function that resolves to an array of FeedItems. */
type SourceFetcher = () => Promise<FeedItem[]>

/**
 * Optional dependency bag for getFieldFeed.
 *
 * In production all fields default to the real client functions.
 * In tests, pass stub fetchers to avoid network calls.
 */
export type AggregateDeps = {
  /** Stub for the PubMed client. Receives no arguments — partial application
   *  of researchers happens inside the default path. */
  fetchPubmed?: SourceFetcher
  fetchReporter?: SourceFetcher
  fetchOrcid?: SourceFetcher
  fetchRss?: SourceFetcher
  fetchBluesky?: SourceFetcher
  /** Injectable clock — return an ISO string. Defaults to new Date().toISOString(). */
  now?: () => string
  /** Optional list of researchers (defaults to DEFAULT_TRACKED_RESEARCHERS). */
  researchers?: TrackedResearcher[]
}

export type FieldFeedResult = {
  items: FeedItem[]
  updatedAt: string
  errors: string[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Normalize a title for dedup: lowercase, collapse whitespace, trim. */
function normalizeTitle(title: string): string {
  return title.toLowerCase().replace(/\s+/g, ' ').trim()
}

/** Stable sort comparator: descending by date string (ISO lexicographic order). */
function byDateDesc(a: FeedItem, b: FeedItem): number {
  if (b.date > a.date) return 1
  if (b.date < a.date) return -1
  return 0
}

/** Remove duplicate items. Priority: first seen wins.
 *  Two items are considered duplicates if they share the same URL, or if they
 *  share both the same normalized title AND the same date. */
function dedupe(items: FeedItem[]): FeedItem[] {
  const seenUrls = new Set<string>()
  const seenTitleDate = new Set<string>()
  const result: FeedItem[] = []

  for (const item of items) {
    if (seenUrls.has(item.url)) continue
    const titleDateKey = `${normalizeTitle(item.title)}::${item.date}`
    if (seenTitleDate.has(titleDateKey)) continue

    seenUrls.add(item.url)
    seenTitleDate.add(titleDateKey)
    result.push(item)
  }

  return result
}

// ---------------------------------------------------------------------------
// Named source descriptors — map a label to a fetcher factory so we can
// attribute errors to the correct source name.
// ---------------------------------------------------------------------------

type SourceDescriptor = {
  name: string
  fetcher: SourceFetcher
}

function buildSources(deps: AggregateDeps, researchers: TrackedResearcher[]): SourceDescriptor[] {
  return [
    {
      name: 'pubmed',
      fetcher: deps.fetchPubmed ?? (() => fetchPubmed(researchers)),
    },
    {
      name: 'reporter',
      fetcher: deps.fetchReporter ?? (() => fetchReporter(researchers)),
    },
    {
      name: 'orcid',
      fetcher: deps.fetchOrcid ?? (() => fetchOrcid(researchers)),
    },
    {
      name: 'rss',
      fetcher: deps.fetchRss ?? (() => fetchRss(researchers)),
    },
    {
      name: 'bluesky',
      fetcher: deps.fetchBluesky ?? (() => fetchBluesky(researchers)),
    },
  ]
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch and aggregate the Field Feed from all five sources.
 *
 * Errors from individual sources are collected in the `errors` array.
 * A failing source contributes no items — never fabricated placeholders.
 */
export async function getFieldFeed(deps: AggregateDeps = {}): Promise<FieldFeedResult> {
  const now = deps.now ?? (() => new Date().toISOString())
  const researchers = deps.researchers ?? DEFAULT_TRACKED_RESEARCHERS

  const sources = buildSources(deps, researchers)

  // Run all sources in parallel; catch per-source errors individually.
  const settled = await Promise.allSettled(
    sources.map(({ fetcher }) => fetcher()),
  )

  const allItems: FeedItem[] = []
  const errors: string[] = []

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i]
    const { name } = sources[i]

    if (result.status === 'fulfilled') {
      allItems.push(...result.value)
    } else {
      const reason = result.reason instanceof Error
        ? result.reason.message
        : String(result.reason)
      errors.push(`${name}: ${reason}`)
    }
  }

  const items = dedupe(allItems).sort(byDateDesc)

  return {
    items,
    updatedAt: now(),
    errors,
  }
}
