import { defineField, defineType } from "sanity";

export const glossaryTerm = defineType({
  name: "glossaryTerm",
  title: "Glossary Term",
  type: "document",
  fields: [
    defineField({
      name: "term",
      title: "Term",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "term" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shortDef",
      title: "Short Definition",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "related",
      title: "Related Terms",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "glossaryTerm" }],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "term", subtitle: "shortDef" },
  },
});
