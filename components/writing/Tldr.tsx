export function Tldr({ text }: { text: string }) {
  return (
    <aside
      aria-label="TL;DR"
      style={{
        marginBottom: "2rem",
        padding: "1.125rem 1.5rem",
        borderRadius: "var(--r)",
        background: "var(--blue-dim, rgba(109, 182, 216, 0.13))",
        borderLeft: "3px solid var(--blue)",
      }}
    >
      <p
        style={{
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--blue)",
          marginBottom: "0.375rem",
          fontFamily: "var(--font-sans)",
        }}
      >
        TL;DR
      </p>
      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--text-2)",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        {text}
      </p>
    </aside>
  )
}
