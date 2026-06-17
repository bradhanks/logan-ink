import { defineField, defineType } from "sanity";

export const heroPerson = defineType({
  name: "heroPerson",
  title: "Hero Person",
  type: "document",
  // No image field — we use initials/link for unlicensed individuals.
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "role",
      title: "Role / Why They Matter",
      type: "string",
    }),
    defineField({
      name: "met",
      title: "Met in Person",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "link",
      title: "Link",
      type: "url",
    }),
    defineField({
      name: "note",
      title: "Note",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role" },
  },
});
