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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _systemPrefersDark: boolean,
): Theme {
  // Dark-first design: a stored choice wins; otherwise default to dark
  // regardless of the OS preference. The toggle still switches to light.
  if (stored === "light" || stored === "dark") return stored
  return "dark"
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
    // Dark-first: stored choice wins, otherwise default to dark.
    var theme = (stored === "light" || stored === "dark") ? stored : "dark";
    document.documentElement.dataset.theme = theme;
    // Mark JS as active so scroll-reveal can hide-then-animate. Without JS this
    // class is never added, so .reveal content stays visible (progressive
    // enhancement — no hidden content for no-JS users or non-rendering crawlers).
    document.documentElement.classList.add("js-reveal");
  } catch (_) {}
})();`
}
