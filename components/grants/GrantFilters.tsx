"use client"

import { useState, useMemo, type ReactNode } from "react"
import { GrantCard, type GrantCardData } from "./GrantCard"

const CAREER_STAGES = [
  { value: "undergrad", label: "Undergrad" },
  { value: "postbacc", label: "Post-Bacc" },
  { value: "predoctoral", label: "Predoctoral" },
  { value: "faculty", label: "Faculty" },
] as const

type CareerStage = (typeof CAREER_STAGES)[number]["value"]

interface GrantFiltersProps {
  grants: GrantCardData[]
}

/** A toggle chip that clearly reads as a control: surface fill when off, an
 *  accent fill + check when on, and a leading +/✓ so the affordance is obvious. */
function Chip({
  active,
  onClick,
  accent,
  accentBg,
  accentText,
  ariaLabel,
  children,
}: {
  active: boolean
  onClick: () => void
  accent: string
  accentBg: string
  accentText: string
  ariaLabel?: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={ariaLabel}
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.4rem",
        fontSize: "0.8125rem",
        fontFamily: "var(--font-sans)",
        fontWeight: 500,
        padding: "0.4rem 0.8rem",
        borderRadius: "0.55rem",
        border: "1px solid",
        borderColor: active ? accent : "var(--border-2)",
        background: active ? accentBg : "var(--surface)",
        color: active ? accentText : "var(--text-2)",
        cursor: "pointer",
        transition:
          "background var(--duration-fast), border-color var(--duration-fast), color var(--duration-fast)",
      }}
    >
      <span
        aria-hidden
        style={{
          fontWeight: 700,
          fontSize: "0.75rem",
          width: "0.7rem",
          textAlign: "center",
          color: active ? accentText : "var(--text-3)",
        }}
      >
        {active ? "✓" : "+"}
      </span>
      {children}
    </button>
  )
}

const GROUP_LABEL: React.CSSProperties = {
  fontSize: "0.7rem",
  fontFamily: "var(--font-sans)",
  color: "var(--text-3)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontWeight: 600,
  marginBottom: "0.5rem",
}

export function GrantFilters({ grants }: GrantFiltersProps) {
  const [activeStages, setActiveStages] = useState<Set<CareerStage>>(new Set())
  const [activeTopic, setActiveTopic] = useState<string | null>(null)

  const allTopics = useMemo(() => {
    const seen = new Set<string>()
    grants.forEach((g) => g.topics?.forEach((t) => seen.add(t)))
    return Array.from(seen).sort()
  }, [grants])

  const filtered = useMemo(() => {
    return grants.filter((g) => {
      const stageMatch =
        activeStages.size === 0 ||
        (g.careerStage ?? []).some((s) => activeStages.has(s as CareerStage))
      const topicMatch = !activeTopic || (g.topics ?? []).includes(activeTopic)
      return stageMatch && topicMatch
    })
  }, [grants, activeStages, activeTopic])

  const hasActive = activeStages.size > 0 || activeTopic !== null

  function toggleStage(stage: CareerStage) {
    setActiveStages((prev) => {
      const next = new Set(prev)
      if (next.has(stage)) next.delete(stage)
      else next.add(stage)
      return next
    })
  }

  function toggleTopic(topic: string) {
    setActiveTopic((prev) => (prev === topic ? null : topic))
  }

  function resetAll() {
    setActiveStages(new Set())
    setActiveTopic(null)
  }

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          padding: "1.1rem 1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem 1rem",
            marginBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--text-2)",
              margin: 0,
            }}
          >
            Filter opportunities
          </h2>
          <p
            aria-live="polite"
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.85rem",
              color: "var(--text-2)",
              margin: 0,
              display: "inline-flex",
              alignItems: "center",
              gap: "0.75rem",
            }}
          >
            <span>
              Showing{" "}
              <strong style={{ color: "var(--text)" }}>{filtered.length}</strong>{" "}
              of {grants.length}
            </span>
            {hasActive ? (
              <button
                type="button"
                onClick={resetAll}
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--blue)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: "2px",
                }}
              >
                Reset
              </button>
            ) : null}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          {/* Career stage */}
          <div>
            <p style={GROUP_LABEL}>Who can apply</p>
            <div
              role="group"
              aria-label="Filter by career stage"
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
            >
              {CAREER_STAGES.map(({ value, label }) => (
                <Chip
                  key={value}
                  active={activeStages.has(value)}
                  onClick={() => toggleStage(value)}
                  accent="var(--blue)"
                  accentBg="var(--blue-dim)"
                  accentText="var(--blue-dk)"
                >
                  {label}
                </Chip>
              ))}
            </div>
          </div>

          {/* Topic */}
          {allTopics.length > 0 ? (
            <div>
              <p style={GROUP_LABEL}>Topic</p>
              <div
                role="group"
                aria-label="Filter by topic"
                style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
              >
                {allTopics.map((topic) => (
                  <Chip
                    key={topic}
                    active={activeTopic === topic}
                    onClick={() => toggleTopic(topic)}
                    accent="var(--gold)"
                    accentBg="rgba(201,168,76,0.14)"
                    accentText="var(--gold-dk)"
                  >
                    {topic}
                  </Chip>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* Grant grid */}
      {filtered.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 22rem), 1fr))",
            gap: "1.25rem",
          }}
        >
          {filtered.map((grant) => (
            <li key={grant._id}>
              <GrantCard grant={grant} />
            </li>
          ))}
        </ul>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "3rem 1.5rem",
            color: "var(--text-3)",
            fontFamily: "var(--font-sans)",
          }}
          aria-live="polite"
        >
          <p style={{ fontSize: "1rem", marginBottom: "0.75rem" }}>
            No grants match these filters.
          </p>
          <button
            type="button"
            onClick={resetAll}
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--blue)",
              background: "none",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: "2px",
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  )
}
