import type { ReactNode } from "react"
import { Nav } from "@/components/layout/Nav"
import { Footer } from "@/components/layout/Footer"
import { ScrollProgress } from "@/components/layout/ScrollProgress"

/**
 * (site) route-group layout.
 *
 * Wraps all public content pages with the global Nav, Footer, and scroll
 * progress bar. Does NOT wrap /studio or API routes (those live outside this
 * route group).
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main" tabIndex={-1} style={{ outline: "none", flex: 1 }}>
        {children}
      </main>
      <Footer />
    </>
  )
}
