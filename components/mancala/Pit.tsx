"use client";

import { type KeyboardEvent } from "react";

interface PitProps {
  index: number;
  count: number;
  isLegal: boolean;
  isActive: boolean; // human's turn and game not over
  onClick: (index: number) => void;
  label: string; // e.g. "Pit 1 — 4 stones"
}

/**
 * A single mancala pit (bowl) with stone count display.
 * Rendered as a <button> for full keyboard operability.
 */
export function Pit({ index, count, isLegal, isActive, onClick, label }: PitProps) {
  const canPlay = isLegal && isActive;

  function handleKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (canPlay) onClick(index);
    }
  }

  return (
    <button
      type="button"
      aria-label={label}
      aria-disabled={!canPlay}
      disabled={!canPlay}
      onClick={() => canPlay && onClick(index)}
      onKeyDown={handleKey}
      className="pit-button group"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(3rem, 8vw, 4.5rem)",
        height: "clamp(3rem, 8vw, 4.5rem)",
        borderRadius: "50%",
        border: canPlay
          ? "2px solid var(--gold)"
          : "2px solid var(--border)",
        background: canPlay
          ? "radial-gradient(circle at 40% 35%, rgba(201,168,76,0.18), rgba(201,168,76,0.04))"
          : "radial-gradient(circle at 40% 35%, var(--surface-2), var(--surface))",
        cursor: canPlay ? "pointer" : "default",
        outline: "none",
        transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
        boxShadow: canPlay
          ? "inset 0 2px 6px rgba(0,0,0,0.25), 0 1px 3px rgba(0,0,0,0.15)"
          : "inset 0 2px 6px rgba(0,0,0,0.15)",
      }}
    >
      {/* Stone count */}
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: count >= 10 ? "0.85rem" : "1.05rem",
          fontWeight: 600,
          lineHeight: 1,
          color: canPlay ? "var(--gold)" : "var(--text-2)",
          transition: "color 0.2s",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {count}
      </span>

      {/* Stone dots — decorative visual hint, max 6 shown */}
      {count > 0 && (
        <span
          aria-hidden="true"
          style={{
            display: "flex",
            gap: "2px",
            marginTop: "3px",
            pointerEvents: "none",
          }}
        >
          {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
            <span
              key={i}
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: canPlay
                  ? "var(--gold)"
                  : "var(--text-3)",
                opacity: 0.7,
                display: "block",
                transition: "background 0.2s",
              }}
            />
          ))}
        </span>
      )}

      {/* Focus ring */}
      <style>{`
        .pit-button:focus-visible {
          box-shadow: 0 0 0 3px var(--blue), inset 0 2px 6px rgba(0,0,0,0.25) !important;
        }
        @media (prefers-reduced-motion: no-preference) {
          .pit-button:not(:disabled):hover {
            transform: translateY(-2px);
            box-shadow: inset 0 2px 6px rgba(0,0,0,0.25), 0 4px 12px rgba(201,168,76,0.25) !important;
          }
          .pit-button:not(:disabled):active {
            transform: translateY(0px);
          }
        }
      `}</style>
    </button>
  );
}
