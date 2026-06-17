"use client"

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      aria-label="Download CV as PDF"
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "var(--bg)",
        background: "var(--text)",
        border: "none",
        borderRadius: "var(--r)",
        padding: "0.5rem 1.125rem",
        cursor: "pointer",
        transition: "opacity var(--duration-fast)",
      }}
    >
      Download PDF
    </button>
  )
}
