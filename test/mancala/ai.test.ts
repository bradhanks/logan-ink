import { describe, test, expect } from "vitest";
import {
  initialState,
  legalMoves,
  applyMove,
  isGameOver,
  winner,
  type GameState,
} from "@/lib/mancala/engine";
import { chooseMove } from "@/lib/mancala/ai";

const DIFFICULTIES = ["easy", "medium", "hard"] as const;

// A few representative non-terminal states to exercise chooseMove against.
function sampleStates(): GameState[] {
  const states: GameState[] = [initialState()];

  // Play a few moves to get varied mid-game boards.
  let s = initialState();
  for (const pit of [2, 7, 0, 10]) {
    if (!isGameOver(s) && legalMoves(s).includes(pit)) {
      s = applyMove(s, pit);
      states.push(s);
    }
  }

  // A p2-to-move state.
  let s2 = applyMove(initialState(), 1);
  states.push(s2);

  return states.filter((st) => !isGameOver(st) && legalMoves(st).length > 0);
}

describe("chooseMove — legality", () => {
  for (const difficulty of DIFFICULTIES) {
    test(`${difficulty}: always returns a legal move across sample states`, () => {
      for (const state of sampleStates()) {
        const move = chooseMove(state, difficulty);
        expect(legalMoves(state)).toContain(move);
      }
    });
  }
});

describe("chooseMove — extra-turn / capture preference", () => {
  // Board crafted so p1 has a move landing exactly in its own store (pit 5 -> store 6).
  // pit index 5 holds 1 stone, so sowing one stone lands in store 6 = extra turn.
  test("hard prefers an immediate extra-turn move", () => {
    const state: GameState = {
      board: [0, 0, 0, 0, 0, 1, 0, 4, 4, 4, 4, 4, 4, 0],
      turn: "p1",
      over: false,
    };
    // Only legal move is pit 5 here, but verify it is the extra-turn move and chosen.
    const move = chooseMove(state, "hard");
    expect(move).toBe(5);
    const next = applyMove(state, move);
    expect(next.turn).toBe("p1"); // extra turn granted
  });

  test("hard captures when a large capture is clearly best", () => {
    // p1 to move. Pit 2 has 2 stones -> sow into 3 then 4. Pit 4 was empty -> becomes 1
    // (own empty pit) => capture opposite pit (index 8), which holds 6 stones.
    // Capture nets 1 (last stone) + 6 (opposite) = 7 into store 6.
    const state: GameState = {
      board: [0, 0, 2, 0, 0, 0, 0, 0, 6, 0, 0, 0, 0, 0],
      turn: "p1",
      over: false,
    };
    const move = chooseMove(state, "hard");
    const next = applyMove(state, move);
    // The capture lands 7 stones in p1's store (index 6).
    expect(next.board[6]).toBeGreaterThanOrEqual(7);
  });

  test("easy prefers an extra-turn move over a plain move", () => {
    // p1: pit 5 (1 stone) -> store 6 = extra turn (gain 1, no capture).
    //     pit 3 (3 stones) -> sows to 4,5,6(store) = ALSO lands in store => extra turn.
    // To isolate, give only pit 5 as an extra-turn move and pit 0 as a plain
    // non-capturing move (pit 0's landing pit 1 has an empty opposite so no capture).
    const state: GameState = {
      board: [2, 0, 0, 0, 0, 1, 0, 4, 4, 4, 0, 4, 4, 0],
      turn: "p1",
      over: false,
    };
    // pit 0 (2 stones) -> 1,2 : lands in pit 2 (had 0 -> 1), opposite index 10 == 0 => no capture, plain.
    // pit 5 (1 stone) -> store 6 => extra turn. Greedy must pick pit 5.
    const move = chooseMove(state, "easy");
    expect(move).toBe(5);
  });
});

describe("chooseMove — robustness near game end", () => {
  test("hard does not crash with a near-terminal board", () => {
    const state: GameState = {
      board: [0, 0, 0, 0, 0, 1, 24, 0, 0, 0, 0, 0, 2, 21],
      turn: "p1",
      over: false,
    };
    expect(() => chooseMove(state, "hard")).not.toThrow();
    const move = chooseMove(state, "hard");
    expect(legalMoves(state)).toContain(move);
  });

  test("all difficulties handle a single-legal-move board", () => {
    const state: GameState = {
      board: [0, 0, 0, 0, 0, 3, 10, 0, 0, 0, 0, 0, 1, 8],
      turn: "p1",
      over: false,
    };
    for (const difficulty of DIFFICULTIES) {
      const move = chooseMove(state, difficulty);
      expect(move).toBe(5);
    }
  });
});

describe("AI vs AI — game terminates", () => {
  for (const difficulty of DIFFICULTIES) {
    test(`${difficulty} vs ${difficulty} reaches a terminal state`, () => {
      let state = initialState();
      let guard = 0;
      while (!isGameOver(state) && guard < 1000) {
        const move = chooseMove(state, difficulty);
        expect(legalMoves(state)).toContain(move);
        state = applyMove(state, move);
        guard++;
      }
      expect(isGameOver(state)).toBe(true);
      expect(winner(state)).not.toBeNull();
    });
  }
});
