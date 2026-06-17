// Mancala AI opponent — pure functions, no React/Next/IO.
//
// Reuses the engine for all game rules. Three difficulty tiers:
//   easy   — greedy: prefer an immediate extra-turn or capture, else first legal move.
//   medium — shallow minimax (depth 3) with alpha-beta pruning.
//   hard   — deeper minimax (depth 6) with alpha-beta pruning.
//
// Heuristic: store differential from the perspective of the player to move at the
// root. Extra-turn moves are handled naturally because the engine returns the same
// `turn`, so the search keeps maximizing for that player.

import {
  type GameState,
  type Player,
  legalMoves,
  applyMove,
  isGameOver,
} from "@/lib/mancala/engine";

export type Difficulty = "easy" | "medium" | "hard";

const P1_STORE = 6;
const P2_STORE = 13;

const DEPTH: Record<Exclude<Difficulty, "easy">, number> = {
  medium: 3,
  hard: 6,
};

/** Store differential from `player`'s perspective. */
function storeDiff(state: GameState, player: Player): number {
  const own = player === "p1" ? P1_STORE : P2_STORE;
  const opp = player === "p1" ? P2_STORE : P1_STORE;
  return state.board[own] - state.board[opp];
}

/** Does applying `pit` grant the mover another turn? */
function grantsExtraTurn(state: GameState, pit: number): boolean {
  const next = applyMove(state, pit);
  // Extra turn iff the turn did not pass to the opponent (and the game isn't over).
  return !next.over && next.turn === state.turn;
}

/** Does applying `pit` increase the mover's store by more than the single sown stone
 *  beyond what a non-capture move would (i.e. a capture occurred)? */
function isCaptureOrExtraTurn(state: GameState, pit: number): boolean {
  const ownStore = state.turn === "p1" ? P1_STORE : P2_STORE;
  const before = state.board[ownStore];
  const next = applyMove(state, pit);
  if (!next.over && next.turn === state.turn) return true; // extra turn
  // A capture sends opposite-pit stones into the store, jumping it by 2+.
  return next.board[ownStore] - before >= 2;
}

// ─── Greedy (easy) ─────────────────────────────────────────────────────────────

function greedy(state: GameState): number {
  const moves = legalMoves(state);
  // Prefer the move with the best immediate store gain that also yields an
  // extra turn or capture; otherwise fall back to the first legal move.
  let best: number | null = null;
  let bestGain = -Infinity;
  for (const pit of moves) {
    if (!isCaptureOrExtraTurn(state, pit)) continue;
    const ownStore = state.turn === "p1" ? P1_STORE : P2_STORE;
    const gain = applyMove(state, pit).board[ownStore] - state.board[ownStore];
    if (gain > bestGain) {
      bestGain = gain;
      best = pit;
    }
  }
  return best ?? moves[0];
}

// ─── Minimax with alpha-beta (medium / hard) ─────────────────────────────────────

/**
 * Negamax-style alpha-beta, but the engine controls whose turn is next (extra
 * turns keep the same player). We therefore track the perspective explicitly via
 * `rootPlayer` and decide maximize/minimize from `state.turn`.
 */
function search(
  state: GameState,
  depth: number,
  alpha: number,
  beta: number,
  rootPlayer: Player,
): number {
  if (depth === 0 || isGameOver(state)) {
    return storeDiff(state, rootPlayer);
  }

  const moves = legalMoves(state);
  if (moves.length === 0) {
    return storeDiff(state, rootPlayer);
  }

  const maximizing = state.turn === rootPlayer;

  if (maximizing) {
    let value = -Infinity;
    for (const pit of moves) {
      const child = applyMove(state, pit);
      value = Math.max(value, search(child, depth - 1, alpha, beta, rootPlayer));
      alpha = Math.max(alpha, value);
      if (alpha >= beta) break;
    }
    return value;
  } else {
    let value = Infinity;
    for (const pit of moves) {
      const child = applyMove(state, pit);
      value = Math.min(value, search(child, depth - 1, alpha, beta, rootPlayer));
      beta = Math.min(beta, value);
      if (alpha >= beta) break;
    }
    return value;
  }
}

function minimax(state: GameState, depth: number): number {
  const moves = legalMoves(state);
  const rootPlayer = state.turn;

  let bestMove = moves[0];
  let bestValue = -Infinity;

  for (const pit of moves) {
    const child = applyMove(state, pit);
    const value = search(child, depth - 1, -Infinity, Infinity, rootPlayer);
    if (value > bestValue) {
      bestValue = value;
      bestMove = pit;
    }
  }

  return bestMove;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Choose a legal move for the current player at the given difficulty.
 * Returns a pit index belonging to `state.turn`. Throws if no legal moves exist.
 */
export function chooseMove(state: GameState, difficulty: Difficulty): number {
  const moves = legalMoves(state);
  if (moves.length === 0) {
    throw new Error("No legal moves available.");
  }

  if (difficulty === "easy") {
    return greedy(state);
  }

  return minimax(state, DEPTH[difficulty]);
}
