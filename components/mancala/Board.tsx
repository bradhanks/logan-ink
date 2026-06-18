"use client";

import { useState, useEffect, useCallback } from "react";
import {
  initialState,
  legalMoves,
  applyMove,
  winner,
  type GameState,
} from "@/lib/mancala/engine";
import { chooseMove, type Difficulty } from "@/lib/mancala/ai";
import { Pit } from "./Pit";
import { Store } from "./Store";
import { GameControls } from "./GameControls";

// Board layout reminder (read-only, not used at runtime):
// 0–5 = p1 pits, 6 = p1 store, 7–12 = p2 pits, 13 = p2 store

const AI_DELAY_MS = 700;

function getTurnLabel(state: GameState, isAiThinking: boolean): string {
  if (state.over) {
    const w = winner(state);
    if (w === "p1") return "You win!";
    if (w === "p2") return "AI wins.";
    return "It's a draw.";
  }
  if (isAiThinking) return "AI is thinking…";
  if (state.turn === "p1") return "Your turn — pick a pit below.";
  return "AI's turn…";
}

export function Board() {
  const [game, setGame] = useState<GameState>(initialState);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [announcement, setAnnouncement] = useState("");
  const [animatingPit, setAnimatingPit] = useState<number | null>(null);

  const announce = useCallback((msg: string) => {
    setAnnouncement("");
    setTimeout(() => setAnnouncement(msg), 50);
  }, []);

  // AI move: whenever it becomes p2's turn, the AI plays after a short delay.
  // Keyed on [game, difficulty] ONLY. The engine keeps `turn` on an extra turn,
  // so this effect naturally re-fires and the AI chains its moves. The cleanup
  // clears the timer if the game changes (new game / the AI's own move) before
  // it fires — a fired timer is harmless to clear.
  useEffect(() => {
    if (game.over || game.turn !== "p2") return;

    const timer = setTimeout(() => {
      const pit = chooseMove(game, difficulty);
      const next = applyMove(game, pit);

      const p2PitIdx = pit - 7; // 0-based from the AI's perspective
      let msg = `AI played pit ${p2PitIdx + 1}.`;
      if (!next.over && next.turn === "p2") msg += " AI gets a free turn.";
      const p2StoreDelta = next.board[13] - game.board[13];
      if (p2StoreDelta >= 2) msg += ` AI captured ${p2StoreDelta} stones.`;
      if (next.over) {
        const w = winner(next);
        msg +=
          w === "p1"
            ? " Game over — you win!"
            : w === "p2"
              ? " Game over — AI wins."
              : " Game over — it's a draw.";
      }

      announce(msg);
      setGame(next);
    }, AI_DELAY_MS);

    return () => clearTimeout(timer);
  }, [game, difficulty, announce]);

  function handlePitClick(pit: number) {
    if (game.over || game.turn !== "p1") return;
    const legal = legalMoves(game);
    if (!legal.includes(pit)) return;

    setAnimatingPit(pit);
    setTimeout(() => setAnimatingPit(null), 300);

    const next = applyMove(game, pit);
    const pitLabel = pit + 1;

    let msg = `You played pit ${pitLabel}.`;
    if (!next.over && next.turn === "p1") msg += " You get a free turn!";
    const p1StoreDelta = next.board[6] - game.board[6];
    if (p1StoreDelta >= 2) msg += ` You captured ${p1StoreDelta} stones.`;
    if (next.over) {
      const w = winner(next);
      msg +=
        w === "p1"
          ? " Game over — you win!"
          : w === "p2"
            ? " Game over — AI wins."
            : " Game over — it's a draw.";
    }

    announce(msg);
    setGame(next);
  }

  function handleNewGame() {
    setAnimatingPit(null);
    setGame(initialState());
    announce("New game started. Your turn.");
  }

  function handleDifficultyChange(d: Difficulty) {
    setDifficulty(d);
    if (game.over) handleNewGame();
  }

  const legal = legalMoves(game);
  const isAiThinking = game.turn === "p2" && !game.over;
  const isHumanTurn = game.turn === "p1" && !game.over;
  const gameWinner = game.over ? winner(game) : null;
  const turnLabel = getTurnLabel(game, isAiThinking);

  // p2 pits: displayed right-to-left so pit closest to p2 store is on the left
  // Standard Mancala: pit 12 is closest to p2 store (index 13), so display 12→7
  const p2PitsDisplay = [12, 11, 10, 9, 8, 7];
  const p1PitsDisplay = [0, 1, 2, 3, 4, 5];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1.5rem",
        width: "100%",
        maxWidth: "720px",
        margin: "0 auto",
        padding: "0 1rem",
      }}
    >
      {/* Turn label — live region for screen readers */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.9rem",
          fontWeight: 500,
          color: game.over
            ? gameWinner === "p1"
              ? "var(--blue)"
              : gameWinner === "p2"
                ? "var(--rose)"
                : "var(--gold)"
            : "var(--text-2)",
          minHeight: "1.4rem",
          textAlign: "center",
          letterSpacing: "0.02em",
          transition: "color 0.3s",
        }}
      >
        {turnLabel}
      </div>

      {/* Score */}
      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-3)",
              marginBottom: "0.2rem",
            }}
          >
            You
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--blue)",
              lineHeight: 1,
            }}
          >
            {game.board[6]}
          </div>
        </div>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.7rem",
            color: "var(--text-3)",
          }}
        >
          vs
        </div>
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--text-3)",
              marginBottom: "0.2rem",
            }}
          >
            AI
          </div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: "var(--rose)",
              lineHeight: 1,
            }}
          >
            {game.board[13]}
          </div>
        </div>
      </div>

      {/* Board */}
      <div
        role="region"
        aria-label="Mancala board"
        style={{
          width: "100%",
          borderRadius: "clamp(1rem, 3vw, 1.75rem)",
          border: "2px solid var(--border-2)",
          background:
            "linear-gradient(145deg, rgba(180,140,80,0.08) 0%, rgba(120,90,50,0.05) 50%, rgba(180,140,80,0.08) 100%)",
          boxShadow:
            "0 8px 32px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.1)",
          padding: "clamp(0.75rem, 2vw, 1.25rem)",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "clamp(0.3rem, 1.5vw, 1rem)",
          maxWidth: "100%",
          // Safety net: if the board is still wider than a very narrow phone,
          // scroll it horizontally rather than overflowing the page.
          overflowX: "auto",
        }}
      >
        {/* p2 store — left */}
        <Store
          count={game.board[13]}
          player="p2"
          label={`AI store: ${game.board[13]} stones`}
        />

        {/* Pit grid */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: "clamp(0.5rem, 1.5vw, 0.875rem)",
          }}
        >
          {/* Top row — AI pits, right-to-left */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "clamp(0.25rem, 1vw, 0.5rem)",
            }}
          >
            {p2PitsDisplay.map((idx) => (
              <Pit
                key={idx}
                index={idx}
                count={game.board[idx]}
                isLegal={false}
                isActive={false}
                onClick={() => {}}
                label={`AI pit ${13 - idx}: ${game.board[idx]} stones`}
              />
            ))}
          </div>

          {/* Divider */}
          <div
            aria-hidden="true"
            style={{
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, var(--border-2), transparent)",
            }}
          />

          {/* Bottom row — your pits, left-to-right */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "clamp(0.25rem, 1vw, 0.5rem)",
            }}
          >
            {p1PitsDisplay.map((idx) => {
              const isAnimating = animatingPit === idx;
              return (
                <div
                  key={idx}
                  className="mancala-pit-wrapper"
                  style={{
                    transform: isAnimating ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  <Pit
                    index={idx}
                    count={game.board[idx]}
                    isLegal={legal.includes(idx)}
                    isActive={isHumanTurn}
                    onClick={handlePitClick}
                    label={`Your pit ${idx + 1}: ${game.board[idx]} stones`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* p1 store — right */}
        <Store
          count={game.board[6]}
          player="p1"
          label={`Your store: ${game.board[6]} stones`}
        />
      </div>

      {/* Hint */}
      <div
        aria-hidden="true"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.65rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          textAlign: "center",
        }}
      >
        Your pits — click or press Enter / Space to sow
      </div>

      {/* Controls */}
      <GameControls
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onNewGame={handleNewGame}
        isAiTurn={isAiThinking}
        isOver={game.over}
      />

      {/* Winner banner */}
      {game.over && (
        <div
          role="alert"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.1rem, 3vw, 1.5rem)",
            fontWeight: 700,
            color:
              gameWinner === "p1"
                ? "var(--blue)"
                : gameWinner === "p2"
                  ? "var(--rose)"
                  : "var(--gold)",
            textAlign: "center",
            padding: "1rem 2rem",
            borderRadius: "var(--r)",
            border: `1.5px solid ${
              gameWinner === "p1"
                ? "var(--blue)"
                : gameWinner === "p2"
                  ? "var(--rose)"
                  : "var(--gold)"
            }`,
            background:
              gameWinner === "p1"
                ? "var(--blue-dim)"
                : gameWinner === "p2"
                  ? "var(--rose-dim)"
                  : "rgba(201,168,76,0.08)",
          }}
        >
          {gameWinner === "p1"
            ? `You win! ${game.board[6]}–${game.board[13]}`
            : gameWinner === "p2"
              ? `AI wins. ${game.board[13]}–${game.board[6]}`
              : `Draw. ${game.board[6]}–${game.board[13]}`}
        </div>
      )}

      {/* Visually-hidden aria-live for move narration */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {announcement}
      </div>

      {/* Animation styles */}
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .mancala-pit-wrapper {
            transition: transform var(--duration-fast) var(--ease-out-expo);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .mancala-pit-wrapper {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}
