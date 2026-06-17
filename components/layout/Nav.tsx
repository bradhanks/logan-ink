"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Wordmark } from "@/components/brand/Wordmark"
import { ThemeToggle } from "@/components/layout/ThemeToggle"

const NAV_LINKS = [
  { href: "/research",  label: "Research" },
  { href: "/grants",    label: "Grants" },
  { href: "/writing",   label: "Writing" },
  { href: "/timeline",  label: "Timeline" },
  { href: "/field",     label: "Field" },
  { href: "/about",     label: "About" },
] as const

export function Nav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Glass/blur effect triggers after a few px of scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Close mobile menu on outside click / escape
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false)
        hamburgerRef.current?.focus()
      }
    }
    const onPointer = (e: PointerEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !hamburgerRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false)
      }
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
    }
  }, [menuOpen])

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href)

  return (
    <>
      <header
        className={scrolled ? "nav-root nav-root--scrolled" : "nav-root"}
        aria-label="Site header"
      >
        {/* Skip link */}
        <a className="skip-link" href="#main">
          Skip to content
        </a>

        <nav
          aria-label="Primary navigation"
          className="container nav-inner"
        >
          {/* Brand mark */}
          <Link
            href="/"
            aria-label="Logan Hanks — home"
            className="nav-brand"
          >
            <Wordmark size={22} />
          </Link>

          {/* Desktop links */}
          <ul
            aria-label="Site sections"
            className="nav-links"
          >
            {NAV_LINKS.map(({ href, label }) => {
              const active = isActive(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={active ? "nav-link nav-link--active" : "nav-link"}
                  >
                    {label}
                    {active && <span aria-hidden="true" className="nav-link-indicator" />}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right-side controls */}
          <div className="nav-actions">
            <Link
              href="/contact"
              className="btn-primary nav-cta"
            >
              Get in touch
            </Link>

            <ThemeToggle />

            {/* Hamburger — mobile only */}
            <button
              ref={hamburgerRef}
              type="button"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setMenuOpen((o) => !o)}
              className="nav-hamburger"
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                {menuOpen ? (
                  <>
                    <line x1="2" y1="2" x2="14" y2="14" />
                    <line x1="14" y1="2" x2="2" y2="14" />
                  </>
                ) : (
                  <>
                    <line x1="2" y1="4" x2="14" y2="4" />
                    <line x1="2" y1="8" x2="14" y2="8" />
                    <line x1="2" y1="12" x2="14" y2="12" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu drawer — rendered outside header so it overlays content */}
      {menuOpen && (
        <div
          id="mobile-nav-menu"
          ref={menuRef}
          role="dialog"
          aria-label="Navigation menu"
          aria-modal="true"
          className="nav-mobile-menu"
        >
          {NAV_LINKS.map(({ href, label }) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={active ? "nav-mobile-link nav-mobile-link--active" : "nav-mobile-link"}
              >
                {label}
              </Link>
            )
          })}
          <div className="nav-mobile-cta-wrap">
            <Link
              href="/contact"
              className="btn-primary"
              style={{ display: "block", textAlign: "center" }}
            >
              Get in touch
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
