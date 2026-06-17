/**
 * Core Web Vitals sink. The client reporter (app/web-vitals.tsx) beacons metrics
 * here in production. Right now it just acknowledges + logs; swap the body to
 * forward into PostHog, a warehouse, or any analytics destination.
 */
export async function POST(request: Request) {
  try {
    const metric = await request.json();
    // TODO(observability): forward to PostHog / analytics instead of logging.
    // e.g. posthog.capture({ event: "$web_vitals", properties: metric })
    if (process.env.NODE_ENV !== "production") {
      console.log("[web-vitals:server]", metric);
    }
  } catch {
    // Ignore malformed beacons — never error a fire-and-forget metric.
  }

  // 204: nothing to return, keep the response tiny.
  return new Response(null, { status: 204 });
}
