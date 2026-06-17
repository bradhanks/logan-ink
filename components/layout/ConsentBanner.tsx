"use client"

import { useEffect, useState } from "react"

const STORAGE_KEY = "consent_v1"

type ConsentState = "granted" | "denied"

/** Push Google Consent Mode v2 defaults to dataLayer before any tags fire. */
function pushConsentDefault() {
  if (typeof window === "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dl = ((window as any).dataLayer ??= [])
  dl.push("consent", "default", {
    ad_storage:              "denied",
    ad_user_data:            "denied",
    ad_personalization:      "denied",
    analytics_storage:       "denied",
    functionality_storage:   "granted",
    personalization_storage: "denied",
    security_storage:        "granted",
    wait_for_update:         500,
  })
}

/** Update consent state in dataLayer after user chooses. */
function pushConsentUpdate(state: ConsentState) {
  if (typeof window === "undefined") return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dl = ((window as any).dataLayer ??= [])
  dl.push("consent", "update", {
    ad_storage:              state,
    ad_user_data:            state,
    ad_personalization:      state,
    analytics_storage:       state,
  })
}

export function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Always push denied defaults first — GTM reads this before loading tags
    pushConsentDefault()

    const stored = localStorage.getItem(STORAGE_KEY) as ConsentState | null
    if (stored === "granted") {
      pushConsentUpdate("granted")
      return
    }
    if (stored === "denied") {
      // Already declined — nothing more to do
      return
    }
    // No stored choice yet — show the banner
    setVisible(true)
  }, [])

  function accept() {
    pushConsentUpdate("granted")
    try { localStorage.setItem(STORAGE_KEY, "granted") } catch (_) {}
    setVisible(false)
  }

  function decline() {
    pushConsentUpdate("denied")
    try { localStorage.setItem(STORAGE_KEY, "denied") } catch (_) {}
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: "1.25rem",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 200,
        width: "min(calc(100vw - 2rem), 480px)",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r)",
        padding: "1rem 1.25rem",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        backdropFilter: "blur(20px)",
        boxShadow: "0 4px 30px rgba(0,0,0,0.12)",
      }}
    >
      <p
        style={{
          flex: 1,
          fontSize: "0.82rem",
          lineHeight: 1.5,
          color: "var(--text-2)",
          margin: 0,
        }}
      >
        This site uses analytics to understand how it&rsquo;s used. No personal
        data is sold or shared with third parties.
      </p>

      <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
        <button
          type="button"
          onClick={decline}
          aria-label="Decline analytics"
          style={{
            fontSize: "0.78rem",
            fontWeight: 500,
            color: "var(--text-3)",
            padding: "0.4rem 0.75rem",
            borderRadius: "0.375rem",
            border: "1px solid var(--border)",
            background: "transparent",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Decline
        </button>
        <button
          type="button"
          onClick={accept}
          aria-label="Accept analytics"
          style={{
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "#fff",
            padding: "0.4rem 0.75rem",
            borderRadius: "0.375rem",
            border: "none",
            background: "var(--blue)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}
