/**
 * Section object types for the `page.sections[]` page-builder.
 *
 * Each is a `defineType({ type: "object" })` with a preview so the
 * page-builder list is legible in the Studio.
 */

import { defineField, defineType } from "sanity";

// ---------------------------------------------------------------------------
// heroSection
// ---------------------------------------------------------------------------
export const heroSection = defineType({
  name: "heroSection",
  title: "Hero Section",
  type: "object",
  fields: [
    defineField({ name: "headline", title: "Headline", type: "string" }),
    defineField({ name: "subheadline", title: "Sub-headline", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "cta",
      title: "CTA",
      type: "object",
      fields: [
        defineField({ name: "label", title: "Label", type: "string" }),
        defineField({ name: "href", title: "href", type: "string" }),
      ],
    }),
  ],
  preview: {
    select: { title: "headline" },
    prepare({ title }: { title?: string }) {
      return { title: title ?? "Hero Section", subtitle: "heroSection" };
    },
  },
});

// ---------------------------------------------------------------------------
// credentialStrip
// ---------------------------------------------------------------------------
export const credentialStrip = defineType({
  name: "credentialStrip",
  title: "Credential Strip",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Items",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Credential Strip", subtitle: "credentialStrip" };
    },
  },
});

// ---------------------------------------------------------------------------
// mindsetSection
// ---------------------------------------------------------------------------
export const mindsetSection = defineType({
  name: "mindsetSection",
  title: "Mindset Section",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }: { title?: string }) {
      return { title: title ?? "Mindset Section", subtitle: "mindsetSection" };
    },
  },
});

// ---------------------------------------------------------------------------
// researchGrid
// ---------------------------------------------------------------------------
export const researchGrid = defineType({
  name: "researchGrid",
  title: "Research Grid",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "limit", title: "Max Items to Show", type: "number" }),
  ],
  preview: {
    prepare() {
      return { title: "Research Grid", subtitle: "researchGrid" };
    },
  },
});

// ---------------------------------------------------------------------------
// grantDirectory
// ---------------------------------------------------------------------------
export const grantDirectory = defineType({
  name: "grantDirectory",
  title: "Grant Directory",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Grant Directory", subtitle: "grantDirectory" };
    },
  },
});

// ---------------------------------------------------------------------------
// missionStatement
// ---------------------------------------------------------------------------
export const missionStatement = defineType({
  name: "missionStatement",
  title: "Mission Statement",
  type: "object",
  fields: [
    defineField({ name: "statement", title: "Statement", type: "text", rows: 4 }),
  ],
  preview: {
    prepare() {
      return { title: "Mission Statement", subtitle: "missionStatement" };
    },
  },
});

// ---------------------------------------------------------------------------
// heroesList
// ---------------------------------------------------------------------------
export const heroesList = defineType({
  name: "heroesList",
  title: "Heroes List",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
  ],
  preview: {
    prepare() {
      return { title: "Heroes List", subtitle: "heroesList" };
    },
  },
});

// ---------------------------------------------------------------------------
// fieldFeedTeaser
// ---------------------------------------------------------------------------
export const fieldFeedTeaser = defineType({
  name: "fieldFeedTeaser",
  title: "Field Feed Teaser",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "limit", title: "Max Items to Show", type: "number" }),
  ],
  preview: {
    prepare() {
      return { title: "Field Feed Teaser", subtitle: "fieldFeedTeaser" };
    },
  },
});

// ---------------------------------------------------------------------------
// richText
// ---------------------------------------------------------------------------
export const richText = defineType({
  name: "richText",
  title: "Rich Text",
  type: "object",
  fields: [
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        { type: "block" },
        { type: "image", options: { hotspot: true } },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Rich Text", subtitle: "richText" };
    },
  },
});

// ---------------------------------------------------------------------------
// cta
// ---------------------------------------------------------------------------
export const cta = defineType({
  name: "cta",
  title: "CTA",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 2 }),
    defineField({ name: "label", title: "Button Label", type: "string" }),
    defineField({ name: "href", title: "Button href", type: "string" }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }: { title?: string }) {
      return { title: title ?? "CTA", subtitle: "cta" };
    },
  },
});

// ---------------------------------------------------------------------------
// imageGallery
// ---------------------------------------------------------------------------
export const imageGallery = defineType({
  name: "imageGallery",
  title: "Image Gallery",
  type: "object",
  fields: [
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({
      name: "images",
      title: "Images",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }: { title?: string }) {
      return { title: title ?? "Image Gallery", subtitle: "imageGallery" };
    },
  },
});
