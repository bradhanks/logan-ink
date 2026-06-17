"use client";

import { useReportWebVitals } from "next/web-vitals";

/**
 * Core Web Vitals reporter. Mounted once in the root layout; renders nothing.
 *
 * In development it logs metrics to the console so regressions are visible
 * while building. In production it POSTs (via the keepalive Beacon API) to
 * /api/vitals — wire that route to PostHog/your analytics sink, or swap the
 * body for a direct `window.posthog?.capture("$web_vitals", metric)` call.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[web-vitals] ${metric.name}`, Math.round(metric.value), metric.rating);
      return;
    }

    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      navigationType: metric.navigationType,
      path: window.location.pathname,
    });

    // Best-effort, non-blocking. Falls back to fetch+keepalive if no Beacon.
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/vitals", body);
    } else {
      fetch("/api/vitals", { body, method: "POST", keepalive: true });
    }
  });

  return null;
}
