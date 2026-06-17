import { NextRequest, NextResponse } from "next/server"
import { siteConfig } from "@/lib/site-config"

/**
 * POST /api/contact
 *
 * Validate and forward a contact form submission via Resend.
 * Requires RESEND_API_KEY env var; returns 503 gracefully if absent.
 * Includes honeypot field check.
 */

const FROM_ADDRESS = `Contact · ${siteConfig.name} <contact@${siteConfig.domain}>`
const TO_ADDRESS = `contact@${siteConfig.domain}`

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Honeypot check
  if (body.website || body.trap) {
    return NextResponse.json({ ok: true })
  }

  // Validate fields
  const name = typeof body.name === "string" ? body.name.trim() : ""
  const email = typeof body.email === "string" ? body.email.trim() : ""
  const message = typeof body.message === "string" ? body.message.trim() : ""

  const fieldErrors: string[] = []
  if (!name) fieldErrors.push("Name is required.")
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fieldErrors.push("A valid email address is required.")
  }
  if (!message || message.length < 10) {
    fieldErrors.push("Message must be at least 10 characters.")
  }

  if (fieldErrors.length > 0) {
    return NextResponse.json(
      { error: fieldErrors.join(" ") },
      { status: 422 },
    )
  }

  // Check for API key
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "The contact form is not yet fully configured. Please email directly at contact@logan.ink.",
      },
      { status: 503 },
    )
  }

  // Send via Resend
  let response: Response
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: [TO_ADDRESS],
        reply_to: email,
        subject: `Contact form: ${name}`,
        text: `From: ${name} <${email}>\n\n${message}`,
        html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p><p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`,
      }),
    })
  } catch (err) {
    console.error("[contact] Resend fetch failed:", err)
    return NextResponse.json(
      { error: "Unable to send your message right now. Please try again later." },
      { status: 502 },
    )
  }

  if (response.ok) {
    return NextResponse.json({ ok: true })
  }

  console.error("[contact] Resend returned unexpected status:", response.status)
  return NextResponse.json(
    { error: "Message could not be delivered. Please try again later." },
    { status: 502 },
  )
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}
