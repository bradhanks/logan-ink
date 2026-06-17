import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import ContactForm from "@/components/contact/ContactForm"

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description: "Get in touch with Logan Hanks.",
  path: "/contact",
})

export default function ContactPage() {
  return (
    <div
      style={{
        maxWidth: "36rem",
        margin: "0 auto",
        padding: "3rem 1.5rem 5rem",
      }}
    >
      <header style={{ marginBottom: "2.5rem" }}>
        <p className="eyebrow" style={{ marginBottom: "0.6rem" }}>
          Contact
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 2.75rem)",
            letterSpacing: "-0.03em",
            color: "var(--text)",
            lineHeight: 1.15,
            margin: 0,
          }}
        >
          Get in touch
        </h1>
        <p
          style={{
            marginTop: "0.75rem",
            fontSize: "0.95rem",
            color: "var(--text-2)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.6,
          }}
        >
          Questions, collaboration ideas, or just want to say hello — send a
          message and I&apos;ll get back to you.
        </p>
      </header>

      <ContactForm />
    </div>
  )
}
