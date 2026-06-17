import { Suspense } from "react"
import { sanityFetch } from "@/lib/sanity/client"
import { ALL_HERO_PEOPLE_QUERY } from "@/lib/sanity/queries"
import { cacheLife, cacheTag, CACHE, cacheTags } from "@/lib/cache"
import type { HeroesListSection } from "./types"

interface HeroPerson {
  _id: string
  name?: string
  role?: string
  met?: boolean
  link?: string
  note?: string
}

async function getHeroPeople(): Promise<HeroPerson[]> {
  "use cache"
  cacheLife(CACHE.static)
  cacheTag(cacheTags.page("home"))
  try {
    return (await sanityFetch<HeroPerson[]>(ALL_HERO_PEOPLE_QUERY)) ?? []
  } catch {
    return []
  }
}

function PersonRow({ person }: { person: HeroPerson }) {
  const inner = (
    <>
      <div>
        <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
          {person.name || "Someone"}
        </span>
        {person.role ? (
          <span className="ml-2 text-sm" style={{ color: "var(--text-3)" }}>
            {person.role}
          </span>
        ) : null}
      </div>
      {person.note ? (
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          {person.note}
        </p>
      ) : null}
    </>
  )
  return (
    <li
      className="border-b py-3 last:border-b-0"
      style={{ borderColor: "var(--border)" }}
    >
      {person.link ? (
        <a
          href={person.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  )
}

export function HeroesList({ section }: { section: HeroesListSection }) {
  const heading = section.heading?.trim() || "People I'd love to meet"

  return (
    <section data-section="heroesList" className="py-20">
      <div className="container">
        <p className="eyebrow mb-3">Heroes</p>
        <h2
          className="mb-2"
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
        <p className="mb-10 max-w-xl" style={{ color: "var(--text-2)" }}>
          Some I&apos;ve met. Some I&apos;m working on. If you&apos;re on this
          list and reading this — hi.
        </p>

        <Suspense fallback={null}>
          <HeroesListBody />
        </Suspense>
      </div>
    </section>
  )
}

async function HeroesListBody() {
  const people = await getHeroPeople()
  const met = people.filter((p) => p.met)
  const onList = people.filter((p) => !p.met)

  return (
    <>
      {people.length > 0 ? (
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h3 className="mb-3">
                <span className="tag tag-teal">✓ Met</span>
              </h3>
              {met.length > 0 ? (
                <ul>
                  {met.map((p) => (
                    <PersonRow key={p._id} person={p} />
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-3)" }}>
                  Working on it.
                </p>
              )}
            </div>
            <div>
              <h3 className="mb-3">
                <span className="tag tag-rose">◎ On my list</span>
              </h3>
              {onList.length > 0 ? (
                <ul>
                  {onList.map((p) => (
                    <PersonRow key={p._id} person={p} />
                  ))}
                </ul>
              ) : (
                <p className="text-sm" style={{ color: "var(--text-3)" }}>
                  Nobody yet.
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="glass p-8" style={{ color: "var(--text-3)" }}>
            This list is being written.
          </div>
        )}
    </>
  )
}
