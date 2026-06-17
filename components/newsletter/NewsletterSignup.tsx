"use client"

import { useState, useId } from "react"

type Status = "idle" | "loading" | "success" | "error"

/**
 * NewsletterSignup
 *
 * Accessible email form that posts to /api/newsletter.
 * Includes a honeypot field to deter bot submissions.
 * Can be placed anywhere — footer, page sections, etc.
 */
export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const emailId = useId()
  const statusId = useId()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === "loading") return

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: honeypot }),
      })

      const data: { ok?: boolean; error?: string } = await res.json()

      if (res.ok && data.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
        setErrorMsg(
          data.error ?? "Something went wrong. Please try again.",
        )
      }
    } catch {
      setStatus("error")
      setErrorMsg("Network error. Please check your connection and try again.")
    }
  }

  if (status === "success") {
    return (
      <div role="status" aria-live="polite" aria-atomic="true">
        <p
          style={{
            fontSize: "0.9rem",
            color: "var(--text-2)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.5,
          }}
        >
          You&apos;re subscribed. Thanks for following along.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={status === "error" ? statusId : undefined}
    >
      {/* Honeypot — visually hidden, ignored by real users */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-9999px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <label htmlFor="newsletter-website">Website</label>
        <input
          id="newsletter-website"
          name="website"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.6rem",
        }}
      >
        <label
          htmlFor={emailId}
          style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "var(--text-2)",
            fontFamily: "var(--font-sans)",
            letterSpacing: "0.02em",
          }}
        >
          Email address
        </label>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
          }}
        >
          <input
            id={emailId}
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
            disabled={status === "loading"}
            aria-required="true"
            style={{
              flex: "1 1 12rem",
              padding: "0.55rem 0.85rem",
              fontSize: "0.9rem",
              fontFamily: "var(--font-sans)",
              background: "var(--surface)",
              border: "1px solid var(--border-2)",
              borderRadius: "var(--r)",
              color: "var(--text)",
              outline: "none",
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            disabled={status === "loading" || !email}
            aria-label={status === "loading" ? "Subscribing…" : "Subscribe"}
            style={{
              padding: "0.55rem 1.25rem",
              fontSize: "0.875rem",
              fontWeight: 600,
              fontFamily: "var(--font-sans)",
              background: "var(--blue)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--r)",
              opacity: status === "loading" || !email ? 0.6 : 1,
              letterSpacing: "0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {status === "loading" ? "Subscribing…" : "Subscribe"}
          </button>
        </div>

        {status === "error" && (
          <p
            id={statusId}
            role="alert"
            aria-live="assertive"
            style={{
              fontSize: "0.8rem",
              color: "var(--rose-dk)",
              fontFamily: "var(--font-sans)",
              margin: 0,
            }}
          >
            {errorMsg}
          </p>
        )}
      </div>
    </form>
  )
}
