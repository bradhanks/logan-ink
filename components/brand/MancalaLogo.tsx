/**
 * Logan Hanks — Mancala Logomark
 * components/brand/MancalaLogo.tsx
 *
 * Usage:
 *   <MancalaLogo width={30} height={13} />
 *   <MancalaLogo variant="bichrome" width={100} height={43} />
 */

type MancalaLogoProps = {
  width?: number
  height?: number
  /** "nav" = compact inline version; "bichrome" = full flat SVG mark */
  variant?: "nav" | "bichrome"
  className?: string
}

export function MancalaLogo({
  width = 30,
  height = 13,
  variant = "nav",
  className,
}: MancalaLogoProps) {
  if (variant === "bichrome") {
    return (
      <svg
        viewBox="0 0 120 52"
        width={width}
        height={height}
        aria-hidden="true"
        className={className}
      >
        {/* Logan's store (left, blue) */}
        <ellipse cx="8"   cy="26" rx="6" ry="16" fill="#6DB6D8" />
        {/* Logan's pits (top) */}
        <circle cx="22"  cy="15" r="5" fill="#6DB6D8" opacity=".8" />
        <circle cx="36"  cy="15" r="5" fill="#6DB6D8" opacity=".8" />
        <circle cx="50"  cy="15" r="5" fill="#6DB6D8" opacity=".8" />
        <circle cx="64"  cy="15" r="5" fill="#6DB6D8" opacity=".8" />
        <circle cx="78"  cy="15" r="5" fill="#6DB6D8" opacity=".8" />
        <circle cx="92"  cy="15" r="5" fill="#6DB6D8" opacity=".8" />
        {/* Community's pits (bottom, rose) */}
        <circle cx="22"  cy="37" r="5" fill="#D48EA8" opacity=".8" />
        <circle cx="36"  cy="37" r="5" fill="#D48EA8" opacity=".8" />
        <circle cx="50"  cy="37" r="5" fill="#D48EA8" opacity=".8" />
        <circle cx="64"  cy="37" r="5" fill="#D48EA8" opacity=".8" />
        <circle cx="78"  cy="37" r="5" fill="#D48EA8" opacity=".8" />
        <circle cx="92"  cy="37" r="5" fill="#D48EA8" opacity=".8" />
        {/* Community's store (right, rose) */}
        <ellipse cx="112" cy="26" rx="6" ry="16" fill="#D48EA8" />
      </svg>
    )
  }

  // Default: compact nav version
  return (
    <svg
      viewBox="0 0 124 54"
      width={width}
      height={height}
      aria-hidden="true"
      className={className}
    >
      <rect
        x="1" y="1" width="122" height="52" rx="12"
        fill="rgba(160,120,70,.25)"
        stroke="rgba(201,168,76,.3)"
        strokeWidth="1"
      />
      <ellipse cx="10"  cy="27" rx="7" ry="17" fill="#6DB6D8" opacity=".85" />
      <circle  cx="24"  cy="15" r="5.5" fill="#6DB6D8" opacity=".7" />
      <circle  cx="38"  cy="15" r="5.5" fill="#6DB6D8" opacity=".7" />
      <circle  cx="52"  cy="15" r="5.5" fill="#6DB6D8" opacity=".7" />
      <circle  cx="66"  cy="15" r="5.5" fill="#6DB6D8" opacity=".7" />
      <circle  cx="80"  cy="15" r="5.5" fill="#6DB6D8" opacity=".7" />
      <circle  cx="94"  cy="15" r="5.5" fill="#6DB6D8" opacity=".7" />
      <circle  cx="24"  cy="39" r="5.5" fill="#D48EA8" opacity=".7" />
      <circle  cx="38"  cy="39" r="5.5" fill="#D48EA8" opacity=".7" />
      <circle  cx="52"  cy="39" r="5.5" fill="#D48EA8" opacity=".7" />
      <circle  cx="66"  cy="39" r="5.5" fill="#D48EA8" opacity=".7" />
      <circle  cx="80"  cy="39" r="5.5" fill="#D48EA8" opacity=".7" />
      <circle  cx="94"  cy="39" r="5.5" fill="#D48EA8" opacity=".7" />
      <ellipse cx="114" cy="27" rx="7" ry="17" fill="#D48EA8" opacity=".85" />
    </svg>
  )
}
