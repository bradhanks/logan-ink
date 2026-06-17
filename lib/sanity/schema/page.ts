import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "sections",
      title: "Sections",
      description: "Page builder — drag to reorder.",
      type: "array",
      of: [
        { type: "heroSection" },
        { type: "credentialStrip" },
        { type: "mindsetSection" },
        { type: "researchGrid" },
        { type: "grantDirectory" },
        { type: "missionStatement" },
        { type: "heroesList" },
        { type: "fieldFeedTeaser" },
        { type: "richText" },
        { type: "cta" },
        { type: "imageGallery" },
      ],
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
