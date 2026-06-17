"use client"

import { useState, useMemo } from "react"
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

export function GrantFilters({ grants }: GrantFiltersProps) {
  const [activeStages, setActiveStages] = useState<Set<CareerStage>>(new Set())
  const [activeTopic, setActiveTopic] = useState<string | null>(null)

  // Collect unique topics from all grants
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
      const topicMatch =
        !activeTopic || (g.topics ?? []).includes(activeTopic)
      return stageMatch && topicMatch
    })
  }, [grants, activeStages, activeTopic])

  function toggleStage(stage: CareerStage) {
    setActiveStages((prev) => {
      const next = new Set(prev)
      if (next.has(stage)) {
        next.delete(stage)
      } else {
        next.add(stage)
      }
      return next
    })
  }

  function toggleTopic(topic: string) {
    setActiveTopic((prev) => (prev === topic ? null : topic))
  }

  return (
    <div>
      {/* Filters */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          marginBottom: "2.5rem",
        }}
      >
        {/* Career stage chips */}
        <div>
          <p
            style={{
              fontSize: "0.75rem",
              fontFamily: "var(--font-sans)",
              color: "var(--text-3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 600,
              marginBottom: "0.5rem",
            }}
          >
            Career Stage
          </p>
          <div
            role="group"
            aria-label="Filter by career stage"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
          >
            {CAREER_STAGES.map(({ value, label }) => {
              const isActive = activeStages.has(value)
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => toggleStage(value)}
                  style={{
                    fontSize: "0.8125rem",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    padding: "0.375rem 0.875rem",
                    borderRadius: "999px",
                    border: "1px solid",
                    borderColor: isActive ? "var(--blue)" : "var(--border)",
                    background: isActive ? "var(--blue-dim)" : "transparent",
                    color: isActive ? "var(--blue-dk)" : "var(--text-2)",
                    cursor: "pointer",
                    transition:
                      "background var(--duration-fast), border-color var(--duration-fast), color var(--duration-fast)",
                  }}
                >
                  {label}
                </button>
              )
            })}
            {activeStages.size > 0 ? (
              <button
                type="button"
                onClick={() => setActiveStages(new Set())}
                style={{
                  fontSize: "0.8125rem",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 500,
                  padding: "0.375rem 0.875rem",
                  borderRadius: "999px",
                  border: "1px solid var(--border)",
                  background: "transparent",
                  color: "var(--text-3)",
                  cursor: "pointer",
                }}
                aria-label="Clear career stage filters"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        {/* Topic chips */}
        {allTopics.length > 0 ? (
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontFamily: "var(--font-sans)",
                color: "var(--text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Topic
            </p>
            <div
              role="group"
              aria-label="Filter by topic"
              style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
            >
              {allTopics.map((topic) => {
                const isActive = activeTopic === topic
                return (
                  <button
                    key={topic}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => toggleTopic(topic)}
                    style={{
                      fontSize: "0.8125rem",
                      fontFamily: "var(--font-sans)",
                      fontWeight: 500,
                      padding: "0.375rem 0.875rem",
                      borderRadius: "999px",
                      border: "1px solid",
                      borderColor: isActive ? "var(--gold)" : "var(--border)",
                      background: isActive
                        ? "rgba(201,168,76,0.12)"
                        : "transparent",
                      color: isActive ? "var(--gold-dk)" : "var(--text-2)",
                      cursor: "pointer",
                      transition:
                        "background var(--duration-fast), border-color var(--duration-fast), color var(--duration-fast)",
                    }}
                  >
                    {topic}
                  </button>
                )
              })}
              {activeTopic ? (
                <button
                  type="button"
                  onClick={() => setActiveTopic(null)}
                  style={{
                    fontSize: "0.8125rem",
                    fontFamily: "var(--font-sans)",
                    fontWeight: 500,
                    padding: "0.375rem 0.875rem",
                    borderRadius: "999px",
                    border: "1px solid var(--border)",
                    background: "transparent",
                    color: "var(--text-3)",
                    cursor: "pointer",
                  }}
                  aria-label="Clear topic filter"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* Results count */}
      {(activeStages.size > 0 || activeTopic) ? (
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-3)",
            fontFamily: "var(--font-sans)",
            marginBottom: "1.5rem",
          }}
          aria-live="polite"
        >
          {filtered.length === 0
            ? "No grants match these filters."
            : `${filtered.length} grant${filtered.length === 1 ? "" : "s"} found`}
        </p>
      ) : null}

      {/* Grant grid */}
      {filtered.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 22rem), 1fr))",
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
          <p style={{ fontSize: "1rem" }}>
            No grants match these filters. Try removing a filter.
          </p>
        </div>
      )}
    </div>
  )
}
