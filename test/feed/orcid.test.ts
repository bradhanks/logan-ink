import { describe, it, expect } from 'vitest'
import { fetchOrcid } from '@/lib/feed/orcid'
import type { TrackedResearcher } from '@/lib/feed/tracked'
import works from '@/test/fixtures/feed/orcid-works.json'
import { jsonFetch, throwingFetch, malformedJsonFetch } from './helpers'

const kepka: TrackedResearcher = {
  name: 'Deanna Kepka',
  orcid: '0000-0002-1825-0097',
  pubmedQuery: 'Kepka D[Author]',
}

const noOrcid: TrackedResearcher = {
  name: 'No Orcid',
  pubmedQuery: 'Foo[Author]',
}

describe('fetchOrcid', () => {
  it('maps ORCID works into normalized FeedItems (happy path)', async () => {
    const items = await fetchOrcid([kepka], { fetchImpl: jsonFetch(works) })
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({
      source: 'orcid',
      title: 'HPV vaccine confidence interventions',
      url: 'https://doi.org/10.1000/orcid.example.1',
      date: '2025-03-15',
    })
    expect(items[0].authors).toEqual(['Deanna Kepka'])
    // Second work has no explicit url; falls back to DOI external id.
    expect(items[1].url).toBe('https://doi.org/10.1000/orcid.example.2')
    expect(items[1].date).toBe('2024-11')
  })

  it('queries the ORCID iD endpoint', async () => {
    let seen = ''
    const fetchImpl = (async (input: RequestInfo | URL) => {
      seen = String(input)
      return new Response(JSON.stringify(works), {
        headers: { 'content-type': 'application/json' },
      })
    }) as unknown as typeof fetch
    await fetchOrcid([kepka], { fetchImpl })
    expect(seen).toContain('0000-0002-1825-0097/works')
  })

  it('skips researchers without an ORCID', async () => {
    const items = await fetchOrcid([noOrcid], { fetchImpl: jsonFetch(works) })
    expect(items).toEqual([])
  })

  it('returns [] on network error (no throw)', async () => {
    const items = await fetchOrcid([kepka], { fetchImpl: throwingFetch() })
    expect(items).toEqual([])
  })

  it('returns [] on malformed response (no throw)', async () => {
    const items = await fetchOrcid([kepka], { fetchImpl: malformedJsonFetch() })
    expect(items).toEqual([])
  })
})
