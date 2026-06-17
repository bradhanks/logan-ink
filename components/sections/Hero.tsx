import Link from "next/link"
import { TransFlag } from "@/components/brand/TransFlag"
import { PortableBody } from "./RichText"
import type { HeroSection } from "./types"

/**
 * Hero — name + tagline + restrained portrait ring + CTAs.
 *
 * Interaction restraint: NO follower cursor, NO gimmicky portrait hover
 * transform. The portrait sits inside a calm gradient ring; the trans-flag is a
 * sparing accent, never a banner. Server Component (no client interactivity).
 */
export function Hero({ section }: { section: HeroSection }) {
  const headline = section.headline?.trim() || "Logan Hanks"
  const subheadline =
    section.subheadline?.trim() ||
    "Some questions can't wait for graduate school."
  const cta = section.cta

  return (
    <section
      data-section="heroSection"
      className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32"
    >
      {/* Ambient orbs — decorative, behind content */}
      <div
        aria-hidden
        className="orb orb-blue"
        style={{ width: 520, height: 520, top: -160, left: -120 }}
      />
      <div
        aria-hidden
        className="orb orb-rose"
        style={{ width: 420, height: 420, top: 40, right: -120 }}
      />

      <div className="container relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="eyebrow mb-4">
              Population Scientist · Kepka Group · HCI · He/Him
            </p>

            <h1
              className="leading-[0.95]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 9vw, 7rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "var(--text)",
              }}
            >
              {headline}
            </h1>

            <TransFlag width={96} height={5} className="mt-6" shimmer />

            <p
              className="mt-6 max-w-xl text-xl sm:text-2xl"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--text-2)",
                fontStyle: "italic",
              }}
            >
              {subheadline}
            </p>

            {section.body && section.body.length > 0 ? (
              <div className="mt-5 max-w-xl text-base">
                <PortableBody value={section.body} />
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {cta?.href ? (
                <Link href={cta.href} className="btn-primary">
                  {cta.label || "Get in touch"}
                </Link>
              ) : (
                <Link href="/research" className="btn-primary">
                  Research
                </Link>
              )}
              <Link href="/grants" className="btn-ghost">
                Grant directory →
              </Link>
              <Link href="/about" className="btn-ghost">
                Say hi →
              </Link>
            </div>
          </div>

          {/* Calm portrait inside a restrained gradient ring */}
          <div className="flex justify-center lg:justify-end">
            <div
              className="relative aspect-square w-56 sm:w-64 lg:w-72"
              style={{
                borderRadius: "var(--r)",
                padding: 3,
                background:
                  "linear-gradient(145deg, var(--blue-glow), rgba(212,142,168,0.3), rgba(74,173,160,0.25))",
              }}
            >
              <div
                className="flex h-full w-full items-center justify-center overflow-hidden"
                style={{
                  borderRadius: "calc(var(--r) - 3px)",
                  background: "var(--surface-2)",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontFamily: "var(--font-display)",
                    fontStyle: "italic",
                    fontWeight: 900,
                    fontSize: "3rem",
                    color: "var(--text-3)",
                  }}
                >
                  LH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
