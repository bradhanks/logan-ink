import { urlForImage } from "@/lib/sanity/image"
import type { ImageGallerySection, SanityImageRef } from "./types"

/**
 * ImageGallery — a responsive grid of captioned images. Server Component.
 * Renders nothing gimmicky; calm grid with alt text + optional captions.
 */
export function ImageGallery({
  section,
}: {
  section: ImageGallerySection
}) {
  const images = (section.images ?? []).filter(
    (img): img is SanityImageRef => Boolean(img?.asset),
  )

  return (
    <section data-section="imageGallery" className="py-20">
      <div className="container">
        {section.heading ? (
          <h2
            className="mb-8"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 4vw, 2.875rem)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              color: "var(--text)",
            }}
          >
            {section.heading}
          </h2>
        ) : null}

        {images.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((img, i) => {
              const src = urlForImage(img).width(800).auto("format").url()
              return (
                <figure key={i}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={img.alt ?? ""}
                    loading="lazy"
                    className="w-full rounded-[var(--r)]"
                  />
                  {img.caption ? (
                    <figcaption
                      className="mt-2 text-sm"
                      style={{ color: "var(--text-3)" }}
                    >
                      {img.caption}
                    </figcaption>
                  ) : null}
                </figure>
              )
            })}
          </div>
        ) : (
          <div className="glass p-8" style={{ color: "var(--text-3)" }}>
            No images yet.
          </div>
        )}
      </div>
    </section>
  )
}
