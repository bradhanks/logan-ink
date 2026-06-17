import { describe, it, expect } from 'vitest'
import { fetchBluesky } from '@/lib/feed/bluesky'
import type { TrackedResearcher } from '@/lib/feed/tracked'
import feed from '@/test/fixtures/feed/bluesky.json'
import { jsonFetch, throwingFetch, malformedJsonFetch } from './helpers'

const kepka: TrackedResearcher = {
  name: 'Deanna Kepka',
  pubmedQuery: 'Kepka D[Author]',
  blueskyHandle: 'deannakepka.bsky.social',
}

const noHandle: TrackedResearcher = {
  name: 'No Handle',
  pubmedQuery: 'x',
}

describe('fetchBluesky', () => {
  it('maps the author feed into normalized FeedItems and drops reposts', async () => {
    const items = await fetchBluesky([kepka], { fetchImpl: jsonFetch(feed) })
    // The repost (not authored by the tracked researcher) is dropped.
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      source: 'bluesky',
      url: 'https://bsky.app/profile/deannakepka.bsky.social/post/3kxyz1',
      date: '2025-03-16',
    })
    expect(items[0].title).toContain('Excited to share our new paper')
    expect(items[0].authors).toContain('Deanna Kepka, PhD')
  })

  it('passes the handle as the actor query param', async () => {
    let seen = ''
    const fetchImpl = (async (input: RequestInfo | URL) => {
      seen = String(input)
      return new Response(JSON.stringify(feed), {
        headers: { 'content-type': 'application/json' },
      })
    }) as unknown as typeof fetch
    await fetchBluesky([kepka], { fetchImpl })
    expect(seen).toContain('actor=deannakepka.bsky.social')
    expect(seen).toContain('app.bsky.feed.getAuthorFeed')
  })

  it('skips researchers without a handle', async () => {
    const items = await fetchBluesky([noHandle], { fetchImpl: jsonFetch(feed) })
    expect(items).toEqual([])
  })

  it('returns [] on network error (no throw)', async () => {
    const items = await fetchBluesky([kepka], { fetchImpl: throwingFetch() })
    expect(items).toEqual([])
  })

  it('returns [] on malformed response (no throw)', async () => {
    const items = await fetchBluesky([kepka], { fetchImpl: malformedJsonFetch() })
    expect(items).toEqual([])
  })
})
