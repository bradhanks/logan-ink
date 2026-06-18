import { Redis } from "@upstash/redis"

/**
 * Live presence tracking, backed by Upstash Redis (a sorted set per page).
 *
 * Each visitor's tab sends a heartbeat every ~10s; the member's score is the
 * heartbeat timestamp. A visitor counts as "present" if their last heartbeat
 * is within WINDOW_MS. Stale members are trimmed on every read/write, and the
 * whole key self-expires once a page goes quiet — so there's nothing to clean
 * up out of band.
 *
 * If the Upstash env vars aren't wired yet (e.g. before the Marketplace
 * integration is installed), everything degrades to a no-op returning 0 and
 * `enabled: false`, and the UI simply hides itself.
 */
const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

export const presenceEnabled = Boolean(url && token)

const redis = presenceEnabled ? new Redis({ url: url!, token: token! }) : null

const WINDOW_MS = 20_000 // present if seen within the last 20s
const KEY_TTL_S = 120 // drop an idle page's set after 2 minutes

function keyFor(page: string) {
  return `presence:${page}`
}

export async function heartbeat(
  page: string,
  sessionId: string,
): Promise<number> {
  if (!redis) return 0
  const now = Date.now()
  const key = keyFor(page)
  const res = await redis
    .pipeline()
    .zadd(key, { score: now, member: sessionId })
    .zremrangebyscore(key, 0, now - WINDOW_MS)
    .expire(key, KEY_TTL_S)
    .zcard(key)
    .exec()
  // zcard is the 4th command in the pipeline
  return Number(res[3] ?? 0)
}

export async function countPresent(page: string): Promise<number> {
  if (!redis) return 0
  const now = Date.now()
  const key = keyFor(page)
  const res = await redis
    .pipeline()
    .zremrangebyscore(key, 0, now - WINDOW_MS)
    .zcard(key)
    .exec()
  return Number(res[1] ?? 0)
}
