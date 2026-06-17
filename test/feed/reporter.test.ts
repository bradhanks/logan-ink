import { describe, it, expect } from 'vitest'
import { fetchReporter } from '@/lib/feed/reporter'
import type { TrackedResearcher } from '@/lib/feed/tracked'
import reporter from '@/test/fixtures/feed/reporter.json'
import { jsonFetch, throwingFetch, malformedJsonFetch } from './helpers'

const kepka: TrackedResearcher = {
  name: 'Deanna Kepka',
  pubmedQuery: 'Kepka D[Author]',
}

describe('fetchReporter', () => {
  it('maps RePORTER results into normalized FeedItems (happy path)', async () => {
    const items = await fetchReporter([kepka], { fetchImpl: jsonFetch(reporter) })
    // Only the project led by KEPKA survives; the GARCIA project is dropped.
    expect(items).toHaveLength(1)
    expect(items[0]).toMatchObject({
      source: 'reporter',
      title: 'Scaling HPV vaccination in the Mountain West',
      url: 'https://reporter.nih.gov/project-details/5R01CA123456-05',
      date: '2025-02-01',
    })
    expect(items[0].authors).toContain('KEPKA, DEANNA')
  })

  it('includes tool and email query params on the request', async () => {
    let seen = ''
    const fetchImpl = (async (input: RequestInfo | URL) => {
      seen = String(input)
      return new Response(JSON.stringify(reporter), {
        headers: { 'content-type': 'application/json' },
      })
    }) as unknown as typeof fetch
    await fetchReporter([kepka], { fetchImpl })
    expect(seen).toContain('tool=')
    expect(seen).toContain('email=')
  })

  it('returns [] on network error (no throw)', async () => {
    const items = await fetchReporter([kepka], { fetchImpl: throwingFetch() })
    expect(items).toEqual([])
  })

  it('returns [] on malformed response (no throw)', async () => {
    const items = await fetchReporter([kepka], { fetchImpl: malformedJsonFetch() })
    expect(items).toEqual([])
  })

  it('returns [] for empty researcher list', async () => {
    const items = await fetchReporter([], { fetchImpl: jsonFetch(reporter) })
    expect(items).toEqual([])
  })
})
