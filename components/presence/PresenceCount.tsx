"use client"

import { useEffect, useState } from "react"

/**
 * Live "N here now" indicator with a pulsing dot.
 *
 * Sends a heartbeat for this tab every HEARTBEAT_MS and polls the head count
 * every POLL_MS. Renders nothing until the first real count arrives, and
 * nothing at all if presence isn't configured server-side (enabled: false).
 *
 * Reusable on any page — pass the route as `page`.
 */
const HEARTBEAT_MS = 10_000
const POLL_MS = 9_000

function makeId(): string {
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID()
    }
  } catch {
    // fall through
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function PresenceCount({
  page,
  label = "here now",
}: {
  page: string
  label?: string
}) {
  const [count, setCount] = useState<number | null>(null)
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    // One stable id per tab, so a reload doesn't double-count.
    let sessionId = ""
    try {
      sessionId = sessionStorage.getItem("presence-id") ?? ""
      if (!sessionId) {
        sessionId = makeId()
        sessionStorage.setItem("presence-id", sessionId)
      }
    } catch {
      sessionId = makeId()
    }

    let alive = true
    const query = `?page=${encodeURIComponent(page)}`

    function apply(data: unknown) {
      if (!alive || typeof data !== "object" || data === null) return
      const d = data as { count?: unknown; enabled?: unknown }
      if (d.enabled === false) {
        setDisabled(true)
        return
      }
      if (typeof d.count === "number") setCount(d.count)
    }

    async function beat() {
      try {
        const r = await fetch(`/api/presence${query}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
          keepalive: true,
        })
        apply(await r.json())
      } catch {
        // network blip — ignore, next tick retries
      }
    }

    async function poll() {
      try {
        const r = await fetch(`/api/presence${query}`, { cache: "no-store" })
        apply(await r.json())
      } catch {
        // ignore
      }
    }

    beat()
    const hb = setInterval(beat, HEARTBEAT_MS)
    const pl = setInterval(poll, POLL_MS)
    const onVisible = () => {
      if (document.visibilityState === "visible") beat()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      alive = false
      clearInterval(hb)
      clearInterval(pl)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [page])

  if (disabled || count === null || count < 1) return null

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        fontFamily: "var(--font-sans)",
        fontSize: "0.78rem",
        color: "var(--text-3)",
        letterSpacing: "0.02em",
      }}
    >
      <span className="pulse" aria-hidden />
      <span aria-live="polite">
        <strong style={{ color: "var(--text-2)", fontWeight: 600 }}>{count}</strong>{" "}
        {label}
      </span>
    </span>
  )
}
