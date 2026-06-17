/**
 * Logan Hanks — useReveal hook
 * hooks/useReveal.ts
 *
 * Attach to any element to get a scroll-triggered fade-in + slide-up.
 * Mirrors the .reveal / .visible CSS pattern in globals.css.
 *
 * Usage:
 *   const ref = useReveal()
 *   <section ref={ref} className="reveal">…</section>
 *
 * Or with a delay (0–3, maps to .delay-1 … .delay-4):
 *   const ref = useReveal({ delay: 1 })
 *
 * CSS dependency: requires `.reveal`, `.visible`, and `.delay-N` classes
 * defined in globals.css (provided by the foundation branch).
 */

"use client"

import { useEffect, useRef } from "react"

type UseRevealOptions = {
  /** Delay index 0–4; adds .delay-N class from globals.css */
  delay?:     0 | 1 | 2 | 3 | 4
  threshold?: number
  rootMargin?: string
}

export function useReveal<T extends HTMLElement = HTMLDivElement>({
  delay      = 0,
  threshold  = 0.12,
  rootMargin = "0px 0px -40px 0px",
}: UseRevealOptions = {}) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (delay > 0) el.classList.add(`delay-${delay}`)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible")
          observer.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay, threshold, rootMargin])

  return ref
}
