/**
 * Logan Hanks — Theme Utilities
 * lib/theme.ts
 *
 * Pure, side-effect-free utilities for theme resolution and FOUC prevention.
 */

/** The two concrete theme values the site supports. */
export type Theme = "light" | "dark"

/**
 * Resolve which theme to apply.
 *
 * @param stored - The user's persisted preference from localStorage
 *   ("light" | "dark" | null).
 * @param systemPrefersDark - Whether the OS reports a dark-mode preference.
 * @returns The resolved theme to apply.
 */
export function resolveTheme(
  stored: Theme | null,
  systemPrefersDark: boolean,
): Theme {
  if (stored === "light" || stored === "dark") return stored
  return systemPrefersDark ? "dark" : "light"
}

/**
 * Returns an IIFE string that sets `document.documentElement.dataset.theme`
 * synchronously — before the first paint — eliminating flash-of-unstyled-content.
 *
 * Inject via:
 *   <script dangerouslySetInnerHTML={{ __html: getInitialThemeScript() }} />
 */
export function getInitialThemeScript(): string {
  return `(function(){
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = (stored === "light" || stored === "dark")
      ? stored
      : (prefersDark ? "dark" : "light");
    document.documentElement.dataset.theme = theme;
  } catch (_) {}
})();`
}
