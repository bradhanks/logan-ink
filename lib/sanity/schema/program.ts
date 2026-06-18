import { defineType, defineField } from "sanity";

/**
 * A target graduate program (cancer prevention / population science).
 * Public, narrative "why I'd want to train here" content.
 */
export const program = defineType({
  name: "program",
  title: "Target Program",
  type: "document",
  fields: [
    defineField({ name: "name", title: "School / Institution", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "name" }, validation: (r) => r.required() }),
    defineField({ name: "program", title: "Program name", type: "string" }),
    defineField({ name: "department", title: "Department", type: "string" }),
    defineField({ name: "order", title: "Sort order", type: "number" }),
    defineField({ name: "sourceUrl", title: "Source URL", type: "url" }),
    defineField({ name: "body", title: "Body", type: "array", of: [{ type: "block" }] }),
  ],
  orderings: [
    { title: "Sort order", name: "order", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "name", subtitle: "program" },
  },
});
