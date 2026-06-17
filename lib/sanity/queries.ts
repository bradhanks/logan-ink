/**
 * GROQ query constants for logan.ink.
 *
 * All queries are exported as named constants. Use with `sanityFetch` from
 * `@/lib/sanity/client`. Parameterized queries use `$param` syntax — pass
 * params as the second arg to `sanityFetch`.
 */

// ---------------------------------------------------------------------------
// Site settings (singleton)
// ---------------------------------------------------------------------------

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0]`;

// ---------------------------------------------------------------------------
// Pages
// ---------------------------------------------------------------------------

/** Fetch a single `page` document by slug. Params: `{ slug: string }` */
export const PAGE_BY_SLUG_QUERY = `
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    sections[]
  }
`;

// ---------------------------------------------------------------------------
// Essays
// ---------------------------------------------------------------------------

/** All essays ordered newest-first. */
export const ALL_ESSAYS_QUERY = `
  *[_type == "essay"] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    kind,
    publishedAt,
    excerpt,
    tags,
    collaborateCta
  }
`;

/** Essays filtered by kind. Params: `{ kind: "essay" | "newsletter" }` */
export const ESSAYS_BY_KIND_QUERY = `
  *[_type == "essay" && kind == $kind] | order(publishedAt desc) {
    _id,
    _type,
    title,
    slug,
    kind,
    publishedAt,
    excerpt,
    tags,
    collaborateCta
  }
`;

/** Single essay by slug. Params: `{ slug: string }` */
export const ESSAY_BY_SLUG_QUERY = `
  *[_type == "essay" && slug.current == $slug][0] {
    _id,
    _type,
    title,
    slug,
    kind,
    publishedAt,
    excerpt,
    body,
    tags,
    collaborateCta
  }
`;

// ---------------------------------------------------------------------------
// Timeline entries
// ---------------------------------------------------------------------------

/** All timeline entries, newest date first. */
export const ALL_TIMELINE_ENTRIES_QUERY = `
  *[_type == "timelineEntry"] | order(date desc) {
    _id,
    _type,
    date,
    title,
    body,
    category
  }
`;

// ---------------------------------------------------------------------------
// Research projects
// ---------------------------------------------------------------------------

/** All research projects; featured ones first. */
export const ALL_RESEARCH_PROJECTS_QUERY = `
  *[_type == "researchProject"] | order(featured desc, _createdAt desc) {
    _id,
    _type,
    title,
    slug,
    summary,
    role,
    methods,
    featured
  }
`;

// ---------------------------------------------------------------------------
// Publications
// ---------------------------------------------------------------------------

/** All publications ordered by year descending. */
export const ALL_PUBLICATIONS_QUERY = `
  *[_type == "publication"] | order(year desc) {
    _id,
    _type,
    title,
    authors,
    venue,
    year,
    status,
    doi,
    url
  }
`;

// ---------------------------------------------------------------------------
// Grants
// ---------------------------------------------------------------------------

/** All grants. */
export const ALL_GRANTS_QUERY = `
  *[_type == "grant"] | order(deadline asc) {
    _id,
    _type,
    org,
    mechanism,
    slug,
    careerStage,
    topics,
    amount,
    deadline,
    deadlineConfirmed,
    cycleYear,
    sourceUrl,
    tldr
  }
`;

/** Single grant by slug. Params: `{ slug: string }` */
export const GRANT_BY_SLUG_QUERY = `
  *[_type == "grant" && slug.current == $slug][0] {
    _id,
    _type,
    org,
    mechanism,
    slug,
    careerStage,
    topics,
    amount,
    deadline,
    deadlineConfirmed,
    cycleYear,
    sourceUrl,
    tldr,
    body,
    faq
  }
`;

// ---------------------------------------------------------------------------
// Hero people
// ---------------------------------------------------------------------------

/** All hero people. */
export const ALL_HERO_PEOPLE_QUERY = `
  *[_type == "heroPerson"] | order(_createdAt asc) {
    _id,
    _type,
    name,
    role,
    met,
    link,
    note
  }
`;

// ---------------------------------------------------------------------------
// Reading items
// ---------------------------------------------------------------------------

/** All reading items. */
export const ALL_READING_ITEMS_QUERY = `
  *[_type == "readingItem"] | order(_createdAt desc) {
    _id,
    _type,
    title,
    authors,
    url,
    note,
    tags
  }
`;

// ---------------------------------------------------------------------------
// Glossary terms
// ---------------------------------------------------------------------------

/** All glossary terms alphabetically. */
export const ALL_GLOSSARY_TERMS_QUERY = `
  *[_type == "glossaryTerm"] | order(term asc) {
    _id,
    _type,
    term,
    slug,
    shortDef,
    related[]-> { term, slug }
  }
`;

/** Single glossary term by slug. Params: `{ slug: string }` */
export const GLOSSARY_TERM_BY_SLUG_QUERY = `
  *[_type == "glossaryTerm" && slug.current == $slug][0] {
    _id,
    _type,
    term,
    slug,
    shortDef,
    body,
    related[]-> { term, slug }
  }
`;

// ---------------------------------------------------------------------------
// Tracked researchers
// ---------------------------------------------------------------------------

/** All tracked researchers. */
export const ALL_TRACKED_RESEARCHERS_QUERY = `
  *[_type == "trackedResearcher"] | order(name asc) {
    _id,
    _type,
    name,
    orcid,
    pubmedQuery,
    blueskyHandle
  }
`;
