import { describe, it, expect } from "vitest"
import { resolveTheme } from "@/lib/theme"

describe("resolveTheme", () => {
  it("returns stored value when stored is 'light', even if system prefers dark", () => {
    expect(resolveTheme("light", true)).toBe("light")
  })

  it("returns stored value when stored is 'dark'", () => {
    expect(resolveTheme("dark", false)).toBe("dark")
  })

  it("defaults to 'dark' when nothing is stored, regardless of system preference", () => {
    expect(resolveTheme(null, true)).toBe("dark")
    expect(resolveTheme(null, false)).toBe("dark")
  })
})
