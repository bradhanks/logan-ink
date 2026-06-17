/**
 * Logan Hanks — useScrollProgress hook
 * hooks/useScrollProgress.ts
 *
 * Returns a 0–100 number representing scroll depth.
 * Wire it to the --scroll-pct CSS variable for the progress bar.
 *
 * Usage in a Client Component:
 *   const pct = useScrollProgress()
 *   <div className="scroll-progress" style={{ "--scroll-pct": `${pct}%` } as React.CSSProperties} />
 *
 * CSS dependency: requires `.scroll-progress` class and `--scroll-pct` CSS variable
 * usage defined in globals.css (provided by the foundation branch).
 */

"use client"

import { useEffect, useState } from "react"

export function useScrollProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const update = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      const total = scrollHeight - clientHeight
      setPct(total > 0 ? (scrollTop / total) * 100 : 0)
    }

    window.addEventListener("scroll", update, { passive: true })
    update()
    return () => window.removeEventListener("scroll", update)
  }, [])

  return pct
}
