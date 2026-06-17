/**
 * Draft-Mode-gated mount for `@sanity/visual-editing` overlays.
 *
 * Renders the click-to-edit overlays ONLY when Next.js Draft Mode is enabled.
 * This is an async server component that reads `draftMode()`, so it MUST be
 * rendered inside a `<Suspense>` boundary (see app/layout.tsx). Isolating it
 * behind Suspense keeps `draftMode()` from forcing every normal page dynamic —
 * the static shell prerenders, and only this island is deferred.
 */

import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

export async function VisualEditingGate() {
  const { isEnabled } = await draftMode();

  if (!isEnabled) return null;

  return <VisualEditing />;
}
