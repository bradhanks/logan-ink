/**
 * Logan Hanks — TransFlag component
 * components/brand/TransFlag.tsx
 *
 * The small 5-stripe bar that appears in the hero.
 *
 * Usage:
 *   <TransFlag />
 *   <TransFlag width={72} height={10} shimmer />
 *
 * Note: the `shimmer` prop relies on the `flagShimmer` keyframe animation
 * defined in globals.css (provided by the foundation branch).
 */

import { CSSProperties } from "react"

type TransFlagProps = {
  width?:   number | string
  height?:  number
  gap?:     number
  shimmer?: boolean        // play the shimmer animation (hero usage)
  className?: string
  style?: CSSProperties
}

const STRIPES = ["#55CDFC", "#F7A8B8", "rgba(255,255,255,0.9)", "#F7A8B8", "#55CDFC"]

export function TransFlag({
  width   = 72,
  height  = 5,
  gap     = 2,
  shimmer = false,
  className,
  style,
}: TransFlagProps) {
  return (
    <div
      className={className}
      style={{
        display:  "flex",
        gap:      `${gap}px`,
        width:    typeof width === "number" ? `${width}px` : width,
        animation: shimmer ? "flagShimmer 5s ease-in-out 1.5s 2" : undefined,
        ...style,
      }}
    >
      {STRIPES.map((color, i) => (
        <span
          key={i}
          style={{
            height:       `${height}px`,
            flex:         1,
            borderRadius: "1px",
            background:   color,
          }}
        />
      ))}
    </div>
  )
}
