import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { fetchRss, parseRssXml } from '@/lib/feed/rss'
import type { TrackedResearcher } from '@/lib/feed/tracked'
import { textFetch, throwingFetch } from './helpers'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rssXml = readFileSync(
  join(__dirname, '..', 'fixtures', 'feed', 'rss.xml'),
  'utf8',
)

type ResearcherWithFeeds = TrackedResearcher & { rssFeeds?: string[] }

const withFeed: ResearcherWithFeeds = {
  name: 'Deanna Kepka',
  pubmedQuery: 'Kepka D[Author]',
  rssFeeds: ['https://example.org/feed.xml'],
}

describe('parseRssXml', () => {
  it('parses RSS items into normalized FeedItems (happy path)', () => {
    const items = parseRssXml(rssXml)
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({
      source: 'rss',
      title: 'New study links community outreach to higher HPV vaccination',
      url: 'https://healthcare.utah.edu/huntsmancancerinstitute/news/2025/03/hpv-study',
      date: '2025-03-15',
    })
    expect(items[0].summary).toBe(
      'Researchers report a measurable increase in vaccination rates.',
    )
    // Entity decoding in the second item's description.
    expect(items[1].summary).toContain('cancer prevention & control')
  })

  it('returns [] for empty or malformed XML (no throw)', () => {
    expect(parseRssXml('')).toEqual([])
    expect(parseRssXml('not xml at all')).toEqual([])
    expect(parseRssXml('<rss><channel></channel></rss>')).toEqual([])
  })
})

describe('fetchRss', () => {
  it('fetches and parses a researcher feed', async () => {
    const items = await fetchRss([withFeed], { fetchImpl: textFetch(rssXml) })
    expect(items).toHaveLength(2)
  })

  it('returns [] when no researcher has feeds', async () => {
    const items = await fetchRss(
      [{ name: 'X', pubmedQuery: 'x' }],
      { fetchImpl: textFetch(rssXml) },
    )
    expect(items).toEqual([])
  })

  it('returns [] on network error (no throw)', async () => {
    const items = await fetchRss([withFeed], { fetchImpl: throwingFetch() })
    expect(items).toEqual([])
  })
})
