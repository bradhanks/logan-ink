"use client"

import { useScrollProgress } from "@/hooks/useScrollProgress"

/**
 * Top scroll-progress bar.
 * Uses the `.scroll-progress` CSS utility from globals.css and the
 * `useScrollProgress` hook (0–100). Hidden when reduced-motion is preferred
 * by setting width to 0 — the bar is purely decorative.
 */
export function ScrollProgress() {
  const pct = useScrollProgress()

  return (
    <div
      role="none"
      aria-hidden="true"
      className="scroll-progress"
      style={{ "--scroll-pct": `${pct}%` } as React.CSSProperties}
    />
  )
}
