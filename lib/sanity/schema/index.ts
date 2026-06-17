/**
 * Aggregated schema types for sanity.config.ts.
 *
 * Order matters for the Studio sidebar — documents first, then section objects.
 */

// Document types
import { siteSettings } from "./siteSettings";
import { page } from "./page";
import { essay } from "./essay";
import { timelineEntry } from "./timelineEntry";
import { researchProject } from "./researchProject";
import { publication } from "./publication";
import { grant } from "./grant";
import { heroPerson } from "./heroPerson";
import { readingItem } from "./readingItem";
import { glossaryTerm } from "./glossaryTerm";
import { trackedResearcher } from "./trackedResearcher";

// Section object types (page-builder blocks)
import {
  heroSection,
  credentialStrip,
  mindsetSection,
  researchGrid,
  grantDirectory,
  missionStatement,
  heroesList,
  fieldFeedTeaser,
  richText,
  cta,
  imageGallery,
} from "./sections";

export const schemaTypes = [
  // Documents
  siteSettings,
  page,
  essay,
  timelineEntry,
  researchProject,
  publication,
  grant,
  heroPerson,
  readingItem,
  glossaryTerm,
  trackedResearcher,

  // Page-builder section objects
  heroSection,
  credentialStrip,
  mindsetSection,
  researchGrid,
  grantDirectory,
  missionStatement,
  heroesList,
  fieldFeedTeaser,
  richText,
  cta,
  imageGallery,
];
