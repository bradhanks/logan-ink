import Link from "next/link"

type EssayListItem = {
  _id: string
  title: string
  slug: { current: string }
  kind: "essay" | "newsletter"
  publishedAt: string | null
  excerpt: string | null
  tags: string[] | null
}

function formatDate(iso: string | null): string {
  if (typeof iso !== "string" || !iso) return ""
  const [year, month, day] = iso.split("-")
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
  const m = parseInt(month, 10) - 1
  return `${months[m]} ${parseInt(day, 10)}, ${year}`
}

export function EssayCard({ essay }: { essay: EssayListItem }) {
  return (
    <Link
      href={`/writing/${essay.slug.current}`}
      className="glass"
      style={{
        display: "block",
        padding: "1.5rem 1.75rem",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
        <span className={`tag ${essay.kind === "newsletter" ? "tag-rose" : "tag-blue"}`}>
          {essay.kind}
        </span>
        {essay.publishedAt && (
          <time
            dateTime={essay.publishedAt}
            style={{ fontSize: "0.78rem", color: "var(--text-3)", fontFamily: "var(--font-sans)" }}
          >
            {formatDate(essay.publishedAt)}
          </time>
        )}
      </div>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 600,
          fontSize: "1.2rem",
          color: "var(--text)",
          lineHeight: 1.3,
          marginBottom: essay.excerpt ? "0.5rem" : 0,
        }}
      >
        {essay.title}
      </h2>
      {essay.excerpt && (
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-2)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.6,
            marginBottom: essay.tags && essay.tags.length > 0 ? "0.75rem" : 0,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {essay.excerpt}
        </p>
      )}
      {essay.tags && essay.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          {essay.tags.map((tag) => (
            <span key={tag} className="tag tag-teal">{tag}</span>
          ))}
        </div>
      )}
    </Link>
  )
}
