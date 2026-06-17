import { defineField, defineType } from "sanity";

export const trackedResearcher = defineType({
  name: "trackedResearcher",
  title: "Tracked Researcher",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "orcid",
      title: "ORCID",
      type: "string",
    }),
    defineField({
      name: "pubmedQuery",
      title: "PubMed Query",
      type: "string",
    }),
    defineField({
      name: "blueskyHandle",
      title: "Bluesky Handle",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "orcid" },
  },
});
