import {
  PortableText,
  type PortableTextComponents,
  type PortableTextBlock,
} from "@portabletext/react"
import { urlForImage } from "@/lib/sanity/image"
import type { RichTextSection } from "./types"

/**
 * Shared Portable Text renderer used by `richText` sections (and reused by Hero
 * / Mindset for their body fields). Renders calm, readable prose with the brand
 * type scale. Falls back gracefully when content is empty.
 */

export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed" style={{ color: "var(--text-2)" }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="mt-10 mb-4 text-2xl sm:text-3xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="mt-8 mb-3 text-xl"
        style={{ fontFamily: "var(--font-display)", color: "var(--text)" }}
      >
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote
        className="my-6 border-l-2 pl-5 italic"
        style={{ borderColor: "var(--blue)", color: "var(--text-2)" }}
      >
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value?.href as string) ?? "#"
      const external = /^https?:\/\//.test(href)
      return (
        <a
          href={href}
          style={{ color: "var(--blue)", textDecoration: "underline" }}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null
      const src = urlForImage(value).width(1200).auto("format").url()
      return (
        <figure className="my-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={value.alt ?? ""}
            className="w-full rounded-[var(--r)]"
            loading="lazy"
          />
          {value.caption ? (
            <figcaption
              className="mt-2 text-sm"
              style={{ color: "var(--text-3)" }}
            >
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      )
    },
  },
}

export function PortableBody({ value }: { value?: PortableTextBlock[] }) {
  if (!value || value.length === 0) return null
  return <PortableText value={value} components={portableTextComponents} />
}

export function RichText({ section }: { section: RichTextSection }) {
  const { content } = section
  return (
    <section data-section="richText" className="py-16">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          {content && content.length > 0 ? (
            <PortableBody value={content} />
          ) : (
            <p style={{ color: "var(--text-3)" }}>Content coming soon.</p>
          )}
        </div>
      </div>
    </section>
  )
}
