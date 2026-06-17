"use client"

import { useEffect, useState } from "react"
import type { Theme } from "@/lib/theme"
import { resolveTheme } from "@/lib/theme"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light")

  // Read the theme that was set synchronously by the inline script
  useEffect(() => {
    const current = document.documentElement.dataset.theme as Theme | undefined
    setTheme(current === "dark" ? "dark" : "light")
  }, [])

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark"
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem("theme", next)
    } catch (_) {
      // Private browsing or storage blocked — no-op
    }
    setTheme(next)
  }

  const isDark = theme === "dark"

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-pressed={isDark}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "2rem",
        height: "2rem",
        borderRadius: "0.375rem",
        color: "var(--text-2)",
        border: "1px solid var(--border)",
        background: "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "color 0.2s, border-color 0.2s, background 0.2s",
      }}
    >
      {/* Sun / moon — simple SVG, no external dependency */}
      {isDark ? (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  )
}
