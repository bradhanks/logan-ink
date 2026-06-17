/**
 * Logan Hanks — Wordmark
 * components/brand/Wordmark.tsx
 *
 * Renders  log^α n  in any of the four brand treatments.
 *
 * Usage:
 *   <Wordmark />                       // Signature, inherits size
 *   <Wordmark variant="geo" size={48} />
 *   <Wordmark variant="mono" />
 */

import { CSSProperties } from "react"

type WordmarkVariant = "sig" | "geo" | "serif" | "mono"

type WordmarkProps = {
  variant?: WordmarkVariant
  size?: number              // font-size in px
  color?: string
  alphaColor?: string        // color of the α superscript (defaults to brand blue)
  className?: string
  style?: CSSProperties
}

const variantStyles: Record<WordmarkVariant, CSSProperties> = {
  sig: {
    fontFamily: "var(--font-fraunces), 'Georgia', serif",
    fontStyle:  "italic",
    fontWeight: 900,
    letterSpacing: "-0.04em",
  },
  geo: {
    fontFamily: "var(--font-outfit), system-ui, sans-serif",
    fontWeight: 800,
    letterSpacing: "-0.04em",
  },
  serif: {
    fontFamily: "var(--font-fraunces), 'Georgia', serif",
    fontWeight: 700,
    letterSpacing: "-0.04em",
  },
  mono: {
    fontFamily: "ui-monospace, 'SF Mono', 'Menlo', monospace",
    fontWeight: 700,
    letterSpacing: "-0.02em",
  },
}

export function Wordmark({
  variant    = "sig",
  size,
  color,
  alphaColor = "#6DB6D8",
  className,
  style,
}: WordmarkProps) {
  const isMonoSubscript = variant === "mono"

  const supStyle: CSSProperties = {
    fontSize:       "0.38em",
    color:          alphaColor,
    fontWeight:     400,
    fontStyle:      "normal",
    letterSpacing:  0,
    verticalAlign:  isMonoSubscript ? "sub" : "super",
  }

  return (
    <span
      className={className}
      style={{
        ...variantStyles[variant],
        lineHeight: 1,
        color: color ?? "inherit",
        fontSize: size ? `${size}px` : undefined,
        ...style,
      }}
    >
      log
      {isMonoSubscript
        ? <sub   style={supStyle}>α</sub>
        : <sup   style={supStyle}>α</sup>
      }
      {isMonoSubscript ? "(n)" : "n"}
    </span>
  )
}
