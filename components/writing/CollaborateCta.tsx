export function CollaborateCta() {
  return (
    <aside
      aria-label="Collaborate"
      style={{
        marginTop: "3rem",
        padding: "1.75rem 2rem",
        borderRadius: "var(--r)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1.125rem",
          color: "var(--text)",
          marginBottom: "0.625rem",
        }}
      >
        Interested in collaborating?
      </h2>
      <p
        style={{
          fontSize: "0.9rem",
          color: "var(--text-2)",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.65,
          marginBottom: "1.25rem",
        }}
      >
        I&rsquo;m a doctoral student working on science communication and health
        literacy. If this piece touches on your own research interests, I&rsquo;d
        genuinely love to hear from you — whether that&rsquo;s a quick note, a
        shared question, or the start of something more.
      </p>
      <a
        href="/contact"
        className="btn-ghost"
        style={{ display: "inline-block" }}
      >
        Get in touch
      </a>
    </aside>
  )
}
