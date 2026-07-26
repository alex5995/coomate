import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { createTrainingSession, parseUci, sessionChoices } from "@/lib/repertoire-engine";
import type { OpeningRepertoire, UciMove } from "@/lib/types";
import { catalanRepertoire } from "./catalan-repertoire";
import { catalanVariants } from "./catalan-variants";
import { grunfeldRepertoire } from "./grunfeld-repertoire";
import { grunfeldVariants } from "./grunfeld-variants";
import { openings } from "./openings";
import { sicilianRepertoire } from "./sicilian-repertoire";
import { sicilianVariants } from "./sicilian-variants";

const newOpenings = openings.slice(0, 3);

describe("study-sourced repertoires", () => {
  it.each(newOpenings.flatMap((opening) => opening.lines.map((line) => [opening, line] as const)))(
    "$id contains only legal source moves and complete safe evaluations",
    (opening, line) => {
      const chess = new Chess();
      for (const uci of line.moves) expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci}`).not.toThrow();
      expect(line.evaluations, line.id).toHaveLength(line.moves.length + 1);
      line.evaluations?.forEach((whiteScore) => {
        const userScore = opening.playerColor === "w" ? whiteScore : -whiteScore;
        expect(userScore, line.id).toBeGreaterThanOrEqual(-100);
      });
      expect(line.goal.plans).toHaveLength(3);
    },
  );

  it.each([
    [catalanRepertoire, catalanVariants],
    [sicilianRepertoire, sicilianVariants],
    [grunfeldRepertoire, grunfeldVariants],
  ] as const)("connects every displayed variation to at least one curated line", (lines, variants) => {
    for (const variant of variants) expect(lines.some((line) => line.family === variant.family), variant.id).toBe(true);
  });

  it("accepts both Catalan setup orders explicitly supported by the study", () => {
    const opening = newOpenings.find((candidate) => candidate.id === "catalan") as OpeningRepertoire;
    const selected = opening.lines.filter((line) => line.family === "Indian setup");
    const session = createTrainingSession(
      opening.lines,
      selected,
      opening.playerColor,
      opening.moveOrderMoves,
      opening.positionEvaluations,
    );
    const history = "d2d4 g8f6 c2c4 e7e6 g2g3 d7d5".split(" ") as UciMove[];
    expect(sessionChoices(session, history).map((choice) => choice.uci).sort()).toEqual(["f1g2", "g1f3"]);
  });

  it("does not expose accelerated Dragon choices", () => {
    expect(sicilianVariants.map((variant) => `${variant.id} ${variant.label}`.toLowerCase()).join(" ")).not.toContain("acceler");
    expect(sicilianRepertoire.some((line) => line.moves[3] === "b8c6" || line.moves[3] === "g7g6")).toBe(false);
    expect(sicilianRepertoire.filter((line) => line.id.includes("dragon")).every((line) => line.moves[3] === "d7d6")).toBe(true);
  });

  it("keeps the expanded anti-Sicilian coverage on the documented source prefixes", () => {
    expect(sicilianRepertoire.filter((line) => !line.id.includes("dragon")).map((line) => line.id).sort()).toEqual([
      "sicilian-alapin-bishop-exchange",
      "sicilian-alapin-central",
      "sicilian-bowdler",
      "sicilian-closed-f4",
      "sicilian-closed-nge2",
      "sicilian-moscow",
      "sicilian-smith-morra",
    ]);
    expect(sicilianRepertoire.filter((line) => line.id.includes("alapin")).every((line) =>
      line.moves.slice(0, 10).join(" ") === "e2e4 c7c5 c2c3 g8f6 e4e5 f6d5 d2d4 c5d4 c3d4 d7d6"
    )).toBe(true);
    expect(sicilianRepertoire.filter((line) => line.id.includes("closed")).every((line) =>
      line.moves.slice(0, 4).join(" ") === "e2e4 c7c5 b1c3 d7d6"
    )).toBe(true);
    expect(sicilianRepertoire.find((line) => line.id === "sicilian-moscow")?.moves.slice(0, 8).join(" ")).toBe(
      "e2e4 c7c5 g1f3 d7d6 f1b5 c8d7 b5d7 b8d7",
    );
    expect(sicilianRepertoire.find((line) => line.id === "sicilian-smith-morra")?.moves.slice(0, 8).join(" ")).toBe(
      "e2e4 c7c5 d2d4 c5d4 c2c3 d4c3 b1c3 b8c6",
    );
    expect(sicilianRepertoire.find((line) => line.id === "sicilian-bowdler")?.moves.slice(0, 8).join(" ")).toBe(
      "e2e4 c7c5 f1c4 g8f6 d2d3 d7d5 e4d5 f6d5",
    );
  });

  it("reaches the exact normal Dragon after the 2.Nc3 transposition", () => {
    const direct = sicilianRepertoire.find((line) => line.id === "sicilian-dragon-main");
    const transposition = sicilianRepertoire.find((line) => line.id === "sicilian-closed-dragon-transposition");
    const keyAfter = (moves: UciMove[]) => {
      const chess = new Chess();
      for (const uci of moves) chess.move(parseUci(uci));
      return chess.fen().split(" ").slice(0, 4).join(" ");
    };

    expect(keyAfter(transposition!.moves.slice(0, 10))).toBe(keyAfter(direct!.moves.slice(0, 10)));
  });
});
