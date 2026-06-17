import Link from "next/link"
import type { CtaSection } from "./types"

/**
 * Cta — the closing call to action. Server Component.
 */
export function Cta({ section }: { section: CtaSection }) {
  const heading = section.heading?.trim() || "Let's work."
  const body =
    section.body?.trim() ||
    "For research collaboration, grant strategy, or a conversation about rural health and population science — reach out."

  return (
    <section data-section="cta" className="py-24">
      <div className="container">
        <div className="glass mx-auto max-w-2xl p-10 text-center">
          <h2
            className="mb-3"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 2.875rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            {heading}
          </h2>
          <p
            className="mx-auto mb-7 max-w-md"
            style={{ color: "var(--text-2)" }}
          >
            {body}
          </p>
          {section.href ? (
            <Link href={section.href} className="btn-primary">
              {section.label || "Get in touch"}
            </Link>
          ) : (
            <Link href="/about" className="btn-primary">
              {section.label || "Say hi →"}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}
