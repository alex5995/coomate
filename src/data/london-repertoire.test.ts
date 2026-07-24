import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { createTrainingSession, parseUci, positionChoicesFor, sessionChoices } from "@/lib/repertoire-engine";
import type { UciMove } from "@/lib/types";
import { londonGuidanceFor, londonRepertoire } from "./london-repertoire";
import { londonVariants } from "./london-variants";
import { openingById } from "./openings";

describe("London System repertoire", () => {
  it.each(londonRepertoire.map((line) => [line.id, line]))("line %s contains only legal moves", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci} after ${chess.fen()}`).not.toThrow();
    }
    expect(line.moves.length).toBeGreaterThanOrEqual(20);
    expect(line.goal.plans.length).toBeGreaterThanOrEqual(3);
  });

  it.each(londonRepertoire.map((line) => [line.id, line]))("every White turn in %s is curated", (_, line) => {
    const history: UciMove[] = [];
    line.moves.forEach((move, index) => {
      if (index % 2 === 0) {
        expect(positionChoicesFor(history, londonRepertoire).map((choice) => choice.uci)).toContain(move);
      }
      history.push(move);
    });
  });

  it("covers every displayed variation with at least two internal paths", () => {
    for (const variant of londonVariants) {
      expect(londonRepertoire.filter((line) => line.family === variant.family).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("orders and normalises approximate frequencies", () => {
    const probabilities = londonVariants.map((variant) => variant.probability);
    expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
    expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
  });

  it.each(londonRepertoire.map((line) => [line.id, line]))("%s preserves the normal London core", (_, line) => {
    expect(line.moves).toEqual(expect.arrayContaining(["d2d4", "g1f3", "c1f4", "e2e3", "e1g1"]));
    expect(line.moves).not.toContain("f2f3");
    expect(line.moves).not.toContain("g2g4");
    expect(line.moves).not.toContain("e1c1");
  });

  it("uses both standard Bf4/Nf3 move orders in every family", () => {
    for (const variant of londonVariants) {
      const lines = londonRepertoire.filter((line) => line.family === variant.family);
      expect(lines.some((line) => line.moves.indexOf("c1f4") < line.moves.indexOf("g1f3")), variant.family).toBe(true);
      expect(lines.some((line) => line.moves.indexOf("g1f3") < line.moves.indexOf("c1f4")), variant.family).toBe(true);
    }
  });

  it("does not force Nc3 against the early Qb6 pressure", () => {
    const nc3Lines = londonRepertoire.filter((line) => line.moves.includes("b1c3"));
    expect(nc3Lines).toHaveLength(0);
  });

  it("trains both the e4 break and a King's Indian setup with …d6", () => {
    expect(londonRepertoire.some((line) => line.moves.includes("e3e4"))).toBe(true);
    expect(londonRepertoire.some((line) => line.family === "Fianchetto …g6" && line.moves.includes("d7d6"))).toBe(true);
  });

  it("treats ...Bxf4 exf4 as a healthy London structure in every compatible family", () => {
    const exchangeLines = londonRepertoire.filter((line) => line.moves.includes("d6f4"));
    expect(exchangeLines).toHaveLength(6);
    expect(new Set(exchangeLines.map((line) => line.family))).toEqual(new Set([
      "Classical …e6/…Bd6",
      "Slav …c6",
      "Mirror …Bf5",
      "Chigorin …Nc6",
      "Pin …Bg4",
    ]));

    for (const line of exchangeLines) {
      const captureIndex = line.moves.indexOf("d6f4");
      expect(line.moves[captureIndex + 1], `${line.id}: recapture immediately`).toBe("e3f4");
      const chess = new Chess();
      for (const move of line.moves.slice(0, captureIndex + 2)) chess.move(parseUci(move));
      expect(chess.get("f2")).toMatchObject({ type: "p", color: "w" });
      expect(chess.get("f4")).toMatchObject({ type: "p", color: "w" });
      expect(chess.get("e3")).toBeUndefined();
    }

    expect(londonGuidanceFor(["e3f4"]).explanation).toMatch(/doubled f-pawns.*controls e5.*e-file/i);
  });

  it("accepts 3.e3 before Nf3 in the Classical London while Black stays in the selected variation", () => {
    const opening = openingById("london-system");
    expect(opening).not.toBeNull();
    const family = "Classical …e6/…Bd6";
    const opponentLines = londonRepertoire.filter((line) => line.family === family);
    const session = createTrainingSession(
      londonRepertoire,
      opponentLines,
      "w",
      opening?.moveOrderMoves ?? [],
    );
    const history = "d2d4 d7d5 c1f4 g8f6".split(" ") as UciMove[];

    expect(sessionChoices(session, history).map((choice) => choice.uci)).toEqual(expect.arrayContaining(["e2e3", "g1f3"]));
    history.push("e2e3");
    expect(sessionChoices(session, history).map((choice) => choice.uci)).toContain("e7e6");
    history.push("e7e6");
    expect(sessionChoices(session, history).map((choice) => choice.uci)).toContain("g1f3");
    history.push("g1f3");
    expect(sessionChoices(session, history).map((choice) => choice.uci)).toContain("f8d6");
  });

  it("accepts both normal setup moves before ...Bxf4 and then requires exf4", () => {
    const opening = openingById("london-system");
    const opponentLines = londonRepertoire.filter((line) => line.family === "Classical …e6/…Bd6");
    const opponentLineIds = new Set(opponentLines.map((line) => line.id));
    const session = createTrainingSession(londonRepertoire, opponentLines, "w", opening?.moveOrderMoves ?? []);
    const screenshotHistory = "d2d4 d7d5 c1f4 g8f6 e2e3 e7e6 g1f3 f8d6".split(" ") as UciMove[];

    expect(sessionChoices(session, screenshotHistory).map((choice) => choice.uci)).toEqual(
      expect.arrayContaining(["c2c3", "f1d3"]),
    );
    expect(opening?.moveOrderMoves).not.toContain("e3f4");

    for (const waitingMove of ["c2c3", "f1d3"] as UciMove[]) {
      const afterWaitingMove = [...screenshotHistory, waitingMove];
      const blackChoices = sessionChoices(session, afterWaitingMove);
      expect(blackChoices.map((choice) => choice.uci)).toEqual(["d6f4"]);
      expect(blackChoices.flatMap((choice) => choice.lineIds).every((id) => opponentLineIds.has(id))).toBe(true);

      const afterCapture = [...afterWaitingMove, "d6f4"] as UciMove[];
      expect(sessionChoices(session, afterCapture).map((choice) => choice.uci)).toEqual(["e3f4"]);

      const afterRecapture = [...afterCapture, "e3f4"] as UciMove[];
      expect(sessionChoices(session, afterRecapture).map((choice) => choice.uci)).toContain("e8g8");
    }
  });

  it("does not confuse move-order flexibility with free play", () => {
    const opening = openingById("london-system");
    const opponentLines = londonRepertoire.filter((line) => line.family === "Classical …e6/…Bd6");
    const session = createTrainingSession(londonRepertoire, opponentLines, "w", opening?.moveOrderMoves ?? []);
    const afterBf4 = "d2d4 d7d5 c1f4 g8f6".split(" ") as UciMove[];
    const beforeBf4 = "d2d4 d7d5 g1f3 g8f6".split(" ") as UciMove[];

    expect(sessionChoices(session, afterBf4).map((choice) => choice.uci)).not.toEqual(expect.arrayContaining(["c2c4", "g2g3"]));
    expect(sessionChoices(session, beforeBf4).map((choice) => choice.uci)).not.toContain("e2e3");
  });

  it("still requires a curated tactical recapture before returning to setup moves", () => {
    const opening = openingById("london-system");
    const opponentLines = londonRepertoire.filter((line) => line.family === "Early …c5/…Qb6");
    const session = createTrainingSession(londonRepertoire, opponentLines, "w", opening?.moveOrderMoves ?? []);
    const history = "d2d4 d7d5 c1f4 c7c5 e2e3 b8c6 c2c3 g8f6 b1d2 d8b6 d1b3 b6b3 a2b3 c5d4".split(" ") as UciMove[];

    expect(sessionChoices(session, history).map((choice) => choice.uci)).toEqual(["e3d4"]);
  });
});
