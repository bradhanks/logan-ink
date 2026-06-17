import type { FeedItem, FeedDeps } from './types'
import type { TrackedResearcher } from './tracked'

/**
 * Bluesky public AppView client — recent posts from a researcher's account.
 *
 * Uses the unauthenticated `app.bsky.feed.getAuthorFeed` XRPC endpoint keyed by
 * the researcher's handle (the `actor`). Because the feed is keyed by handle,
 * every post is confidently attributable; we drop only reposts of others.
 */

const GET_AUTHOR_FEED =
  'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed'

type BskyAuthor = { handle?: string; displayName?: string }
type BskyRecord = { text?: string; createdAt?: string }
type BskyPost = {
  uri?: string
  author?: BskyAuthor
  record?: BskyRecord
}
type BskyFeedEntry = {
  post?: BskyPost
  reason?: { $type?: string }
}
type BskyFeedResponse = { feed?: BskyFeedEntry[] }

/** Convert an at:// URI to an https bsky.app post permalink. */
function postUrl(uri: string | undefined, handle: string | undefined): string | undefined {
  if (!uri) return undefined
  // at://did:plc:xxx/app.bsky.feed.post/<rkey>
  const m = uri.match(/\/app\.bsky\.feed\.post\/([^/]+)$/)
  if (!m) return undefined
  const rkey = m[1]
  const actor = handle ?? uri.split('/')[2]
  return `https://bsky.app/profile/${actor}/post/${rkey}`
}

function toFeedItem(entry: BskyFeedEntry): FeedItem | null {
  // Skip reposts — not authored by the tracked researcher.
  if (entry.reason?.$type === 'app.bsky.feed.defs#reasonRepost') return null
  const post = entry.post
  if (!post) return null
  const text = post.record?.text
  if (!text) return null
  const handle = post.author?.handle
  const url = postUrl(post.uri, handle)
  if (!url) return null
  const createdAt = post.record?.createdAt ?? ''
  let date = createdAt
  const parsed = createdAt ? new Date(createdAt) : null
  if (parsed && !Number.isNaN(parsed.getTime())) {
    date = parsed.toISOString().split('T')[0]
  }
  const title = text.length > 120 ? `${text.slice(0, 117)}...` : text
  return {
    source: 'bluesky',
    title,
    url,
    date,
    summary: text,
    authors: [post.author?.displayName ?? handle ?? ''].filter(Boolean),
  }
}

async function fetchForResearcher(
  r: TrackedResearcher,
  fetchImpl: typeof fetch,
): Promise<FeedItem[]> {
  if (!r.blueskyHandle) return []
  const url = new URL(GET_AUTHOR_FEED)
  url.searchParams.set('actor', r.blueskyHandle)
  url.searchParams.set('limit', '20')

  let data: BskyFeedResponse | undefined
  try {
    const res = await fetchImpl(url.toString())
    data = await res.json()
  } catch {
    return []
  }

  const feed = data?.feed
  if (!Array.isArray(feed)) return []

  const items: FeedItem[] = []
  for (const entry of feed) {
    const item = toFeedItem(entry)
    if (item) items.push(item)
  }
  return items
}

export async function fetchBluesky(
  researchers: TrackedResearcher[],
  deps?: FeedDeps,
): Promise<FeedItem[]> {
  const fetchImpl = deps?.fetchImpl ?? fetch
  if (!Array.isArray(researchers) || researchers.length === 0) return []
  const all = await Promise.all(
    researchers.map((r) => fetchForResearcher(r, fetchImpl)),
  )
  return all.flat()
}
