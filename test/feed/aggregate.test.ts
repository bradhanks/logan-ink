/**
 * Tests for lib/feed/aggregate.ts
 *
 * All five source clients are stubbed via the `deps` injection bag
 * (AggregateDeps). No real network calls are made.
 */

import { describe, test, expect } from 'vitest'
import { getFieldFeed } from '@/lib/feed/aggregate'
import type { FeedItem } from '@/lib/feed/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeItem(overrides: Partial<FeedItem> & { url: string; date: string }): FeedItem {
  return {
    source: 'pubmed',
    title: 'Test title',
    ...overrides,
  }
}

/** A fetcher that immediately resolves to the given items. */
function okFetcher(items: FeedItem[]) {
  return async () => items
}

/** A fetcher that throws — simulates a source failure. */
function throwingFetcher(msg = 'network error') {
  return async (): Promise<FeedItem[]> => {
    throw new Error(msg)
  }
}

/** A fetcher that returns an empty array. */
function emptyFetcher() {
  return async () => [] as FeedItem[]
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('getFieldFeed', () => {
  // --- merge + sort ---

  test('merges items from all five sources and sorts by date descending', async () => {
    const pubmedItem = makeItem({ source: 'pubmed', url: 'https://a.com/1', date: '2024-03-01' })
    const reporterItem = makeItem({ source: 'reporter', url: 'https://b.com/2', date: '2024-06-15' })
    const orcidItem = makeItem({ source: 'orcid', url: 'https://c.com/3', date: '2024-01-20' })
    const rssItem = makeItem({ source: 'rss', url: 'https://d.com/4', date: '2024-05-05' })
    const blueskyItem = makeItem({ source: 'bluesky', url: 'https://e.com/5', date: '2024-04-10' })

    const result = await getFieldFeed({
      fetchPubmed: okFetcher([pubmedItem]),
      fetchReporter: okFetcher([reporterItem]),
      fetchOrcid: okFetcher([orcidItem]),
      fetchRss: okFetcher([rssItem]),
      fetchBluesky: okFetcher([blueskyItem]),
    })

    expect(result.errors).toEqual([])
    expect(result.items).toHaveLength(5)
    // Sorted descending by date
    expect(result.items.map((i) => i.date)).toEqual([
      '2024-06-15',
      '2024-05-05',
      '2024-04-10',
      '2024-03-01',
      '2024-01-20',
    ])
    expect(result.items.map((i) => i.source)).toEqual([
      'reporter',
      'rss',
      'bluesky',
      'pubmed',
      'orcid',
    ])
  })

  // --- dedupe by url ---

  test('dedupes items sharing the same URL', async () => {
    const item1 = makeItem({ source: 'pubmed', url: 'https://shared.com/paper', date: '2024-05-01', title: 'Paper A' })
    const item2 = makeItem({ source: 'orcid', url: 'https://shared.com/paper', date: '2024-05-01', title: 'Paper A (orcid)' })
    const item3 = makeItem({ source: 'bluesky', url: 'https://unique.com/post', date: '2024-04-01', title: 'Post B' })

    const result = await getFieldFeed({
      fetchPubmed: okFetcher([item1]),
      fetchReporter: emptyFetcher(),
      fetchOrcid: okFetcher([item2]),
      fetchRss: emptyFetcher(),
      fetchBluesky: okFetcher([item3]),
    })

    expect(result.errors).toEqual([])
    expect(result.items).toHaveLength(2)
    // Both unique URLs are present, the duplicate is removed
    const urls = result.items.map((i) => i.url)
    expect(urls).toContain('https://shared.com/paper')
    expect(urls).toContain('https://unique.com/post')
  })

  // --- dedupe by normalized title + date ---

  test('dedupes items with same normalized title and date even when URL differs', async () => {
    const item1 = makeItem({
      source: 'pubmed',
      url: 'https://pubmed.ncbi.nlm.nih.gov/12345/',
      date: '2024-03-15',
      title: '  Effect of HPV Vaccine on Adolescents  ',
    })
    const item2 = makeItem({
      source: 'orcid',
      url: 'https://doi.org/10.1000/xyz',
      date: '2024-03-15',
      title: 'Effect of HPV Vaccine on Adolescents',
    })

    const result = await getFieldFeed({
      fetchPubmed: okFetcher([item1]),
      fetchReporter: emptyFetcher(),
      fetchOrcid: okFetcher([item2]),
      fetchRss: emptyFetcher(),
      fetchBluesky: emptyFetcher(),
    })

    expect(result.errors).toEqual([])
    expect(result.items).toHaveLength(1)
  })

  // --- throwing source → recorded in errors, no fabricated items ---

  test('records a throwing source in errors and omits its items', async () => {
    const goodItem = makeItem({ source: 'reporter', url: 'https://reporter.nih.gov/x', date: '2024-04-01' })

    const result = await getFieldFeed({
      fetchPubmed: throwingFetcher('PubMed API down'),
      fetchReporter: okFetcher([goodItem]),
      fetchOrcid: throwingFetcher('ORCID timeout'),
      fetchRss: emptyFetcher(),
      fetchBluesky: emptyFetcher(),
    })

    // Two sources threw; both should appear in errors
    expect(result.errors).toHaveLength(2)
    expect(result.errors.some((e) => e.toLowerCase().includes('pubmed'))).toBe(true)
    expect(result.errors.some((e) => e.toLowerCase().includes('orcid'))).toBe(true)

    // No fabricated items; only the one real reporter item
    expect(result.items).toHaveLength(1)
    expect(result.items[0].source).toBe('reporter')
  })

  test('does not fabricate items when a source throws — items list contains only real data', async () => {
    const result = await getFieldFeed({
      fetchPubmed: throwingFetcher(),
      fetchReporter: throwingFetcher(),
      fetchOrcid: throwingFetcher(),
      fetchRss: throwingFetcher(),
      fetchBluesky: throwingFetcher(),
    })

    // All five sources failed → no items at all
    expect(result.items).toHaveLength(0)
    // All five failures are recorded
    expect(result.errors).toHaveLength(5)
  })

  // --- all empty ---

  test('returns empty items and no errors when all sources return empty arrays', async () => {
    const result = await getFieldFeed({
      fetchPubmed: emptyFetcher(),
      fetchReporter: emptyFetcher(),
      fetchOrcid: emptyFetcher(),
      fetchRss: emptyFetcher(),
      fetchBluesky: emptyFetcher(),
    })

    expect(result.items).toHaveLength(0)
    expect(result.errors).toEqual([])
  })

  // --- updatedAt ---

  test('updatedAt uses the injected now() and is an ISO string', async () => {
    const fixedTime = '2024-07-04T12:00:00.000Z'
    const result = await getFieldFeed({
      fetchPubmed: emptyFetcher(),
      fetchReporter: emptyFetcher(),
      fetchOrcid: emptyFetcher(),
      fetchRss: emptyFetcher(),
      fetchBluesky: emptyFetcher(),
      now: () => fixedTime,
    })

    expect(result.updatedAt).toBe(fixedTime)
  })

  test('updatedAt defaults to a valid ISO timestamp when now is not injected', async () => {
    const before = new Date().toISOString()
    const result = await getFieldFeed({
      fetchPubmed: emptyFetcher(),
      fetchReporter: emptyFetcher(),
      fetchOrcid: emptyFetcher(),
      fetchRss: emptyFetcher(),
      fetchBluesky: emptyFetcher(),
    })
    const after = new Date().toISOString()

    expect(result.updatedAt >= before).toBe(true)
    expect(result.updatedAt <= after).toBe(true)
    // Must be a valid ISO string
    expect(() => new Date(result.updatedAt).toISOString()).not.toThrow()
  })

  // --- partial success: some empty + some items ---

  test('mixes items from successful sources when some return empty', async () => {
    const item = makeItem({ source: 'rss', url: 'https://rss.example.com/1', date: '2024-08-01' })

    const result = await getFieldFeed({
      fetchPubmed: emptyFetcher(),
      fetchReporter: emptyFetcher(),
      fetchOrcid: emptyFetcher(),
      fetchRss: okFetcher([item]),
      fetchBluesky: emptyFetcher(),
    })

    expect(result.errors).toEqual([])
    expect(result.items).toHaveLength(1)
    expect(result.items[0].source).toBe('rss')
  })
})
