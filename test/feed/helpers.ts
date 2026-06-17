import { vi } from 'vitest'

/** A fetch stub that returns JSON for any request. */
export function jsonFetch(payload: unknown): typeof fetch {
  return vi.fn(async () =>
    new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }),
  ) as unknown as typeof fetch
}

/** A fetch stub returning text (for RSS XML). */
export function textFetch(payload: string): typeof fetch {
  return vi.fn(async () =>
    new Response(payload, {
      status: 200,
      headers: { 'content-type': 'application/xml' },
    }),
  ) as unknown as typeof fetch
}

/**
 * A fetch stub that returns different JSON bodies based on the URL substring.
 * Used for PubMed (esearch then esummary).
 */
export function routedJsonFetch(
  routes: { match: string; payload: unknown }[],
): typeof fetch {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input)
    const route = routes.find((r) => url.includes(r.match))
    const body = route ? route.payload : {}
    return new Response(JSON.stringify(body), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })
  }) as unknown as typeof fetch
}

/** A fetch stub that throws — to exercise error robustness. */
export function throwingFetch(): typeof fetch {
  return vi.fn(async () => {
    throw new Error('network down')
  }) as unknown as typeof fetch
}

/** A fetch stub returning malformed (non-JSON) text where JSON is expected. */
export function malformedJsonFetch(): typeof fetch {
  return vi.fn(async () =>
    new Response('<<<not json>>>', {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }),
  ) as unknown as typeof fetch
}
