import { describe, it, expect } from "vitest"
import { resolveTheme } from "@/lib/theme"

describe("resolveTheme", () => {
  it("returns stored value when stored is 'light', even if system prefers dark", () => {
    expect(resolveTheme("light", true)).toBe("light")
  })

  it("returns 'dark' when nothing is stored and system prefers dark", () => {
    expect(resolveTheme(null, true)).toBe("dark")
  })

  it("returns 'light' when nothing is stored and system prefers light", () => {
    expect(resolveTheme(null, false)).toBe("light")
  })
})
