/**
 * Seed Sanity from the markdown content under content/.
 *
 * Idempotent: every document uses a stable _id derived from its slug, so
 * re-running updates in place (createOrReplace). Bodies are converted from
 * markdown to Portable Text. Runs all writes concurrently.
 *
 * Usage: node scripts/seed.mjs
 * Requires .env.local with NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET,
 * NEXT_PUBLIC_SANITY_API_VERSION, SANITY_WRITE_TOKEN.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { createClient } from "next-sanity";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ── env ────────────────────────────────────────────────────────────────────
const env = {};
for (const line of readFileSync(join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}
const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01",
  token: env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// ── markdown → portable text ────────────────────────────────────────────────
let keyN = 0;
const key = () => `k${keyN++}`;

/** Inline tokenizer → spans + markDefs (handles **bold**, *italic*, `code`, [t](u)). */
function inline(text) {
  const spans = [];
  const markDefs = [];
  const re = /(\*\*([^*]+)\*\*)|(\*([^*]+)\*)|(_([^_]+)_)|(`([^`]+)`)|(\[([^\]]+)\]\(([^)]+)\))/g;
  let last = 0;
  let m;
  const push = (t, marks = []) => {
    if (t) spans.push({ _type: "span", _key: key(), text: t, marks });
  };
  while ((m = re.exec(text))) {
    push(text.slice(last, m.index));
    if (m[1]) push(m[2], ["strong"]);
    else if (m[3]) push(m[4], ["em"]);
    else if (m[5]) push(m[6], ["em"]);
    else if (m[7]) push(m[8], ["code"]);
    else if (m[9]) {
      const dk = key();
      markDefs.push({ _type: "link", _key: dk, href: m[11] });
      push(m[10], [dk]);
    }
    last = re.lastIndex;
  }
  push(text.slice(last));
  if (spans.length === 0) push(text);
  return { spans, markDefs };
}

function block(style, text, listItem) {
  const { spans, markDefs } = inline(text);
  const b = { _type: "block", _key: key(), style, markDefs, children: spans };
  if (listItem) {
    b.listItem = listItem;
    b.level = 1;
  }
  return b;
}

/** Convert a markdown string to a Portable Text block array. */
function toPT(md) {
  if (!md || !md.trim()) return [];
  const out = [];
  const lines = md.replace(/\r/g, "").split("\n");
  let para = [];
  const flush = () => {
    if (para.length) {
      out.push(block("normal", para.join(" ").trim()));
      para = [];
    }
  };
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flush();
      continue;
    }
    let mm;
    if ((mm = line.match(/^(#{1,4})\s+(.*)$/))) {
      flush();
      const lvl = Math.min(mm[1].length + 1, 4); // # → h2 .. #### → h4 (cap)
      out.push(block(`h${lvl === 1 ? 2 : lvl}`, mm[2]));
    } else if ((mm = line.match(/^\s*[-*]\s+(.*)$/))) {
      flush();
      out.push(block("normal", mm[1], "bullet"));
    } else if ((mm = line.match(/^\s*\d+\.\s+(.*)$/))) {
      flush();
      out.push(block("normal", mm[1], "number"));
    } else if ((mm = line.match(/^>\s?(.*)$/))) {
      flush();
      out.push(block("blockquote", mm[1]));
    } else {
      para.push(line.trim());
    }
  }
  flush();
  return out;
}

// ── readers ─────────────────────────────────────────────────────────────────
function readDir(rel) {
  const dir = join(ROOT, rel);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f.toLowerCase() !== "index.md")
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const { data, content } = matter(readFileSync(join(dir, f), "utf8"));
      return { slug, fm: data, body: content };
    });
}
const slug = (s) => ({ _type: "slug", current: s });
const num = (v) => {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const m = v.replace(/[, ]/g, "").match(/\d+(\.\d+)?/);
    if (m) return Number(m[0]);
  }
  return undefined;
};
const isoDate = (v) =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined;
// YAML parses bare `2026-05-20` into a Date — coerce any date-ish value to a
// "YYYY-MM-DD" string so Sanity stores a string, not an object.
const dateStr = (v) => {
  if (v instanceof Date && !isNaN(v)) return v.toISOString().slice(0, 10);
  if (typeof v === "string" && v.length >= 10) return v.slice(0, 10);
  return undefined;
};
const arr = (v) => (Array.isArray(v) ? v : v ? [String(v)] : undefined);

// ── build documents ─────────────────────────────────────────────────────────
const docs = [];

for (const { slug: s, fm, body } of readDir("content/essays")) {
  docs.push({
    _id: `essay.${s}`,
    _type: "essay",
    title: fm.title || s,
    slug: slug(fm.slug || s),
    kind: fm.kind === "newsletter" ? "newsletter" : "essay",
    publishedAt: dateStr(fm.publishedAt),
    excerpt: fm.excerpt || fm.tldr || undefined,
    tags: arr(fm.tags),
    collaborateCta: !!fm.collaborateCta,
    body: toPT(body),
  });
}

for (const { slug: s, fm, body } of readDir("content/glossary")) {
  docs.push({
    _id: `glossary.${s}`,
    _type: "glossaryTerm",
    term: fm.term || s,
    slug: slug(fm.slug || s),
    shortDef: fm.shortDef || undefined,
    related: arr(fm.related)?.map((r) => ({
      _type: "reference",
      _key: key(),
      _ref: `glossary.${r}`,
      // weak: terms reference each other and are created concurrently, so the
      // target may not exist yet — weak refs don't require referential integrity.
      _weak: true,
    })),
    tags: arr(fm.tags),
    body: toPT(body),
  });
}

for (const { slug: s, fm, body } of readDir("content/reading")) {
  docs.push({
    _id: `reading.${s}`,
    _type: "readingItem",
    title: fm.title || s,
    authors: fm.authors || undefined,
    url: fm.url || undefined,
    note: fm.note || (body ? body.trim().slice(0, 600) : undefined),
    tags: arr(fm.tags),
  });
}

for (const { slug: s, fm, body } of readDir("content/grants")) {
  const faq = Array.isArray(fm.faq)
    ? fm.faq
        .filter((x) => x && x.q)
        .map((x) => ({ _type: "faq", _key: key(), q: x.q, a: toPT(x.a || "") }))
    : undefined;
  docs.push({
    _id: `grant.${s}`,
    _type: "grant",
    org: fm.org || undefined,
    mechanism: fm.mechanism || fm.title || s,
    slug: slug(fm.slug || s),
    careerStage: arr(fm.careerStage),
    topics: arr(fm.topics),
    amount: num(fm.amount),
    deadline: dateStr(fm.deadline) ?? isoDate(fm.deadline),
    deadlineConfirmed: !!fm.deadlineConfirmed,
    cycleYear: num(fm.cycleYear),
    sourceUrl:
      typeof fm.sourceUrl === "string" && fm.sourceUrl.startsWith("http")
        ? fm.sourceUrl
        : undefined,
    tldr: fm.tldr || undefined,
    body: toPT(body),
    faq,
  });
}

for (const { slug: s, fm, body } of readDir("content/research")) {
  docs.push({
    _id: `research.${s}`,
    _type: "researchProject",
    title: fm.title || s,
    slug: slug(fm.slug || s),
    summary: fm.summary || undefined,
    role: fm.role || undefined,
    methods: arr(fm.methods),
    featured: !!fm.featured,
    body: toPT(body),
  });
}

// siteSettings singleton (only fields that exist in the schema)
const aboutPath = join(ROOT, "content/site/now.md");
let nowStatus;
if (existsSync(aboutPath)) {
  nowStatus = matter(readFileSync(aboutPath, "utf8")).content.trim().split("\n")[0];
}
docs.push({
  _id: "siteSettings",
  _type: "siteSettings",
  name: "Logan Hanks",
  tagline:
    "Cancer-prevention and population-science research, grant intelligence, and the road to graduate school.",
  nowStatus: nowStatus || undefined,
  contactEmail: env.CONTACT_EMAIL || undefined,
});

// Home page document — drives the page-builder home (so Logan can reorder /
// edit sections in Studio). Mirrors the app's DEFAULT_SECTIONS fallback order.
docs.push({
  _id: "page.home",
  _type: "page",
  title: "Home",
  slug: slug("home"),
  sections: [
    { _type: "heroSection", _key: "home-hero" },
    {
      _type: "credentialStrip",
      _key: "home-credentials",
      items: [
        "Fall 2024 · Utah State University · Population science begins",
        "2025 · Learning in the orbit of the Kepka group · Huntsman Cancer Institute",
        "Class of 2028 · Toward a top cancer-prevention PhD",
      ],
    },
    {
      _type: "mindsetSection",
      _key: "home-mindset",
      heading: "Both hemispheres at full ramp",
      body: toPT(
        "The work I want to do needs two things at once: the analytic discipline to model a problem honestly, and the writing to make the answer land with the people who can act on it.\n\nI try to keep both running — rigorous regression and a clear sentence, a careful study design and a human story. The most useful research I've seen refuses to treat that as a trade-off.",
      ),
    },
    { _type: "researchGrid", _key: "home-research" },
    { _type: "grantDirectory", _key: "home-grants" },
    {
      _type: "missionStatement",
      _key: "home-mission",
      statement:
        "I want to close the distance between what we already know how to prevent and the people still living without that protection. So much harm in public health isn't from what we haven't discovered — it's from what we've discovered and failed to deliver evenly: a cancer-preventing vaccine that never reaches a rural county; a clear message never written in the language someone actually thinks in. My part is small and specific right now — learn the methods well, study communities honestly, and treat the people closest to a problem as collaborators, not data points. Rigor and warmth aren't a trade-off. Prevention done right is invisible; the cancer that never happens leaves no headline — and I'm okay working on things no one will ever have to thank me for.",
    },
    { _type: "heroesList", _key: "home-heroes" },
    { _type: "fieldFeedTeaser", _key: "home-feed" },
    {
      _type: "cta",
      _key: "home-cta",
      heading: "Have a paper that needs a stronger analysis?",
      body: "I help researchers tighten the technical side — study design, regression, sensitivity analyses — to give good work its best shot at acceptance. If that's useful to you, I'd love to hear from you.",
      label: "Get in touch",
      href: "/contact",
    },
  ],
});

// timeline entries (parsed from content/site/timeline.md list)
const tlPath = join(ROOT, "content/site/timeline.md");
if (existsSync(tlPath)) {
  const { content } = matter(readFileSync(tlPath, "utf8"));
  let i = 0;
  for (const line of content.split("\n")) {
    const m = line.match(/^-\s+\*\*(.+?)\*\*\s*(.*)$/);
    if (!m) continue;
    const label = m[1].replace(/\.$/, "").trim();
    const yr = (label.match(/(20\d{2})/) || [])[1] || "2025";
    const mo = /early|spring/i.test(label)
      ? "03"
      : /mid|summer/i.test(label)
        ? "06"
        : /late|fall|autumn/i.test(label)
          ? "10"
          : /ahead|looking/i.test(label)
            ? "12"
            : "01";
    docs.push({
      _id: `timeline.${yr}-${mo}-${i++}`,
      _type: "timelineEntry",
      date: `${yr}-${mo}-01`,
      title: label,
      body: toPT(m[2].trim()),
    });
  }
}

// hero people (parsed from content/site/heroes.md sections)
const heroPath = join(ROOT, "content/site/heroes.md");
if (existsSync(heroPath)) {
  const { content } = matter(readFileSync(heroPath, "utf8"));
  let met = false;
  for (const line of content.split("\n")) {
    const h = line.match(/^##\s+(.*)$/);
    if (h) {
      met = /met/i.test(h[1]);
      continue;
    }
    const m = line.match(/^-\s+\*\*(.+?)\*\*\s*[—–-]?\s*(.*)$/);
    if (!m) continue;
    const name = m[1].trim();
    docs.push({
      _id: `hero.${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`,
      _type: "heroPerson",
      name,
      met,
      note: m[2].trim() || undefined,
    });
  }
}

// target programs (structured markdown: # H1, **Program:**, **Department:**, ## sections)
const progDir = join(ROOT, "content/programs");
if (existsSync(progDir)) {
  const files = readdirSync(progDir).filter(
    (f) => f.endsWith(".md") && f.toLowerCase() !== "index.md",
  );
  files.forEach((f, idx) => {
    const s = f.replace(/\.md$/, "");
    const raw = readFileSync(join(progDir, f), "utf8");
    const lines = raw.replace(/\r/g, "").split("\n");
    let name = s;
    let programName, department;
    const bodyLines = [];
    for (const line of lines) {
      let m;
      if ((m = line.match(/^#\s+(.*)$/)) && name === s) name = m[1].trim();
      else if ((m = line.match(/^\*\*Program:\*\*\s*(.*)$/))) programName = m[1].trim();
      else if ((m = line.match(/^\*\*Department:\*\*\s*(.*)$/))) department = m[1].trim();
      else bodyLines.push(line);
    }
    docs.push({
      _id: `program.${s}`,
      _type: "program",
      name,
      slug: slug(s),
      program: programName,
      department,
      order: idx,
      body: toPT(bodyLines.join("\n")),
    });
  });
}

// strip undefined keys (Sanity rejects explicit undefined in some clients)
const clean = (o) => {
  if (Array.isArray(o)) return o.map(clean);
  if (o && typeof o === "object") {
    const r = {};
    for (const [k, v] of Object.entries(o)) {
      if (v === undefined) continue;
      r[k] = clean(v);
    }
    return r;
  }
  return o;
};

// ── write ─────────────────────────────────────────────────────────────────
const counts = {};
const results = await Promise.allSettled(
  docs.map((d) =>
    client.createOrReplace(clean(d)).then(() => {
      counts[d._type] = (counts[d._type] || 0) + 1;
    }),
  ),
);
const failures = results.filter((r) => r.status === "rejected");
console.log("Seeded:", JSON.stringify(counts));
if (failures.length) {
  console.log(`FAILURES: ${failures.length}`);
  for (const f of failures.slice(0, 5)) console.log("  -", f.reason?.message || f.reason);
  process.exit(1);
}
console.log(`OK — ${docs.length} documents upserted.`);
