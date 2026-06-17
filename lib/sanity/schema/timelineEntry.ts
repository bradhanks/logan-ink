import { defineField, defineType } from "sanity";

export const timelineEntry = defineType({
  name: "timelineEntry",
  title: "Timeline Entry",
  type: "document",
  fields: [
    defineField({
      name: "date",
      title: "Date",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "date" },
  },
});
