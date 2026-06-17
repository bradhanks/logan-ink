import type { MissionStatementSection } from "./types"

/**
 * MissionStatement — a single, weighty paragraph. Author-reserved copy.
 * Server Component.
 */
export function MissionStatement({
  section,
}: {
  section: MissionStatementSection
}) {
  const statement = section.statement?.trim()

  return (
    <section data-section="missionStatement" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-6">Mission statement</p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)",
              fontWeight: 600,
              lineHeight: 1.25,
              letterSpacing: "-0.01em",
              color: statement ? "var(--text)" : "var(--text-3)",
            }}
          >
            {statement ||
              "Start with the problem that keeps you up at night. Then the method. Then the scale of what becomes possible if you solve it."}
          </p>
        </div>
      </div>
    </section>
  )
}
