import type { FeedItem, FeedDeps } from './types'
import type { TrackedResearcher } from './tracked'

/**
 * RSS / Atom client. Parses feed XML server-side without a third-party
 * dependency using a small, tolerant regex-based extractor — sufficient for
 * the well-formed `<item>` / `<entry>` shapes RePORTER-adjacent and lab blogs
 * emit. Malformed / empty input yields `[]` (never throws).
 *
 * A researcher may declare RSS feeds via an optional `rssFeeds` field; for
 * forward-compat the function also accepts feed URLs derived from each
 * researcher's configured sources. Researchers without feeds contribute
 * nothing.
 */

type ResearcherWithFeeds = TrackedResearcher & { rssFeeds?: string[] }

const TAG_BLOCK = (tag: string) =>
  new RegExp(`<${tag}[\\s>][\\s\\S]*?<\\/${tag}>|<${tag}\\/>`, 'gi')

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
    .trim()
}

/** Extract the text content of the first <tag>…</tag> in a block. */
function tagText(block: string, tag: string): string | undefined {
  const m = block.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'),
  )
  if (!m) return undefined
  return decodeEntities(m[1])
}

/** Atom <link href="…"/> or RSS <link>…</link>. */
function extractLink(block: string): string | undefined {
  const href = block.match(/<link[^>]*\bhref=["']([^"']+)["'][^>]*\/?>/i)
  if (href) return decodeEntities(href[1])
  return tagText(block, 'link')
}

function parseItem(block: string, sourceLabel: string): FeedItem | null {
  const title = tagText(block, 'title')
  const url = extractLink(block)
  if (!title || !url) return null
  const rawDate =
    tagText(block, 'pubDate') ??
    tagText(block, 'published') ??
    tagText(block, 'updated') ??
    tagText(block, 'dc:date') ??
    ''
  let date = rawDate
  const parsed = rawDate ? new Date(rawDate) : null
  if (parsed && !Number.isNaN(parsed.getTime())) {
    date = parsed.toISOString().split('T')[0]
  }
  const summary =
    tagText(block, 'description') ??
    tagText(block, 'summary') ??
    tagText(block, 'content')
  return {
    source: sourceLabel,
    title,
    url,
    date,
    ...(summary ? { summary } : {}),
  }
}

export function parseRssXml(xml: string, sourceLabel = 'rss'): FeedItem[] {
  if (typeof xml !== 'string' || xml.trim() === '') return []
  const items: FeedItem[] = []
  for (const tag of ['item', 'entry']) {
    const matches = xml.match(TAG_BLOCK(tag))
    if (!matches) continue
    for (const block of matches) {
      const item = parseItem(block, sourceLabel)
      if (item) items.push(item)
    }
  }
  return items
}

async function fetchFeed(
  url: string,
  fetchImpl: typeof fetch,
): Promise<FeedItem[]> {
  try {
    const res = await fetchImpl(url)
    const xml = await res.text()
    return parseRssXml(xml)
  } catch {
    return []
  }
}

export async function fetchRss(
  researchers: ResearcherWithFeeds[],
  deps?: FeedDeps,
): Promise<FeedItem[]> {
  const fetchImpl = deps?.fetchImpl ?? fetch
  if (!Array.isArray(researchers) || researchers.length === 0) return []
  const urls = researchers.flatMap((r) =>
    Array.isArray(r.rssFeeds) ? r.rssFeeds : [],
  )
  if (urls.length === 0) return []
  const all = await Promise.all(urls.map((u) => fetchFeed(u, fetchImpl)))
  return all.flat()
}
