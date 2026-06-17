import type { CredentialStripSection } from "./types"

/**
 * CredentialStrip — a quiet horizontal timeline of milestones. No autoscroll
 * gimmick: a calm, scannable, scroll-on-overflow row of dated entries.
 * Server Component.
 */
export function CredentialStrip({
  section,
}: {
  section: CredentialStripSection
}) {
  const items = (section.items ?? []).filter(Boolean)

  return (
    <section
      data-section="credentialStrip"
      className="border-y py-6"
      style={{ borderColor: "var(--border)" }}
      aria-label="Timeline of milestones"
    >
      <div className="container">
        {items.length > 0 ? (
          <ol
            className="flex gap-8 overflow-x-auto pb-1"
            style={{ scrollbarWidth: "thin" }}
          >
            {items.map((item, i) => (
              <li
                key={`${item}-${i}`}
                className="flex shrink-0 items-center gap-3"
              >
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ background: "var(--blue)" }}
                />
                <span
                  className="whitespace-nowrap text-sm"
                  style={{ color: "var(--text-2)" }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-sm" style={{ color: "var(--text-3)" }}>
            Milestones coming soon.
          </p>
        )}
      </div>
    </section>
  )
}
