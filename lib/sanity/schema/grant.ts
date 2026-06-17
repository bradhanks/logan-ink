import { defineField, defineType } from "sanity";

export const grant = defineType({
  name: "grant",
  title: "Grant",
  type: "document",
  fields: [
    defineField({
      name: "org",
      title: "Organization",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "mechanism",
      title: "Mechanism / Grant Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: (doc) => `${doc.org}-${doc.mechanism}` },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "careerStage",
      title: "Career Stage",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Undergrad", value: "undergrad" },
          { title: "Post-Bacc", value: "postbacc" },
          { title: "Predoctoral", value: "predoctoral" },
          { title: "Faculty", value: "faculty" },
        ],
        layout: "grid",
      },
    }),
    defineField({
      name: "topics",
      title: "Topics",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({
      name: "amount",
      title: "Amount (USD)",
      type: "number",
    }),
    defineField({
      name: "deadline",
      title: "Deadline",
      type: "date",
    }),
    defineField({
      name: "deadlineConfirmed",
      title: "Deadline Confirmed",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "cycleYear",
      title: "Cycle Year",
      type: "number",
    }),
    defineField({
      name: "sourceUrl",
      title: "Source URL",
      type: "url",
    }),
    defineField({
      name: "tldr",
      title: "TL;DR",
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
      name: "faq",
      title: "FAQ",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "q", title: "Question", type: "string" }),
            defineField({
              name: "a",
              title: "Answer",
              type: "array",
              of: [{ type: "block" }],
            }),
          ],
          preview: {
            select: { title: "q" },
          },
        },
      ],
    }),
  ],
  preview: {
    select: { title: "mechanism", subtitle: "org" },
  },
});
