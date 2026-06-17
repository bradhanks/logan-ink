import Link from "next/link"

export interface GrantCardData {
  _id: string
  org: string
  mechanism: string
  slug: { current: string }
  careerStage?: string[]
  topics?: string[]
  amount?: number
  deadline?: string
  deadlineConfirmed?: boolean
  cycleYear?: number
  tldr?: string
}

const STAGE_LABELS: Record<string, string> = {
  undergrad: "Undergrad",
  postbacc: "Post-Bacc",
  predoctoral: "Predoctoral",
  faculty: "Faculty",
}

function formatAmount(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function GrantCard({ grant }: { grant: GrantCardData }) {
  const slug = grant.slug?.current
  const hasDeadline = grant.deadline || grant.cycleYear

  return (
    <article
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r)",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        transition: "border-color var(--duration-fast)",
      }}
      className="grant-card"
    >
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <p
          style={{
            fontSize: "0.75rem",
            fontFamily: "var(--font-sans)",
            color: "var(--text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontWeight: 600,
          }}
        >
          {grant.org}
        </p>
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.125rem",
            color: "var(--text)",
            lineHeight: 1.25,
            margin: 0,
          }}
        >
          {slug ? (
            <Link
              href={`/grants/${slug}`}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
              className="grant-card-link"
            >
              {grant.mechanism}
            </Link>
          ) : (
            grant.mechanism
          )}
        </h3>
      </div>

      {/* TL;DR */}
      {grant.tldr ? (
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-2)",
            lineHeight: 1.55,
            margin: 0,
          }}
        >
          {grant.tldr}
        </p>
      ) : null}

      {/* Career stage badges */}
      {grant.careerStage && grant.careerStage.length > 0 ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {grant.careerStage.map((stage) => (
            <span
              key={stage}
              style={{
                fontSize: "0.7rem",
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--blue-dk)",
                background: "var(--blue-dim)",
                borderRadius: "999px",
                padding: "0.2rem 0.6rem",
              }}
            >
              {STAGE_LABELS[stage] ?? stage}
            </span>
          ))}
        </div>
      ) : null}

      {/* Meta row */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          marginTop: "auto",
          paddingTop: "0.25rem",
          borderTop: "1px solid var(--border)",
        }}
      >
        {grant.amount ? (
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-2)",
              fontFamily: "var(--font-sans)",
            }}
          >
            <span style={{ color: "var(--text-3)", marginRight: "0.25rem" }}>
              Amount
            </span>
            {formatAmount(grant.amount)}
          </span>
        ) : null}

        {hasDeadline ? (
          <span
            style={{
              fontSize: "0.8125rem",
              color: "var(--text-2)",
              fontFamily: "var(--font-sans)",
            }}
          >
            <span style={{ color: "var(--text-3)", marginRight: "0.25rem" }}>
              Deadline
            </span>
            {grant.deadline
              ? `${grant.deadline} `
              : null}
            {grant.cycleYear ? `(${grant.cycleYear})` : null}
            {grant.deadline ? (
              <span
                style={{
                  fontSize: "0.7rem",
                  marginLeft: "0.35rem",
                  color: grant.deadlineConfirmed ? "var(--teal-dk)" : "var(--gold-dk)",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {grant.deadlineConfirmed ? "confirmed" : "estimated"}
              </span>
            ) : null}
          </span>
        ) : null}
      </div>
    </article>
  )
}
