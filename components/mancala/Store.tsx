"use client";

interface StoreProps {
  count: number;
  player: "p1" | "p2";
  label: string;
}

/**
 * The store (mancala) bowl on either end of the board.
 * p1 = right side (human), p2 = left side (AI).
 */
export function Store({ count, player, label }: StoreProps) {
  const isHuman = player === "p1";

  return (
    <div
      aria-label={label}
      role="status"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "clamp(2.4rem, 9vw, 5.5rem)",
        height: "clamp(6rem, 20vw, 12rem)",
        flexShrink: 0,
        borderRadius: "clamp(1.5rem, 4vw, 2.5rem)",
        border: `2px solid ${isHuman ? "var(--blue)" : "var(--rose)"}`,
        background: isHuman
          ? "radial-gradient(ellipse at 50% 30%, rgba(109,182,216,0.12), rgba(109,182,216,0.03))"
          : "radial-gradient(ellipse at 50% 30%, rgba(212,142,168,0.12), rgba(212,142,168,0.03))",
        boxShadow: "inset 0 3px 10px rgba(0,0,0,0.2)",
        gap: "0.4rem",
        padding: "0.5rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
          fontWeight: 700,
          color: isHuman ? "var(--blue)" : "var(--rose)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        {count}
      </span>
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.6rem",
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          userSelect: "none",
        }}
      >
        {isHuman ? "You" : "AI"}
      </span>
    </div>
  );
}
