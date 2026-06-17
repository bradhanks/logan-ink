/**
 * Typed shapes for the `page.sections[]` page-builder objects.
 *
 * These mirror the Sanity object schemas in `lib/sanity/schema/sections.ts`.
 * Every field is optional because content may be missing pre-seed — section
 * components must render graceful empty states rather than crash.
 */

import type { PortableTextBlock } from "@portabletext/react"

export interface SanityImageRef {
  _type?: "image"
  asset?: { _ref?: string; _type?: string }
  alt?: string
  caption?: string
  hotspot?: unknown
  crop?: unknown
}

export interface CtaLink {
  label?: string
  href?: string
}

export interface HeroSection {
  _type: "heroSection"
  _key?: string
  headline?: string
  subheadline?: string
  body?: PortableTextBlock[]
  cta?: CtaLink
}

export interface CredentialStripSection {
  _type: "credentialStrip"
  _key?: string
  items?: string[]
}

export interface MindsetSection {
  _type: "mindsetSection"
  _key?: string
  heading?: string
  body?: PortableTextBlock[]
}

export interface ResearchGridSection {
  _type: "researchGrid"
  _key?: string
  heading?: string
  limit?: number
}

export interface GrantDirectorySection {
  _type: "grantDirectory"
  _key?: string
  heading?: string
}

export interface MissionStatementSection {
  _type: "missionStatement"
  _key?: string
  statement?: string
}

export interface HeroesListSection {
  _type: "heroesList"
  _key?: string
  heading?: string
}

export interface FieldFeedTeaserSection {
  _type: "fieldFeedTeaser"
  _key?: string
  heading?: string
  limit?: number
}

export interface RichTextSection {
  _type: "richText"
  _key?: string
  content?: PortableTextBlock[]
}

export interface CtaSection {
  _type: "cta"
  _key?: string
  heading?: string
  body?: string
  label?: string
  href?: string
}

export interface ImageGallerySection {
  _type: "imageGallery"
  _key?: string
  heading?: string
  images?: SanityImageRef[]
}

export type Section =
  | HeroSection
  | CredentialStripSection
  | MindsetSection
  | ResearchGridSection
  | GrantDirectorySection
  | MissionStatementSection
  | HeroesListSection
  | FieldFeedTeaserSection
  | RichTextSection
  | CtaSection
  | ImageGallerySection

/** A loosely-typed section as it may arrive from Sanity (unknown types allowed). */
export interface UnknownSection {
  _type: string
  _key?: string
  [key: string]: unknown
}
