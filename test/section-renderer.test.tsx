import { describe, it, expect } from "vitest"
import { render } from "@testing-library/react"
import { SectionRenderer } from "@/components/sections/SectionRenderer"

/**
 * The page-builder maps each section object's `_type` to a component. We assert
 * that each known type renders something identifiable (a stable `data-section`
 * attribute on the section wrapper) and that an unknown type renders nothing
 * without throwing.
 */

const KNOWN_TYPES = [
  "heroSection",
  "credentialStrip",
  "mindsetSection",
  "researchGrid",
  "grantDirectory",
  "missionStatement",
  "heroesList",
  "fieldFeedTeaser",
  "richText",
  "cta",
  "imageGallery",
] as const

describe("SectionRenderer", () => {
  it.each(KNOWN_TYPES)("renders a component for _type=%s", (type) => {
    const { container } = render(
      <SectionRenderer
        sections={[{ _type: type, _key: `k-${type}` }]}
      />,
    )
    const el = container.querySelector(`[data-section="${type}"]`)
    expect(el, `expected a [data-section="${type}"] element`).not.toBeNull()
  })

  it("renders nothing for an unknown _type and does not throw", () => {
    const { container } = render(
      <SectionRenderer
        sections={[{ _type: "totallyUnknownType", _key: "x" }]}
      />,
    )
    expect(container.textContent).toBe("")
    expect(container.querySelector("[data-section]")).toBeNull()
  })

  it("skips unknown types but still renders known ones in a mixed list", () => {
    const { container } = render(
      <SectionRenderer
        sections={[
          { _type: "nope", _key: "a" },
          { _type: "missionStatement", _key: "b", statement: "hello" },
          { _type: "alsoNope", _key: "c" },
        ]}
      />,
    )
    expect(
      container.querySelector('[data-section="missionStatement"]'),
    ).not.toBeNull()
    expect(container.querySelectorAll("[data-section]")).toHaveLength(1)
  })

  it("renders an empty list without throwing", () => {
    const { container } = render(<SectionRenderer sections={[]} />)
    expect(container.querySelector("[data-section]")).toBeNull()
  })

  it("tolerates null/undefined sections prop", () => {
    const { container } = render(
      <SectionRenderer sections={undefined as never} />,
    )
    expect(container.querySelector("[data-section]")).toBeNull()
  })
})
