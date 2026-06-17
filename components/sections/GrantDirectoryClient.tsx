"use client"

import { useMemo, useState } from "react"

export interface Grant {
  _id: string
  org?: string
  mechanism?: string
  slug?: { current?: string }
  careerStage?: string
  topics?: string[]
  amount?: string
  deadline?: string
  tldr?: string
}

/**
 * Interactive grant table: filter chips (by topic) + expandable rows (TL;DR).
 * The interactions hint at function — narrowing the list and revealing detail
 * on demand — not decoration. Fully keyboard-accessible; the expand control is
 * a real <button> with aria-expanded.
 */
export function GrantDirectoryClient({ grants }: { grants: Grant[] }) {
  const [activeTopic, setActiveTopic] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const topics = useMemo(() => {
    const set = new Set<string>()
    for (const g of grants) for (const t of g.topics ?? []) set.add(t)
    return Array.from(set).sort()
  }, [grants])

  const filtered = useMemo(
    () =>
      activeTopic
        ? grants.filter((g) => (g.topics ?? []).includes(activeTopic))
        : grants,
    [grants, activeTopic],
  )

  return (
    <div>
      {topics.length > 0 ? (
        <div
          className="mb-6 flex flex-wrap gap-2"
          role="group"
          aria-label="Filter grants by topic"
        >
          <button
            type="button"
            className="tag"
            aria-pressed={activeTopic === null}
            onClick={() => setActiveTopic(null)}
            style={{
              background: activeTopic === null ? "var(--blue)" : "var(--surface)",
              color: activeTopic === null ? "#fff" : "var(--text-2)",
            }}
          >
            All
          </button>
          {topics.map((t) => {
            const on = activeTopic === t
            return (
              <button
                key={t}
                type="button"
                className="tag"
                aria-pressed={on}
                onClick={() => setActiveTopic(on ? null : t)}
                style={{
                  background: on ? "var(--blue)" : "var(--surface)",
                  color: on ? "#fff" : "var(--text-2)",
                }}
              >
                {t}
              </button>
            )
          })}
        </div>
      ) : null}

      <ul
        className="overflow-hidden rounded-[var(--r)] border"
        style={{ borderColor: "var(--border)" }}
      >
        {filtered.map((g) => {
          const open = openId === g._id
          const panelId = `grant-panel-${g._id}`
          return (
            <li
              key={g._id}
              className="border-b last:border-b-0"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : g._id)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              >
                <span className="min-w-0">
                  <span
                    className="block text-sm font-medium"
                    style={{ color: "var(--text)" }}
                  >
                    {g.org || "Funder"}
                    {g.mechanism ? (
                      <span style={{ color: "var(--text-3)" }}>
                        {" "}
                        · {g.mechanism}
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-0.5 flex flex-wrap gap-3 text-xs" style={{ color: "var(--text-3)" }}>
                    {g.amount ? <span>{g.amount}</span> : null}
                    {g.deadline ? <span>Due {g.deadline}</span> : null}
                    {g.careerStage ? <span>{g.careerStage}</span> : null}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="shrink-0 transition-transform"
                  style={{
                    color: "var(--blue)",
                    transform: open ? "rotate(90deg)" : "none",
                  }}
                >
                  →
                </span>
              </button>
              {open ? (
                <div
                  id={panelId}
                  className="px-5 pb-4 text-sm"
                  style={{ color: "var(--text-2)" }}
                >
                  {g.tldr || "Details coming soon."}
                  {g.slug?.current ? (
                    <a
                      href={`/grants/${g.slug.current}`}
                      className="ml-2"
                      style={{ color: "var(--blue)" }}
                    >
                      Full breakdown →
                    </a>
                  ) : null}
                </div>
              ) : null}
            </li>
          )
        })}
      </ul>

      {filtered.length === 0 ? (
        <p className="mt-4 text-sm" style={{ color: "var(--text-3)" }}>
          No grants match this filter.
        </p>
      ) : null}
    </div>
  )
}
