import Link from "next/link"
import Image from "next/image"
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
        <div className="flex flex-col gap-8 lg:grid lg:grid-cols-[1.4fr_1fr] lg:items-center lg:gap-x-12 lg:gap-y-2">
          {/* TOP — eyebrow, name, trans flag */}
          <div className="order-1 text-center lg:col-start-1 lg:row-start-1 lg:self-end lg:text-left">
            <p className="eyebrow mb-4">
              Population Scientist · Kepka Group · HCI · He/Him
            </p>
            <h1
              className="leading-[0.95]"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.75rem, 9vw, 7rem)",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                color: "var(--text)",
              }}
            >
              {headline}
            </h1>
            <TransFlag width={96} height={5} className="mt-6 mx-auto lg:mx-0" shimmer />
          </div>

          {/* PHOTO — phone: between flag and subheadline (order-2). tablet:
              after the text (sm:order-3). desktop: right column, centered. */}
          <div className="order-2 flex justify-center sm:order-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:row-span-2 lg:justify-end lg:self-center">
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
                className="relative h-full w-full overflow-hidden"
                style={{
                  borderRadius: "calc(var(--r) - 3px)",
                  background: "var(--surface-2)",
                }}
              >
                <Image
                  src="/logan.png"
                  alt="Logan Hanks"
                  fill
                  priority
                  sizes="(max-width: 1024px) 16rem, 18rem"
                  style={{ objectFit: "cover", objectPosition: "50% 22%" }}
                />
              </div>
            </div>
          </div>

          {/* BOTTOM — subheadline, body, CTAs */}
          <div className="order-3 text-center sm:order-2 lg:col-start-1 lg:row-start-2 lg:self-start lg:text-left">
            <p
              className="max-w-xl text-xl sm:text-2xl mx-auto lg:mx-0"
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--text-2)",
                fontStyle: "italic",
              }}
            >
              {subheadline}
            </p>

            {section.body && section.body.length > 0 ? (
              <div className="mt-5 max-w-xl text-base mx-auto lg:mx-0">
                <PortableBody value={section.body} />
              </div>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
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
        </div>
      </div>
    </section>
  )
}
