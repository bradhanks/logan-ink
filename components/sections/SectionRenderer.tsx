import type { ComponentType } from "react"
import { Hero } from "./Hero"
import { CredentialStrip } from "./CredentialStrip"
import { Mindset } from "./Mindset"
import { ResearchGrid } from "./ResearchGrid"
import { GrantDirectory } from "./GrantDirectory"
import { MissionStatement } from "./MissionStatement"
import { HeroesList } from "./HeroesList"
import { FieldFeedTeaser } from "./FieldFeedTeaser"
import { RichText } from "./RichText"
import { Cta } from "./Cta"
import { ImageGallery } from "./ImageGallery"
import type { Section, UnknownSection } from "./types"

/**
 * Page-builder renderer. Maps each `page.sections[]` object's `_type` to its
 * section component. Unknown types render `null` (forward-compatible — a new
 * section type added in the Studio before the front-end ships will simply be
 * skipped rather than crashing the page).
 *
 * Each section component accepts `{ section }` and is responsible for its own
 * graceful empty state, so the page renders sensibly even before content seeds.
 */

// Each entry takes the loosely-typed section; components narrow internally.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const REGISTRY: Record<string, ComponentType<{ section: any }>> = {
  heroSection: Hero,
  credentialStrip: CredentialStrip,
  mindsetSection: Mindset,
  researchGrid: ResearchGrid,
  grantDirectory: GrantDirectory,
  missionStatement: MissionStatement,
  heroesList: HeroesList,
  fieldFeedTeaser: FieldFeedTeaser,
  richText: RichText,
  cta: Cta,
  imageGallery: ImageGallery,
}

export function SectionRenderer({
  sections,
}: {
  sections: ReadonlyArray<Section | UnknownSection> | null | undefined
}) {
  if (!sections || sections.length === 0) return null

  return (
    <>
      {sections.map((section, index) => {
        const Component = REGISTRY[section._type]
        if (!Component) return null
        const key = section._key ?? `${section._type}-${index}`
        return <Component key={key} section={section} />
      })}
    </>
  )
}
