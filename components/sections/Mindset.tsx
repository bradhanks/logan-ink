import Link from "next/link"
import { PortableBody } from "./RichText"
import type { MindsetSection } from "./types"

/**
 * Mindset — engineering-philosophy statement + a 2x2 grid of capability cards.
 * The cards hint at function (each links to relevant work) rather than being
 * decorative. Server Component.
 */

interface Capability {
  title: string
  body: string
  href?: string
}

const CAPABILITIES: Capability[] = [
  {
    title: "Analysis",
    body: "Odds ratios, DAGs, logistic regression, R, Python.",
    href: "/research",
  },
  {
    title: "Field",
    body: "CBPR, community surveys, rural outreach. Also a 5k.",
  },
  {
    title: "Build",
    body: "Next.js, Python, R — tools chosen for the problem.",
  },
  {
    title: "Also",
    body: "5th-grade Mancala champion, Willowcreek Middle School.",
    href: "/mancala",
  },
]

export function Mindset({ section }: { section: MindsetSection }) {
  const heading = section.heading?.trim() || "Minimize human suffering. At scale."

  return (
    <section data-section="mindsetSection" className="py-20">
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="eyebrow mb-4">Engineering mindset</p>
            <h2
              className="max-w-md"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 4vw, 2.875rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: "var(--text)",
                lineHeight: 1.05,
              }}
            >
              {heading}
            </h2>
            <div className="mt-6 max-w-md text-base">
              {section.body && section.body.length > 0 ? (
                <PortableBody value={section.body} />
              ) : (
                <p className="leading-relaxed" style={{ color: "var(--text-2)" }}>
                  I approach population health as an engineering problem. Map the
                  system, find the leverage points, intervene at the right place.
                  The tools change — the goal doesn&apos;t.
                </p>
              )}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((cap) => {
              const inner = (
                <>
                  <h3
                    className="mb-1.5 text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {cap.title}
                    {cap.href ? (
                      <span style={{ color: "var(--blue)" }}> →</span>
                    ) : null}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--text-2)" }}>
                    {cap.body}
                  </p>
                </>
              )
              return cap.href ? (
                <Link
                  key={cap.title}
                  href={cap.href}
                  className="glass block p-5"
                >
                  {inner}
                </Link>
              ) : (
                <div key={cap.title} className="glass p-5">
                  {inner}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
