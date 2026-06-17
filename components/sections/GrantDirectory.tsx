import { Suspense } from "react"
import Link from "next/link"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_GRANTS_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import { GrantDirectoryClient, type Grant } from "./GrantDirectoryClient"
import type { GrantDirectorySection } from "./types"

async function getGrants(): Promise<Grant[]> {
  "use cache"
  cacheLife(CACHE.gallery)
  cacheTag(cacheTags.gallery)
  try {
    return (await sanityFetch<Grant[]>(ALL_GRANTS_QUERY)) ?? []
  } catch {
    return []
  }
}

/**
 * GrantDirectory teaser — server wrapper that fetches grants and hands them to
 * the interactive client (filter chips + expandable rows). The section wrapper
 * (with the data-section marker) is server-rendered so the static shell is
 * stable even before data seeds.
 */
export function GrantDirectory({
  section,
}: {
  section: GrantDirectorySection
}) {
  const heading = section.heading?.trim() || "Grant directory"

  return (
    <section data-section="grantDirectory" className="py-20">
      <div className="container">
        <p className="eyebrow mb-3">Grants</p>
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2
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
          <Link href="/grants" className="btn-ghost shrink-0">
            Full directory →
          </Link>
        </div>

        <Suspense fallback={null}>
          <GrantDirectoryBody />
        </Suspense>

        <p className="mt-6 text-sm" style={{ color: "var(--text-2)" }}>
          Working on a proposal? Want a second read on the strategic framing?{" "}
          <Link href="/about" style={{ color: "var(--blue)" }}>
            Get in touch →
          </Link>
        </p>
      </div>
    </section>
  )
}

async function GrantDirectoryBody() {
  const grants = await getGrants()
  if (grants.length === 0) {
    return (
      <div className="glass p-8" style={{ color: "var(--text-3)" }}>
        The grant directory is being compiled.
      </div>
    )
  }
  return <GrantDirectoryClient grants={grants} />
}
