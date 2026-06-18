import type { ReactNode } from "react"
import Link from "next/link"
import { Wordmark } from "@/components/brand/Wordmark"
import { siteConfig } from "@/lib/site-config"
import NewsletterSignup from "@/components/newsletter/NewsletterSignup"

const SECONDARY_LINKS = [
  { href: "/writing",   label: "Writing" },
  { href: "/research",  label: "Research" },
  { href: "/grants",    label: "Grants" },
  { href: "/timeline",  label: "Timeline" },
  { href: "/field",     label: "Field" },
  { href: "/about",     label: "About" },
] as const

const MISC_LINKS = [
  { href: "/reading",   label: "Reading" },
  { href: "/glossary",  label: "Glossary" },
  { href: "/mancala",   label: "Mancala" },
  { href: "/feed.xml",  label: "RSS" },
] as const

// Placeholder social links — swap out once siteConfig carries these
const SOCIAL_LINKS: { href: string; label: string; icon: ReactNode }[] = [
  ...(siteConfig.twitterHandle
    ? [
        {
          href: `https://twitter.com/${siteConfig.twitterHandle}`,
          label: "Twitter / X",
          icon: (
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.258 5.63L18.244 2.25zm-1.16 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
            </svg>
          ),
        },
      ]
    : []),
  {
    href: `https://github.com/${siteConfig.domain.replace(/\..+$/, "")}`,
    label: "GitHub",
    icon: (
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
]

// Static build-year. Under Cache Components (PPR), calling `new Date()` in the
// render path of a statically-prerendered tree throws a prerender error, so the
// copyright year is a deterministic constant (bump on a yearly basis).
const year = 2026

export function Footer() {

  return (
    <footer className="footer-root" aria-label="Site footer">
      <div className="container">
        <div className="footer-inner">
          {/* Brand + tagline + status */}
          <div className="footer-brand">
            <Link href="/" aria-label="Logan Hanks — home">
              <Wordmark size={20} />
            </Link>
            <p className="footer-tagline">{siteConfig.description}</p>
            {/* "Now / status" placeholder — a later task will wire real content */}
            <div className="footer-status">
              <span className="pulse" aria-hidden="true" />
              <span>Currently: writing, researching, making things.</span>
            </div>
          </div>

          {/* Navigation columns */}
          <nav aria-label="Footer navigation" className="footer-nav">
            <div className="footer-nav-group">
              <p className="footer-nav-heading">Pages</p>
              {SECONDARY_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="footer-nav-link">
                  {label}
                </Link>
              ))}
            </div>

            <div className="footer-nav-group">
              <p className="footer-nav-heading">More</p>
              {MISC_LINKS.map(({ href, label }) => (
                <Link key={href} href={href} className="footer-nav-link">
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Newsletter — The logᵅN Letter */}
          <div className="footer-newsletter">
            <p className="footer-nav-heading">The logᵅN Letter</p>
            <p className="footer-newsletter-blurb">
              Occasional notes on cancer-prevention methods, grants, and the road
              to grad school.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} {siteConfig.name} · {siteConfig.domain}
          </p>

          {SOCIAL_LINKS.length > 0 && (
            <div className="footer-socials">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <a
                  key={href}
                  href={href}
                  aria-label={label}
                  className="footer-social-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  )
}
