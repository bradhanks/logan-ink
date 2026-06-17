import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  // Singleton: Studio structure (task 1.2) will restrict to one doc.
  fields: [
    defineField({
      name: "name",
      title: "Site / Person Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline / Description",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "nowStatus",
      title: '"Now" Status Line',
      description: 'A short line about what you\'re currently working on (displayed in the "now" section).',
      type: "string",
    }),
    defineField({
      name: "socials",
      title: "Social Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Platform", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
          preview: {
            select: { title: "platform", subtitle: "url" },
          },
        },
      ],
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "email",
    }),
    defineField({
      name: "orcid",
      title: "ORCID",
      type: "string",
    }),
    defineField({
      name: "scholar",
      title: "Google Scholar URL",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "tagline" },
  },
});
