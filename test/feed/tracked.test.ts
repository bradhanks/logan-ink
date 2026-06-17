import { describe, it, expect } from 'vitest'
import { DEFAULT_TRACKED_RESEARCHERS } from '@/lib/feed/tracked'

describe('DEFAULT_TRACKED_RESEARCHERS', () => {
  it('seeds at least three researchers including Dr. Deanna Kepka', () => {
    expect(DEFAULT_TRACKED_RESEARCHERS.length).toBeGreaterThanOrEqual(3)
    const kepka = DEFAULT_TRACKED_RESEARCHERS.find((r) => r.name === 'Deanna Kepka')
    expect(kepka).toBeDefined()
    expect(kepka?.pubmedQuery).toContain('Affiliation')
  })

  it('every entry has a name and a pubmedQuery', () => {
    for (const r of DEFAULT_TRACKED_RESEARCHERS) {
      expect(r.name).toBeTruthy()
      expect(r.pubmedQuery).toBeTruthy()
    }
  })

  it('orcid iDs (when present) are 16-digit dash-grouped', () => {
    for (const r of DEFAULT_TRACKED_RESEARCHERS) {
      if (r.orcid) {
        expect(r.orcid).toMatch(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/)
      }
    }
  })
})
