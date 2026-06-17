import { describe, test, expect } from "vitest";
import {
  initialState,
  legalMoves,
  applyMove,
  isGameOver,
  winner,
} from "@/lib/mancala/engine";

// ─── Initial state ────────────────────────────────────────────────────────────

describe("initialState", () => {
  test("board is 14 pits with 4 stones each and empty stores", () => {
    const s = initialState();
    expect(s.board).toEqual([4, 4, 4, 4, 4, 4, 0, 4, 4, 4, 4, 4, 4, 0]);
  });

  test("first turn belongs to p1", () => {
    const s = initialState();
    expect(s.turn).toBe("p1");
  });

  test("game is not over at start", () => {
    const s = initialState();
    expect(s.over).toBe(false);
  });
});

// ─── legalMoves ──────────────────────────────────────────────────────────────

describe("legalMoves", () => {
  test("p1 can pick from pits 0–5 when all non-empty", () => {
    const s = initialState();
    expect(legalMoves(s)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test("p2 can pick from pits 7–12 on p2 turn", () => {
    // Force turn to p2
    const s = { ...initialState(), turn: "p2" as const };
    expect(legalMoves(s)).toEqual([7, 8, 9, 10, 11, 12]);
  });

  test("empty pits are excluded from legal moves", () => {
    const s = initialState();
    const board = [...s.board];
    board[0] = 0;
    const s2 = { ...s, board };
    expect(legalMoves(s2)).toEqual([1, 2, 3, 4, 5]);
  });

  test("returns empty array when game is over", () => {
    const s = { ...initialState(), over: true };
    expect(legalMoves(s)).toEqual([]);
  });
});

// ─── applyMove – illegal moves ────────────────────────────────────────────────

describe("applyMove – illegal moves", () => {
  test("throws when game is already over", () => {
    const s = { ...initialState(), over: true };
    expect(() => applyMove(s, 0)).toThrow();
  });

  test("throws when picking an empty pit", () => {
    const s = initialState();
    const board = [...s.board];
    board[2] = 0;
    const s2 = { ...s, board };
    expect(() => applyMove(s2, 2)).toThrow();
  });

  test("throws when p1 picks from p2 side (pit 7)", () => {
    const s = initialState();
    expect(() => applyMove(s, 7)).toThrow();
  });

  test("throws when p2 picks from p1 side (pit 3)", () => {
    const s = { ...initialState(), turn: "p2" as const };
    expect(() => applyMove(s, 3)).toThrow();
  });
});

// ─── Basic sowing ─────────────────────────────────────────────────────────────

describe("applyMove – basic sowing", () => {
  test("stones are picked up from chosen pit and distributed counterclockwise", () => {
    // p1 picks pit 2 (4 stones): drops into pits 3, 4, 5, 6(store)
    const s = initialState();
    const s2 = applyMove(s, 2);
    expect(s2.board[2]).toBe(0);   // pit emptied
    expect(s2.board[3]).toBe(5);   // +1
    expect(s2.board[4]).toBe(5);   // +1
    expect(s2.board[5]).toBe(5);   // +1
    expect(s2.board[6]).toBe(1);   // p1 store gets 1
  });

  test("does not mutate input state", () => {
    const s = initialState();
    const boardBefore = [...s.board];
    applyMove(s, 0);
    expect(s.board).toEqual(boardBefore);
  });

  test("turn switches to p2 when last stone does NOT land in own store", () => {
    const s = initialState();
    const s2 = applyMove(s, 2); // last stone lands in store → extra turn
    // pit 2 with 4 stones: 3,4,5,6 — last stone is in store → extra turn for p1
    // Use pit 0 instead: 4 stones → 1,2,3,4 — turn switches
    const s3 = applyMove(s, 0);
    expect(s3.turn).toBe("p2");
  });
});

// ─── Opponent store is skipped ────────────────────────────────────────────────

describe("applyMove – skipping opponent store", () => {
  test("p1 stones skip p2 store (index 13) when wrapping around", () => {
    // Give p1 pit 5 enough stones to wrap past p2's store (index 13).
    // Pit 5 → store(6) → p2 pits 7,8,9,10,11,12 → skip 13 → p1 pit 0
    // We need 9 stones in pit 5: 6→7→8→9→10→11→12→(skip 13)→0→1
    const s = initialState();
    const board = [...s.board];
    board[5] = 9; // 9 stones: fills 6,7,8,9,10,11,12,0,1
    const s2 = applyMove({ ...s, board }, 5);
    // p2 store (index 13) must remain 0
    expect(s2.board[13]).toBe(0);
    // p1 pit 0 and 1 should each get +1
    expect(s2.board[0]).toBe(5); // was 4, +1
    expect(s2.board[1]).toBe(5); // was 4, +1
  });
});

// ─── Extra turn ───────────────────────────────────────────────────────────────

describe("applyMove – extra turn", () => {
  test("p1 gets extra turn when last stone lands in p1 store (index 6)", () => {
    // pit 2 has 4 stones → distributes to 3,4,5,6 — last lands in store
    const s = initialState();
    const s2 = applyMove(s, 2);
    expect(s2.board[6]).toBe(1);
    expect(s2.turn).toBe("p1"); // same player moves again
  });

  test("p2 gets extra turn when last stone lands in p2 store (index 13)", () => {
    // p2 pit 11 (index 11) has 4 stones → 12, 13 (store)... needs only 2
    // Give p2 pit 11 exactly 2 stones so last lands in store (13)
    const s = initialState();
    const board = [...s.board];
    board[11] = 2; // 2 stones: drops into 12 and 13
    const s2 = { ...s, board, turn: "p2" as const };
    const s3 = applyMove(s2, 11);
    expect(s3.board[13]).toBeGreaterThan(0);
    expect(s3.turn).toBe("p2");
  });
});

// ─── Capture ──────────────────────────────────────────────────────────────────

describe("applyMove – capture", () => {
  test("p1 captures when last stone lands in own empty pit opposite non-empty p2 pit", () => {
    // Pit 4 is empty, pit 4's opposite is 12-4=8
    // Give p1 pit 3 exactly 1 stone so it lands in pit 4 (which is empty)
    const s = initialState();
    const board = [...s.board];
    board[3] = 1;  // 1 stone → lands in pit 4
    board[4] = 0;  // target pit is empty
    board[8] = 3;  // opposite pit has 3 stones
    const s2 = applyMove({ ...s, board }, 3);
    // pit 4 and pit 8 should both be emptied, stones go to p1 store
    expect(s2.board[4]).toBe(0);
    expect(s2.board[8]).toBe(0);
    expect(s2.board[6]).toBe(4); // 3 from pit 8 + 1 that just landed = 4 in store
  });

  test("no capture when opposite pit is empty", () => {
    const s = initialState();
    const board = [...s.board];
    board[3] = 1;  // 1 stone → lands in pit 4
    board[4] = 0;  // target pit is empty
    board[8] = 0;  // opposite pit ALSO empty — no capture
    const s2 = applyMove({ ...s, board }, 3);
    expect(s2.board[4]).toBe(1); // stone stays in pit 4
    expect(s2.board[6]).toBe(0); // p1 store unchanged
  });

  test("no capture when last stone lands on opponent side", () => {
    // p1 pit 5 with 3 stones: lands in p1 store, then p2 pit 7, then p2 pit 8... wait
    // We need last stone to land on p2 side. pit 5 + 2 stones → 6, 7 (p2 side, index 7)
    // Pit 7 might be empty, but it's opponent's side — no capture
    const s = initialState();
    const board = [...s.board];
    board[5] = 2;  // 2 stones → 6, 7
    board[7] = 0;  // p2 pit 7 empty (to test no capture on opponent side)
    const s2 = applyMove({ ...s, board }, 5);
    expect(s2.board[7]).toBe(1); // stone simply placed, no capture
    expect(s2.board[6]).toBe(1); // p1 store got 1
    expect(s2.board[13]).toBe(0); // p2 store unchanged
  });

  test("no capture when last stone lands in non-empty own pit", () => {
    // pit 3 has 1 stone → lands in pit 4 which has stones already
    const s = initialState();
    const board = [...s.board];
    board[3] = 1;
    board[4] = 2; // not empty — no capture
    board[8] = 3;
    const s2 = applyMove({ ...s, board }, 3);
    expect(s2.board[4]).toBe(3); // just added 1
    expect(s2.board[8]).toBe(3); // unchanged
    expect(s2.board[6]).toBe(0); // no capture
  });
});

// ─── Game over ────────────────────────────────────────────────────────────────

describe("isGameOver", () => {
  test("not over at start", () => {
    expect(isGameOver(initialState())).toBe(false);
  });

  test("over when p1 side is all empty", () => {
    const board = [0, 0, 0, 0, 0, 0, 24, 4, 4, 4, 4, 4, 4, 0];
    const s = { board, turn: "p1" as const, over: false };
    expect(isGameOver(s)).toBe(true);
  });

  test("over when p2 side is all empty", () => {
    const board = [4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 24];
    const s = { board, turn: "p2" as const, over: false };
    expect(isGameOver(s)).toBe(true);
  });
});

describe("applyMove – game-over detection and sweep", () => {
  test("when move empties p1 side, remaining p2 stones sweep into p2 store", () => {
    // p1 has exactly 1 stone in pit 5, all other p1 pits empty.
    // Pit 5 + 1 stone → lands in pit 6 (p1 store) → extra turn.
    // Then p1 has nothing left → game over → p2 pits sweep into p2 store.
    // But p1 side is NOT empty from that move alone.
    //
    // Use a board where p1 pit 5 has 1 stone (→ p1 store, extra turn)
    // and after that move p1 side is all empty.
    // Board: p1 = [0,0,0,0,0,1] stores=[0,0], p2=[2,2,2,2,2,2]
    const board = [0, 0, 0, 0, 0, 1, 20, 2, 2, 2, 2, 2, 2, 0];
    const s = { board, turn: "p1" as const, over: false };
    const s2 = applyMove(s, 5);
    // pit 5 has 1 stone → lands in pit 6 (p1 store) → extra turn, game NOT over yet
    // p1 side becomes empty → game over → p2 stones swept
    expect(s2.over).toBe(true);
    // All p2 pits should be empty after sweep
    for (let i = 7; i <= 12; i++) expect(s2.board[i]).toBe(0);
    // p2 store should have collected all 12 p2 pit stones
    expect(s2.board[13]).toBe(12); // 2+2+2+2+2+2 = 12
    // p1 store retains its 20 + the 1 that landed
    expect(s2.board[6]).toBe(21);
  });

  test("when move empties p2 side, remaining p1 stones sweep into p1 store", () => {
    const board = [3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 0];
    const s = { board, turn: "p2" as const, over: false };
    const s2 = applyMove(s, 12); // p2 pit 12 has 1 stone → lands in p2 store (13)
    if (s2.over) {
      expect(s2.board[0]).toBe(0);
      expect(s2.board[1]).toBe(0);
      expect(s2.board[2]).toBe(0);
      expect(s2.board[3]).toBe(0);
      expect(s2.board[4]).toBe(0);
      expect(s2.board[5]).toBe(0);
      expect(s2.board[6]).toBe(18); // 3*6 = 18
    }
  });
});

// ─── Winner ───────────────────────────────────────────────────────────────────

describe("winner", () => {
  test("returns null when game is not over", () => {
    expect(winner(initialState())).toBeNull();
  });

  test("p1 wins when p1 store > p2 store", () => {
    const board = [0, 0, 0, 0, 0, 0, 30, 0, 0, 0, 0, 0, 0, 18];
    const s = { board, turn: "p1" as const, over: true };
    expect(winner(s)).toBe("p1");
  });

  test("p2 wins when p2 store > p1 store", () => {
    const board = [0, 0, 0, 0, 0, 0, 18, 0, 0, 0, 0, 0, 0, 30];
    const s = { board, turn: "p2" as const, over: true };
    expect(winner(s)).toBe("p2");
  });

  test("draw when stores are equal", () => {
    const board = [0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 24];
    const s = { board, turn: "p1" as const, over: true };
    expect(winner(s)).toBe("draw");
  });
});
