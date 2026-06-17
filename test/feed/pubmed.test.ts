import { describe, it, expect } from 'vitest'
import { fetchPubmed } from '@/lib/feed/pubmed'
import type { TrackedResearcher } from '@/lib/feed/tracked'
import esearch from '@/test/fixtures/feed/pubmed-esearch.json'
import esummary from '@/test/fixtures/feed/pubmed-esummary.json'
import esummaryMismatch from '@/test/fixtures/feed/pubmed-esummary-mismatch.json'
import { routedJsonFetch, throwingFetch, malformedJsonFetch } from './helpers'

const kepkaWithOrcid: TrackedResearcher = {
  name: 'Deanna Kepka',
  orcid: '0000-0002-1825-0097',
  pubmedQuery: 'Kepka D[Author]',
}

const kepkaNameOnly: TrackedResearcher = {
  name: 'Deanna Kepka',
  pubmedQuery: 'Kepka D[Author] AND "University of Utah"[Affiliation]',
}

describe('fetchPubmed', () => {
  it('maps esearch+esummary into normalized FeedItems (happy path)', async () => {
    const fetchImpl = routedJsonFetch([
      { match: 'esearch', payload: esearch },
      { match: 'esummary', payload: esummary },
    ])
    const items = await fetchPubmed([kepkaWithOrcid], { fetchImpl })
    expect(items).toHaveLength(2)
    expect(items[0]).toMatchObject({
      source: 'pubmed',
      title: 'HPV vaccination uptake among rural adolescents: a population-science analysis',
      url: 'https://pubmed.ncbi.nlm.nih.gov/39000001/',
      date: '2025-03-15',
    })
    expect(items[0].authors).toContain('Kepka D')
  })

  it('includes tool and email query params on requests', async () => {
    const seen: string[] = []
    const fetchImpl = (async (input: RequestInfo | URL) => {
      const url = String(input)
      seen.push(url)
      const payload = url.includes('esearch') ? esearch : esummary
      return new Response(JSON.stringify(payload), {
        headers: { 'content-type': 'application/json' },
      })
    }) as unknown as typeof fetch
    await fetchPubmed([kepkaWithOrcid], { fetchImpl })
    expect(seen.length).toBeGreaterThan(0)
    for (const url of seen) {
      expect(url).toContain('tool=')
      expect(url).toContain('email=')
    }
  })

  it('uses an ORCID [auid] query when an orcid is present', async () => {
    let esearchUrl = ''
    const fetchImpl = (async (input: RequestInfo | URL) => {
      const url = String(input)
      if (url.includes('esearch')) esearchUrl = url
      const payload = url.includes('esearch') ? esearch : esummary
      return new Response(JSON.stringify(payload), {
        headers: { 'content-type': 'application/json' },
      })
    }) as unknown as typeof fetch
    await fetchPubmed([kepkaWithOrcid], { fetchImpl })
    expect(decodeURIComponent(esearchUrl)).toContain('0000-0002-1825-0097[auid]')
  })

  it('drops records that cannot be confidently attributed (name-only search)', async () => {
    const fetchImpl = routedJsonFetch([
      { match: 'esearch', payload: esearch },
      { match: 'esummary', payload: esummaryMismatch },
    ])
    const items = await fetchPubmed([kepkaNameOnly], { fetchImpl })
    // Only the genuine "Kepka D" record survives; the different-Kepka record is dropped.
    expect(items).toHaveLength(1)
    expect(items[0].title).toBe('Genuine Kepka cancer-prevention study')
  })

  it('returns [] on network error (no throw)', async () => {
    const items = await fetchPubmed([kepkaWithOrcid], { fetchImpl: throwingFetch() })
    expect(items).toEqual([])
  })

  it('returns [] on malformed response (no throw)', async () => {
    const items = await fetchPubmed([kepkaWithOrcid], { fetchImpl: malformedJsonFetch() })
    expect(items).toEqual([])
  })

  it('returns [] for empty researcher list', async () => {
    const items = await fetchPubmed([], { fetchImpl: routedJsonFetch([]) })
    expect(items).toEqual([])
  })
})
