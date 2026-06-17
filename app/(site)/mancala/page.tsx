import { buildMetadata } from "@/lib/seo/metadata";
import { Board } from "@/components/mancala/Board";

export const metadata = buildMetadata({
  title: "Mancala",
  description:
    "Play Mancala against an AI opponent. A game of counting, foresight, and careful sowing — the same skills behind every project on this site.",
  path: "/mancala",
});

/**
 * Mancala page — statically prerenderable (no runtime data, no cookies/headers).
 * The Board component is a client island; this outer shell is a Server Component.
 */
export default function MancalaPage() {
  return (
    <main
      style={{
        minHeight: "calc(100dvh - var(--nav-height))",
        paddingTop: "clamp(2rem, 5vw, 4rem)",
        paddingBottom: "clamp(3rem, 8vw, 6rem)",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
      }}
    >
      {/* Page header */}
      <header
        style={{
          maxWidth: "640px",
          margin: "0 auto 3rem",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            fontWeight: 700,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            marginBottom: "1rem",
          }}
        >
          Mancala
        </h1>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(0.95rem, 2.2vw, 1.1rem)",
            lineHeight: 1.7,
            color: "var(--text-2)",
            maxWidth: "520px",
            margin: "0 auto",
          }}
        >
          Mancala is a game of counting, foresight, and careful sowing — you
          plan several moves ahead, reading the board like a ledger. The same
          instincts that make a good Mancala player make a good strategist: see
          the whole system, not just the next move.
        </p>

        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.78rem",
            color: "var(--text-3)",
            marginTop: "0.75rem",
            letterSpacing: "0.02em",
          }}
        >
          {/* NOTE: "5th-grade champion, 2018" is an unconfirmed detail from the
              task brief. Marked with a caveat pending fact-check. */}
          Allegedly a 5th-grade classroom champion (2018 — to be confirmed).
        </p>
      </header>

      {/* Game board — client island */}
      <Board />

      {/* Rules summary */}
      <section
        style={{
          maxWidth: "560px",
          margin: "4rem auto 0",
          padding: "1.5rem",
          borderRadius: "var(--r)",
          border: "1px solid var(--border)",
          background: "var(--surface)",
        }}
        aria-labelledby="rules-heading"
      >
        <h2
          id="rules-heading"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.7rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--text-3)",
            marginBottom: "0.875rem",
          }}
        >
          How to play
        </h2>
        <ul
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.84rem",
            lineHeight: 1.65,
            color: "var(--text-2)",
            paddingLeft: "1.1rem",
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          <li>You are the bottom row. Click any of your non-empty pits to sow.</li>
          <li>
            Stones are distributed counterclockwise. Your store (right) collects
            captured stones — the opponent&apos;s store (left) is skipped.
          </li>
          <li>
            If the last stone lands in your store, you take another turn.
          </li>
          <li>
            If the last stone lands in an empty pit on your side and the
            opposite pit has stones, you capture both groups into your store.
          </li>
          <li>
            The game ends when one side&apos;s pits are all empty. The player
            with more stones in their store wins.
          </li>
        </ul>
      </section>
    </main>
  );
}
