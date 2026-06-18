import { NextResponse, type NextRequest } from "next/server"
import { heartbeat, countPresent, presenceEnabled } from "@/lib/presence"

/**
 * Presence API.
 *   POST /api/presence?page=/mancala   body { sessionId }  → record a heartbeat
 *   GET  /api/presence?page=/mancala                       → current head count
 *
 * Reading the request's search params makes both handlers dynamic, so nothing
 * is statically cached. Responses are explicitly no-store as well.
 */

const noStore = { "Cache-Control": "no-store, max-age=0" }

/** Restrict the page key to a safe charset so it can't be used to write
 *  arbitrary Redis keys, and cap its length. */
function sanitizePage(raw: string | null): string {
  if (!raw) return "/"
  const p = raw.slice(0, 64)
  return /^[a-zA-Z0-9/_-]+$/.test(p) ? p : "/"
}

export async function GET(req: NextRequest) {
  const page = sanitizePage(req.nextUrl.searchParams.get("page"))
  const count = await countPresent(page)
  return NextResponse.json(
    { count, enabled: presenceEnabled },
    { headers: noStore },
  )
}

export async function POST(req: NextRequest) {
  const page = sanitizePage(req.nextUrl.searchParams.get("page"))
  let sessionId = ""
  try {
    const body = (await req.json()) as { sessionId?: unknown }
    if (typeof body?.sessionId === "string") sessionId = body.sessionId.slice(0, 64)
  } catch {
    // empty / invalid body → handled below
  }
  if (!sessionId) {
    return NextResponse.json(
      { count: 0, enabled: presenceEnabled },
      { status: 400, headers: noStore },
    )
  }
  const count = await heartbeat(page, sessionId)
  return NextResponse.json({ count, enabled: presenceEnabled }, { headers: noStore })
}
