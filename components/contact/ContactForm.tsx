"use client"

import { useState, useId, type CSSProperties } from "react"

type Status = "idle" | "loading" | "success" | "error"

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.6rem 0.85rem",
  fontSize: "0.9rem",
  fontFamily: "var(--font-sans)",
  background: "var(--surface)",
  border: "1px solid var(--border-2)",
  borderRadius: "var(--r)",
  color: "var(--text)",
  outline: "none",
  boxSizing: "border-box",
}

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 600,
  color: "var(--text-2)",
  fontFamily: "var(--font-sans)",
  letterSpacing: "0.02em",
  marginBottom: "0.35rem",
}

/**
 * ContactForm
 *
 * Accessible contact form that posts to /api/contact.
 * Includes name, email, message fields and a honeypot.
 */
export default function ContactForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [honeypot, setHoneypot] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const nameId = useId()
  const emailId = useId()
  const messageId = useId()
  const statusId = useId()

  const isLoading = status === "loading"

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isLoading) return

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website: honeypot }),
      })

      const data: { ok?: boolean; error?: string } = await res.json()

      if (res.ok && data.ok) {
        setStatus("success")
        setName("")
        setEmail("")
        setMessage("")
      } else {
        setStatus("error")
        setErrorMsg(data.error ?? "Something went wrong. Please try again.")
      }
    } catch {
      setStatus("error")
      setErrorMsg("Network error. Please check your connection and try again.")
    }
  }

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          padding: "1.5rem",
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--r)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text)",
            fontFamily: "var(--font-sans)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Message sent. Thank you — I&apos;ll be in touch.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-describedby={status === "error" ? statusId : undefined}
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
    >
      {/* Honeypot — visually hidden */}
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
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          autoComplete="off"
          tabIndex={-1}
        />
      </div>

      {/* Name */}
      <div>
        <label htmlFor={nameId} style={labelStyle}>
          Name <span aria-hidden="true">*</span>
        </label>
        <input
          id={nameId}
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
          placeholder="Your name"
          disabled={isLoading}
          aria-required="true"
          style={inputStyle}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor={emailId} style={labelStyle}>
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id={emailId}
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          disabled={isLoading}
          aria-required="true"
          style={inputStyle}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor={messageId} style={labelStyle}>
          Message <span aria-hidden="true">*</span>
        </label>
        <textarea
          id={messageId}
          name="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={6}
          placeholder="Your message…"
          disabled={isLoading}
          aria-required="true"
          style={{
            ...inputStyle,
            resize: "vertical",
            minHeight: "8rem",
          }}
        />
      </div>

      {/* Error message */}
      {status === "error" && (
        <p
          id={statusId}
          role="alert"
          aria-live="assertive"
          style={{
            fontSize: "0.85rem",
            color: "var(--rose-dk)",
            fontFamily: "var(--font-sans)",
            margin: 0,
          }}
        >
          {errorMsg}
        </p>
      )}

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isLoading || !name || !email || !message}
          aria-label={isLoading ? "Sending…" : "Send message"}
          style={{
            padding: "0.65rem 1.75rem",
            fontSize: "0.9rem",
            fontWeight: 600,
            fontFamily: "var(--font-sans)",
            background: "var(--blue)",
            color: "#fff",
            border: "none",
            borderRadius: "var(--r)",
            opacity: isLoading || !name || !email || !message ? 0.6 : 1,
            letterSpacing: "0.02em",
          }}
        >
          {isLoading ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  )
}
