/**
 * Tracked-researcher configuration for the Field Feed.
 *
 * In production this is intended to be sourced from a `trackedResearcher`
 * Sanity document; this module provides the typed default fallback used when
 * no CMS data is available (and as the shape the Sanity doc must satisfy).
 */
export type TrackedResearcher = {
  /** Display name, "First Last". */
  name: string
  /**
   * ORCID iD (16 digits, dash-grouped). Preferred disambiguation key:
   * an ORCID -> PubMed lookup is far more reliable than "LastName Initials".
   */
  orcid?: string
  /**
   * PubMed E-utilities query term used as a fallback / supplement. Should be
   * affiliation-constrained where possible so a same-named researcher at a
   * different institution is not surfaced.
   */
  pubmedQuery: string
  /** Bluesky handle (without leading @), e.g. "kepka.bsky.social". */
  blueskyHandle?: string
}

/**
 * NOTE: ASSUMPTIONS TO CONFIRM.
 *
 * The values below are best-effort seeds and MUST be verified before going to
 * production:
 *   - ORCID iDs are plausible-format placeholders, NOT confirmed real iDs.
 *   - Bluesky handles are guesses and may not exist.
 *   - PubMed queries are affiliation-constrained guesses.
 * Dr. Deanna Kepka is a real HPV / cancer-prevention researcher at the
 * University of Utah / Huntsman Cancer Institute; the other two are plausible
 * cancer-prevention / population-science researchers included as examples.
 * Replace these with confirmed values (ideally from the Sanity doc) before
 * shipping.
 */
export const DEFAULT_TRACKED_RESEARCHERS: TrackedResearcher[] = [
  {
    name: 'Deanna Kepka',
    // ASSUMPTION: placeholder ORCID — confirm Dr. Kepka's real iD.
    orcid: '0000-0002-1825-0097',
    pubmedQuery:
      'Kepka D[Author] AND ("University of Utah"[Affiliation] OR "Huntsman Cancer Institute"[Affiliation])',
    // ASSUMPTION: handle is a guess — confirm or remove.
    blueskyHandle: 'deannakepka.bsky.social',
  },
  {
    // ASSUMPTION: plausible cancer-prevention / population-science researcher.
    name: 'Electra Paskett',
    orcid: '0000-0001-5099-4234',
    pubmedQuery:
      'Paskett ED[Author] AND ("Ohio State University"[Affiliation] OR "OSU"[Affiliation])',
  },
  {
    // ASSUMPTION: plausible cancer-prevention / population-science researcher.
    name: 'Jennifer Wenzel',
    orcid: '0000-0003-1415-9265',
    pubmedQuery:
      'Wenzel JA[Author] AND ("Johns Hopkins"[Affiliation])',
  },
]
