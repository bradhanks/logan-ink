import type { Metadata } from "next"
import { buildMetadata } from "@/lib/seo/metadata"
import { sanityFetch } from "@/lib/sanity/client"
import { PAGE_BY_SLUG_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { SectionRenderer } from "@/components/sections/SectionRenderer"
import type { Section, UnknownSection } from "@/components/sections/types"

export const metadata: Metadata = buildMetadata({
  title: "Logan Hanks",
  description:
    "Logan Hanks — cancer-prevention and population-science research, grant intelligence, and the road to graduate school.",
  path: "/",
})

const HOME_SLUG = "home"

interface PageDoc {
  _id: string
  title?: string
  sections?: Array<Section | UnknownSection>
}

/**
 * Cached read of the home `page` document. Uses the static cache profile and a
 * per-page cache tag so an editor's publish can invalidate just this page via
 * `invalidate.page("home")`. No `new Date()` / cookies here — keeps the home
 * route in the static prerender path under Cache Components.
 */
async function getHomePage(): Promise<PageDoc | null> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.page(HOME_SLUG))
  try {
    return await sanityFetch<PageDoc | null>(PAGE_BY_SLUG_QUERY, {
      slug: HOME_SLUG,
    })
  } catch {
    return null
  }
}

/**
 * Fallback page composition rendered when no `page` document exists yet, so the
 * home is never blank pre-seed. Each section component supplies its own
 * placeholder copy from these (mostly empty) objects.
 */
const DEFAULT_SECTIONS: Array<Section | UnknownSection> = [
  { _type: "heroSection", _key: "default-hero" },
  {
    _type: "credentialStrip",
    _key: "default-credentials",
    items: [
      "Fall 2024 · Utah State University · Population Science begins · Logan, UT",
      "2025 · Kepka Group · Huntsman Cancer Institute",
      "Class of 2028",
    ],
  },
  { _type: "mindsetSection", _key: "default-mindset" },
  { _type: "researchGrid", _key: "default-research" },
  { _type: "grantDirectory", _key: "default-grants" },
  { _type: "missionStatement", _key: "default-mission" },
  { _type: "heroesList", _key: "default-heroes" },
  { _type: "fieldFeedTeaser", _key: "default-feed" },
  { _type: "cta", _key: "default-cta" },
]

export default async function HomePage() {
  const page = await getHomePage()
  const sections =
    page?.sections && page.sections.length > 0
      ? page.sections
      : DEFAULT_SECTIONS

  return <SectionRenderer sections={sections} />
}
