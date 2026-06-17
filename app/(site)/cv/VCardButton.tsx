"use client"

export interface VCardFields {
  name: string
  email?: string | null
  website?: string | null
  org?: string | null
}

export function VCardButton({ fields }: { fields: VCardFields }) {
  function handleDownload() {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${fields.name}`,
      `N:${fields.name.split(" ").reverse().join(";")};;;`,
    ]
    if (fields.email) lines.push(`EMAIL;TYPE=INTERNET:${fields.email}`)
    if (fields.website) lines.push(`URL:${fields.website}`)
    if (fields.org) lines.push(`ORG:${fields.org}`)
    lines.push("END:VCARD")

    const blob = new Blob([lines.join("\r\n")], { type: "text/vcard" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${fields.name.replace(/\s+/g, "_")}.vcf`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      aria-label="Download vCard contact file"
      style={{
        fontFamily: "var(--font-sans)",
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "var(--text)",
        background: "transparent",
        border: "1px solid var(--border-2)",
        borderRadius: "var(--r)",
        padding: "0.5rem 1.125rem",
        cursor: "pointer",
        transition: "background var(--duration-fast)",
      }}
    >
      Download vCard
    </button>
  )
}
