// Mancala (Kalah) engine — pure functions, no mutation of input state.
//
// Board layout (14 indices):
//   0–5   = p1 pits
//   6     = p1 store
//   7–12  = p2 pits
//   13    = p2 store
//
// Sowing direction: counterclockwise → increasing index, wrapping from 13 → 0.
// The mover skips the OPPONENT's store when distributing stones.

export type Player = "p1" | "p2";

export interface GameState {
  board: number[];   // length 14
  turn: Player;
  over: boolean;
}

const P1_STORE = 6;
const P2_STORE = 13;
const BOARD_SIZE = 14;

// ─── Public API ──────────────────────────────────────────────────────────────

export function initialState(): GameState {
  return {
    board: [4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0],
    turn: "p1",
    over: false,
  };
}

/** Indices of the current player's non-empty pits. Empty array if game is over. */
export function legalMoves(state: GameState): number[] {
  if (state.over) return [];
  const { board, turn } = state;
  const pits = turn === "p1" ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12];
  return pits.filter((i) => board[i] > 0);
}

/** Apply a move and return the new game state. Throws on illegal move. */
export function applyMove(state: GameState, pit: number): GameState {
  const { board, turn } = state;

  // Guard: game already over
  if (state.over) throw new Error("Game is already over.");

  // Guard: must be current player's pit
  const playerPits = turn === "p1" ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12];
  if (!playerPits.includes(pit)) {
    throw new Error(`Pit ${pit} does not belong to ${turn}.`);
  }

  // Guard: pit must not be empty
  if (board[pit] === 0) {
    throw new Error(`Pit ${pit} is empty.`);
  }

  // Work on a mutable copy
  const b = [...board];
  const opponentStore = turn === "p1" ? P2_STORE : P1_STORE;
  const ownStore = turn === "p1" ? P1_STORE : P2_STORE;

  // Pick up stones
  let stones = b[pit];
  b[pit] = 0;

  // Sow stones counterclockwise, skipping opponent store
  let idx = pit;
  while (stones > 0) {
    idx = (idx + 1) % BOARD_SIZE;
    if (idx === opponentStore) continue; // skip opponent's store
    b[idx]++;
    stones--;
  }

  // Determine whose turn is next and check for capture
  let nextTurn: Player = turn === "p1" ? "p2" : "p1";

  if (idx === ownStore) {
    // Last stone landed in own store → extra turn
    nextTurn = turn;
  } else {
    // Check capture: last stone landed in own empty pit (was 1 after drop, i.e. was 0 before)
    // and the directly opposite pit has stones
    const ownPits = turn === "p1" ? [0, 1, 2, 3, 4, 5] : [7, 8, 9, 10, 11, 12];
    if (ownPits.includes(idx) && b[idx] === 1) {
      const opposite = 12 - idx;
      if (b[opposite] > 0) {
        // Capture: move last stone + opposite pit stones into own store
        b[ownStore] += b[idx] + b[opposite];
        b[idx] = 0;
        b[opposite] = 0;
      }
    }
  }

  // Check for game over: either side's pits are all empty
  const p1PitsSum = b[0] + b[1] + b[2] + b[3] + b[4] + b[5];
  const p2PitsSum = b[7] + b[8] + b[9] + b[10] + b[11] + b[12];

  let over = false;
  if (p1PitsSum === 0 || p2PitsSum === 0) {
    over = true;
    // Sweep remaining stones into the appropriate store
    if (p1PitsSum > 0) {
      b[P1_STORE] += p1PitsSum;
      for (let i = 0; i <= 5; i++) b[i] = 0;
    }
    if (p2PitsSum > 0) {
      b[P2_STORE] += p2PitsSum;
      for (let i = 7; i <= 12; i++) b[i] = 0;
    }
  }

  return { board: b, turn: nextTurn, over };
}

/** True if the game is over (one side's pits are all empty, or state.over is set). */
export function isGameOver(state: GameState): boolean {
  if (state.over) return true;
  const { board } = state;
  const p1Empty = [0, 1, 2, 3, 4, 5].every((i) => board[i] === 0);
  const p2Empty = [7, 8, 9, 10, 11, 12].every((i) => board[i] === 0);
  return p1Empty || p2Empty;
}

/** Returns the winner, or null if game is not over. */
export function winner(state: GameState): "p1" | "p2" | "draw" | null {
  if (!state.over && !isGameOver(state)) return null;
  const p1 = state.board[P1_STORE];
  const p2 = state.board[P2_STORE];
  if (p1 > p2) return "p1";
  if (p2 > p1) return "p2";
  return "draw";
}
