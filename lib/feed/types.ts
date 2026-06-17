/**
 * A normalized item in the "Field Feed" — the shape every source client
 * (PubMed, NIH RePORTER, ORCID, RSS, Bluesky) maps its raw response into.
 */
export type FeedItem = {
  /** Short identifier for the originating source, e.g. "pubmed", "reporter". */
  source: string
  /** Human-readable title / headline of the item. */
  title: string
  /** Canonical URL the item links to. */
  url: string
  /** ISO-8601 date string (YYYY-MM-DD or full timestamp). */
  date: string
  /** Optional short abstract / description. */
  summary?: string
  /** Optional list of author / contributor display names. */
  authors?: string[]
}

/**
 * Optional dependency bag injected into every fetchX() so tests can stub the
 * network. `fetchImpl` defaults to the global `fetch` in each client.
 */
export type FeedDeps = {
  fetchImpl?: typeof fetch
}
