"use client";

import type { Difficulty } from "@/lib/mancala/ai";

interface GameControlsProps {
  difficulty: Difficulty;
  onDifficultyChange: (d: Difficulty) => void;
  onNewGame: () => void;
  isAiTurn: boolean;
  isOver: boolean;
}

const DIFFICULTIES: { value: Difficulty; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export function GameControls({
  difficulty,
  onDifficultyChange,
  onNewGame,
  isAiTurn,
  isOver,
}: GameControlsProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {/* Difficulty selector */}
      <fieldset
        style={{
          border: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        <legend
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-3)",
            marginRight: "0.25rem",
            float: "left",
            paddingRight: "0.5rem",
          }}
        >
          Difficulty
        </legend>
        {DIFFICULTIES.map(({ value, label }) => (
          <label
            key={value}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="mancala-difficulty"
              value={value}
              checked={difficulty === value}
              onChange={() => onDifficultyChange(value)}
              style={{ accentColor: "var(--gold)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "0.82rem",
                color: difficulty === value ? "var(--gold)" : "var(--text-2)",
                fontWeight: difficulty === value ? 600 : 400,
                transition: "color 0.2s",
                userSelect: "none",
              }}
            >
              {label}
            </span>
          </label>
        ))}
      </fieldset>

      {/* Divider */}
      <span
        aria-hidden="true"
        style={{
          width: "1px",
          height: "1.25rem",
          background: "var(--border-2)",
        }}
      />

      {/* New Game button */}
      <button
        type="button"
        onClick={onNewGame}
        aria-label="Start a new game"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.8rem",
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: isOver ? "var(--gold)" : "var(--text-2)",
          background: isOver
            ? "rgba(201,168,76,0.12)"
            : "transparent",
          border: `1.5px solid ${isOver ? "var(--gold)" : "var(--border-2)"}`,
          borderRadius: "var(--r)",
          padding: "0.4rem 0.9rem",
          cursor: "pointer",
          transition: "color 0.2s, border-color 0.2s, background 0.2s",
          outline: "none",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = "var(--gold)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--gold)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.color = isOver ? "var(--gold)" : "var(--text-2)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = isOver ? "var(--gold)" : "var(--border-2)";
        }}
      >
        {isOver ? "Play again" : "New game"}
      </button>

      {/* AI thinking indicator */}
      {isAiTurn && !isOver && (
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.75rem",
            color: "var(--rose)",
            display: "flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--rose)",
              display: "inline-block",
              animation: "mancala-pulse 1s ease-in-out infinite",
            }}
          />
          AI thinking…
          <style>{`
            @keyframes mancala-pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.3; }
            }
            @media (prefers-reduced-motion: reduce) {
              [style*="mancala-pulse"] { animation: none; opacity: 0.7; }
            }
          `}</style>
        </span>
      )}
    </div>
  );
}
