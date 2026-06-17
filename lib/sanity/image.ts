/**
 * Image URL builder for Sanity image assets.
 *
 * Usage:
 *   import { urlForImage } from "@/lib/sanity/image";
 *   const src = urlForImage(post.coverImage).width(800).url();
 */

import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url";
import { sanityClient } from "./client";

const builder = imageUrlBuilder(sanityClient);

/**
 * Returns a Sanity image URL builder instance for the given source.
 * Chain `.width()`, `.height()`, `.fit()`, `.auto("format")`, etc.
 * before calling `.url()`.
 */
export function urlForImage(source: SanityImageSource) {
  return builder.image(source);
}
