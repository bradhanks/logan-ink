import { defineField, defineType } from "sanity";

export const publication = defineType({
  name: "publication",
  title: "Publication",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "venue",
      title: "Venue / Journal",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Year",
      type: "number",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Published", value: "published" },
          { title: "In Prep", value: "inPrep" },
          { title: "Placeholder", value: "placeholder" },
        ],
        layout: "radio",
      },
      initialValue: "published",
    }),
    defineField({
      name: "doi",
      title: "DOI",
      type: "string",
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "year" },
    prepare({ title, subtitle }) {
      return { title, subtitle: subtitle ? String(subtitle) : undefined };
    },
  },
});
