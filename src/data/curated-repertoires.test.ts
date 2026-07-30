import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { createTrainingSession, parseUci, sessionChoices, sessionTarget } from "@/lib/repertoire-engine";
import type { OpeningRepertoire, UciMove } from "@/lib/types";
import { catalanRepertoire } from "./catalan-repertoire";
import { catalanVariants } from "./catalan-variants";
import { grunfeldRepertoire } from "./grunfeld-repertoire";
import { grunfeldVariants } from "./grunfeld-variants";
import { openings } from "./openings";
import { sicilianRepertoire } from "./sicilian-repertoire";
import { sicilianVariants } from "./sicilian-variants";
import { trainingGoalFor } from "./training-goals";

const curatedOpenings = openings;

describe("curated repertoires", () => {
  it.each(curatedOpenings.flatMap((opening) => opening.lines.map((line) => [opening, line] as const)))(
    "$id contains only legal moves and complete safe evaluations",
    (opening, line) => {
      const chess = new Chess();
      for (const uci of line.moves) expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci}`).not.toThrow();
      expect(line.evaluations, line.id).toHaveLength(line.moves.length + 1);
      line.evaluations?.forEach((whiteScore) => {
        const userScore = opening.playerColor === "w" ? whiteScore : -whiteScore;
        expect(userScore, line.id).toBeGreaterThanOrEqual(-100);
      });
      expect(line.goal.plans).toHaveLength(3);
      expect(line.goal).toEqual(trainingGoalFor(opening.id, line.id));
    },
  );

  it.each([
    [catalanRepertoire, catalanVariants],
    [sicilianRepertoire, sicilianVariants],
    [grunfeldRepertoire, grunfeldVariants],
  ] as const)("connects every displayed variation to at least one curated line", (lines, variants) => {
    for (const variant of variants) {
      const selected = lines.filter((line) =>
        variant.opponentLineIds?.includes(line.id) ?? line.family === variant.family,
      );
      expect(selected.length, variant.id).toBeGreaterThan(0);
    }
  });

  it("presents each Grünfeld Exchange continuation as an explicit opponent variation", () => {
    const exchangeVariants = grunfeldVariants.filter((variant) => variant.family === "Exchange");

    expect(exchangeVariants.map((variant) => variant.opponentLineIds)).toEqual([
      ["grunfeld-exchange-classical"],
      ["grunfeld-exchange-gm"],
      ["grunfeld-exchange-exact"],
    ]);
    expect(exchangeVariants.reduce((total, variant) => total + variant.probability, 0)).toBe(34);
  });

  it("commits the Indian Catalan to Nf3 before the fianchetto", () => {
    const opening = curatedOpenings.find((candidate) => candidate.id === "catalan") as OpeningRepertoire;
    const selected = opening.lines.filter((line) => line.family === "Indian setup");
    const session = createTrainingSession(
      opening.lines,
      selected,
      opening.playerColor,
      opening.moveOrderMoves,
      opening.positionEvaluations,
    );
    const beforeKnight = "d2d4 g8f6 c2c4 e7e6".split(" ") as UciMove[];
    expect(sessionChoices(session, beforeKnight).map((choice) => choice.uci)).toEqual(["g1f3"]);
    const beforeFianchetto = [...beforeKnight, "g1f3", "d7d5"] as UciMove[];
    expect(sessionChoices(session, beforeFianchetto).map((choice) => choice.uci)).toEqual(["g2g3"]);
  });

  it("keeps the Catalan response set aligned with the selected repertoire", () => {
    expect(catalanVariants.map((variant) => variant.id)).toContain("catalan-benoni");
    expect(catalanVariants.map((variant) => variant.id)).toContain("catalan-budapest");
    expect(catalanVariants.map((variant) => variant.id)).not.toContain("catalan-hungarian");
    expect(catalanVariants.map((variant) => variant.id)).not.toContain("catalan-neo");
    expect(catalanRepertoire.find((line) => line.id === "catalan-budapest")?.moves.slice(0, 7)).toEqual(
      "d2d4 g8f6 c2c4 e7e5 d4e5 f6g4 g2g3".split(" "),
    );
    expect(catalanRepertoire.find((line) => line.id === "catalan-marshall")?.moves.slice(-4)).toEqual([
      "f5g6",
      "e1g1",
      "b8c6",
      "b1c3",
    ]);
  });

  it("does not expose accelerated Dragon choices", () => {
    expect(sicilianVariants.map((variant) => `${variant.id} ${variant.label}`.toLowerCase()).join(" ")).not.toContain("acceler");
    expect(sicilianRepertoire.some((line) => line.moves[3] === "b8c6" || line.moves[3] === "g7g6")).toBe(false);
    expect(sicilianRepertoire.filter((line) => line.id.includes("dragon")).every((line) => line.moves[3] === "d7d6")).toBe(true);
  });

  it("keeps the expanded anti-Sicilian coverage on the curated prefixes", () => {
    expect(sicilianRepertoire.filter((line) => !line.id.includes("dragon")).map((line) => line.id).sort()).toEqual([
      "sicilian-alapin-bishop-exchange",
      "sicilian-alapin-bishop-exchange-queens",
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
    expect(sicilianRepertoire.filter((line) => line.id.includes("closed")).every((line) =>
      line.moves[5] === "g8f6"
    )).toBe(true);
    expect(sicilianRepertoire.filter((line) => line.id.includes("closed")).every((line) =>
      !line.moves.includes("g8e7")
    )).toBe(true);
    expect(sicilianRepertoire.find((line) => line.id === "sicilian-moscow")?.moves.slice(0, 8).join(" ")).toBe(
      "e2e4 c7c5 g1f3 d7d6 f1b5 c8d7 b5d7 b8d7",
    );
    expect(sicilianRepertoire.find((line) => line.id === "sicilian-smith-morra")?.moves.slice(0, 8).join(" ")).toBe(
      "e2e4 c7c5 d2d4 c5d4 c2c3 g8f6 e4e5 f6d5",
    );
    expect(sicilianRepertoire.find((line) => line.id === "sicilian-bowdler")?.moves.slice(0, 10).join(" ")).toBe(
      "e2e4 c7c5 f1c4 d7d6 g1f3 g8f6 d2d3 b8c6 e1g1 g7g6",
    );
  });

  it("declines the Smith-Morra into the curated Alapin position", () => {
    const smithMorra = sicilianRepertoire.find((line) => line.id === "sicilian-smith-morra");
    const alapin = sicilianRepertoire.find((line) => line.id === "sicilian-alapin-central");
    expect(smithMorra).toBeDefined();
    expect(alapin).toBeDefined();

    const fenAfter = (moves: UciMove[]) => {
      const chess = new Chess();
      moves.forEach((uci) => chess.move(parseUci(uci)));
      return chess.fen().split(" ").slice(0, 4).join(" ");
    };

    expect(fenAfter(smithMorra?.moves.slice(0, 12) ?? [])).toBe(
      fenAfter(alapin?.moves.slice(0, 12) ?? []),
    );
    expect(smithMorra?.moves.slice(12)).toEqual(alapin?.moves.slice(12));
    expect(smithMorra?.moves).not.toContain("d4c3");
  });

  it("uses direct development and offers one genuine ending choice in the Alapin Bxd5 exchange", () => {
    const opening = curatedOpenings.find((candidate) => candidate.id === "sicilian") as OpeningRepertoire;
    const bishopExchange = opening.lines.find((line) => line.id === "sicilian-alapin-bishop-exchange");
    const queenfulExchange = opening.lines.find((line) => line.id === "sicilian-alapin-bishop-exchange-queens");

    expect(bishopExchange?.moves.slice(23, 28)).toEqual(["e7e5", "d4e3", "f8e7", "e1g1", "e8g8"]);
    expect(bishopExchange?.moves.slice(-14)).toEqual([
      "c3b5",
      "d6f6",
      "b5c7",
      "a8b8",
      "e3a7",
      "c8h3",
      "g2h3",
      "f6d6",
      "a7a5",
      "e7d8",
      "a5a3",
      "d6a3",
      "b2a3",
      "d8c7",
    ]);
    expect(bishopExchange?.moves).not.toContain("g7g6");
    expect(queenfulExchange?.moves.slice(0, 39)).toEqual(bishopExchange?.moves.slice(0, 39));
    expect(queenfulExchange?.moves.slice(-3)).toEqual(["d6c7", "c1d2", "f8e8"]);

    const selected = opening.lines.filter((line) => line.family === "Alapin bishop exchange");
    const session = createTrainingSession(
      opening.lines,
      selected,
      opening.playerColor,
      opening.moveOrderMoves,
      opening.positionEvaluations,
    );
    const beforeChoice = bishopExchange?.moves.slice(0, 39) ?? [];
    expect(sessionChoices(session, beforeChoice).map((choice) => choice.uci).sort()).toEqual(["d6a3", "d6c7"]);

    const queenfulReply = [...beforeChoice, "d6c7", "c1d2"] as UciMove[];
    expect(sessionChoices(session, queenfulReply).map((choice) => choice.uci)).toEqual(["f8e8"]);
    expect(sessionTarget(session, [...queenfulReply, "f8e8"])).toMatchObject({
      id: "sicilian-alapin-bishop-exchange-queens",
    });

    const queenlessReply = [...beforeChoice, "d6a3", "b2a3"] as UciMove[];
    expect(sessionChoices(session, queenlessReply).map((choice) => choice.uci)).toEqual(["d8c7"]);
    expect(sessionTarget(session, [...queenlessReply, "d8c7"])).toMatchObject({
      id: "sicilian-alapin-bishop-exchange",
    });
  });

  it.each(["sicilian-dragon-yugoslav", "sicilian-dragon-main"])(
    "%s requires castling before ...Nc6",
    (variantId) => {
      const opening = curatedOpenings.find((candidate) => candidate.id === "sicilian") as OpeningRepertoire;
      const selected = opening.lines.filter((candidate) => candidate.id === variantId);
      const session = createTrainingSession(
        opening.lines,
        selected,
        opening.playerColor,
        opening.moveOrderMoves,
        opening.positionEvaluations,
      );
      const beforeChoice = "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6 c1e3 f8g7 f2f3".split(" ") as UciMove[];

      expect(sessionChoices(session, beforeChoice).map((choice) => choice.uci)).toEqual(["e8g8"]);
      const afterCastle = [...beforeChoice, "e8g8", "d1d2"] as UciMove[];
      expect(sessionChoices(session, afterCastle).map((choice) => choice.uci)).toEqual(["b8c6"]);
    },
  );

  it("requires castling before ...Nc6 in the Closed Sicilian Nge2 and Nd5 line", () => {
    const opening = curatedOpenings.find((candidate) => candidate.id === "sicilian") as OpeningRepertoire;
    const selected = opening.lines.filter((candidate) => candidate.id === "sicilian-closed-nge2");
    const session = createTrainingSession(
      opening.lines,
      selected,
      opening.playerColor,
      opening.moveOrderMoves,
      opening.positionEvaluations,
    );
    const beforeChoice = "e2e4 c7c5 b1c3 d7d6 g2g3 g8f6 f1g2 g7g6 g1e2 f8g7 c3d5".split(" ") as UciMove[];

    expect(sessionChoices(session, beforeChoice).map((choice) => choice.uci)).toEqual(["e8g8"]);
    const afterCastle = [...beforeChoice, "e8g8", "e1g1"] as UciMove[];
    expect(sessionChoices(session, afterCastle).map((choice) => choice.uci)).toEqual(["b8c6"]);
  });

  it("does not generate adjacent setup-move alternatives in any repertoire", () => {
    expect(curatedOpenings.every((opening) => opening.moveOrderMoves.length === 0)).toBe(true);
  });

  it("keeps one Bowdler path with e4 defended before castling", () => {
    const opening = curatedOpenings.find((candidate) => candidate.id === "sicilian") as OpeningRepertoire;
    const selected = opening.lines.filter((candidate) => candidate.family === "Bowdler");
    const session = createTrainingSession(
      opening.lines,
      selected,
      opening.playerColor,
      opening.moveOrderMoves,
      opening.positionEvaluations,
    );
    const beforeChoice = "e2e4 c7c5 f1c4".split(" ") as UciMove[];

    expect(sessionChoices(session, beforeChoice).map((choice) => choice.uci)).toEqual(["d7d6"]);
    const afterWhiteKnight = [...beforeChoice, "d7d6", "g1f3"] as UciMove[];
    expect(sessionChoices(session, afterWhiteKnight).map((choice) => choice.uci)).toEqual(["g8f6"]);
    const afterDefence = [...afterWhiteKnight, "g8f6", "d2d3"] as UciMove[];
    expect(sessionChoices(session, afterDefence).map((choice) => choice.uci)).toEqual(["b8c6"]);
    const afterDevelopment = [...afterDefence, "b8c6", "e1g1"] as UciMove[];
    expect(sessionChoices(session, afterDevelopment).map((choice) => choice.uci)).toEqual(["g7g6"]);
    const afterFianchettoStart = [...afterDevelopment, "g7g6", "c2c3"] as UciMove[];
    expect(sessionChoices(session, afterFianchettoStart).map((choice) => choice.uci)).toEqual(["f8g7"]);
    const beforeBlackCastles = [...afterFianchettoStart, "f8g7", "f1e1"] as UciMove[];
    expect(sessionChoices(session, beforeBlackCastles).map((choice) => choice.uci)).toEqual(["e8g8"]);
    expect(sessionTarget(session, [...beforeBlackCastles, "e8g8"])).toMatchObject({ id: "sicilian-bowdler" });
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
