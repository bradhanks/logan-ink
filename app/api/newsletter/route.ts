import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/newsletter
 *
 * Subscribe an email address to the Buttondown mailing list.
 * Requires BUTTONDOWN_API_KEY env var; returns 503 gracefully if absent.
 * Includes a honeypot field check to block bot submissions.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: Record<string, unknown>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  // Honeypot check — bots fill hidden fields; real users don't
  if (body.website || body.trap) {
    // Return 200 silently so bots don't know they were caught
    return NextResponse.json({ ok: true })
  }

  // Validate email
  const email = typeof body.email === "string" ? body.email.trim() : ""
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "A valid email address is required." },
      { status: 422 },
    )
  }

  // Check for API key
  const apiKey = process.env.BUTTONDOWN_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Newsletter signup is not yet configured. Please check back soon.",
      },
      { status: 503 },
    )
  }

  // Subscribe via Buttondown API
  let response: Response
  try {
    response = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        type: "regular",
      }),
    })
  } catch (err) {
    console.error("[newsletter] Buttondown fetch failed:", err)
    return NextResponse.json(
      { error: "Unable to reach newsletter service. Please try again later." },
      { status: 502 },
    )
  }

  if (response.ok) {
    return NextResponse.json({ ok: true })
  }

  // Buttondown returns 400 for already-subscribed addresses
  if (response.status === 400) {
    let detail: unknown
    try {
      detail = await response.json()
    } catch {
      detail = null
    }
    // Check for "already subscribed" style errors
    const detailStr = JSON.stringify(detail ?? "")
    if (detailStr.includes("already") || detailStr.includes("subscribed")) {
      return NextResponse.json(
        { error: "This email is already subscribed." },
        { status: 409 },
      )
    }
    return NextResponse.json(
      { error: "Invalid email or subscription could not be completed." },
      { status: 422 },
    )
  }

  console.error(
    "[newsletter] Buttondown returned unexpected status:",
    response.status,
  )
  return NextResponse.json(
    { error: "Subscription failed. Please try again later." },
    { status: 502 },
  )
}
