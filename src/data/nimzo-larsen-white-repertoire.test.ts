import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { parseUci, positionChoicesFor } from "@/lib/repertoire-engine";
import type { UciMove } from "@/lib/types";
import { nimzoLarsenWhiteRepertoire } from "./nimzo-larsen-white-repertoire";
import { nimzoLarsenWhiteVariants } from "./nimzo-larsen-white-variants";

const materialBalance = (chess: Chess) => {
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  return chess.board().flat().reduce(
    (balance, piece) => balance + (piece ? (piece.color === "w" ? 1 : -1) * values[piece.type] : 0),
    0,
  );
};

describe("Nimzo-Larsen White repertoire", () => {
  it.each(nimzoLarsenWhiteRepertoire.map((line) => [line.id, line]))("line %s contains only legal moves", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci} after ${chess.fen()}`).not.toThrow();
    }
    expect(line.moves.length).toBeGreaterThanOrEqual(18);
    expect(line.goal.plans).toHaveLength(3);
  });

  it.each(nimzoLarsenWhiteRepertoire.map((line) => [line.id, line]))("every White turn in %s is curated", (_, line) => {
    const history: UciMove[] = [];
    line.moves.forEach((move, index) => {
      if (index % 2 === 0) {
        expect(positionChoicesFor(history, nimzoLarsenWhiteRepertoire).map((choice) => choice.uci)).toContain(move);
      }
      history.push(move);
    });
  });

  it.each(nimzoLarsenWhiteRepertoire.map((line) => [line.id, line]))("%s preserves the video's opening core", (_, line) => {
    expect(line.moves[0]).toBe("b2b3");
    expect(line.moves).toEqual(expect.arrayContaining(["b2b3", "c1b2", "e2e3"]));
    expect(line.moves.indexOf("b2b3")).toBeLessThan(line.moves.indexOf("c1b2"));
    expect(line.moves.indexOf("c1b2")).toBeLessThan(line.moves.indexOf("e2e3"));
  });

  it("starts every exercise with 1.b3", () => {
    expect(new Set(nimzoLarsenWhiteRepertoire.map((line) => line.moves[0]))).toEqual(new Set(["b2b3"]));
  });

  it.each(nimzoLarsenWhiteRepertoire.map((line) => [line.id, line]))("%s has a complete static evaluation and never drops below -1.00 for White", (_, line) => {
    expect(line.evaluations).toHaveLength(line.moves.length + 1);
    line.evaluations?.forEach((score, index) => {
      expect(score, `${line.id}: static evaluation after ply ${index}`).toBeGreaterThanOrEqual(-100);
    });
  });

  it.each(nimzoLarsenWhiteRepertoire.map((line) => [line.id, line]))("%s never leaves White down a piece after White's move", (_, line) => {
    const chess = new Chess();
    line.moves.forEach((move, index) => {
      chess.move(parseUci(move));
      if (index % 2 === 0) {
        expect(materialBalance(chess), `${line.id}: material deficit after ${move}`).toBeGreaterThanOrEqual(-1);
      }
    });
  });

  it("covers every displayed family with at least two paths", () => {
    for (const variant of nimzoLarsenWhiteVariants) {
      expect(nimzoLarsenWhiteRepertoire.filter((line) => line.family === variant.family).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("keeps Bb5 out of the branch where ...c6 blocks it", () => {
    const c6Lines = nimzoLarsenWhiteRepertoire.filter((line) => line.family === "…c6 blocks Bb5");
    expect(c6Lines.every((line) => !line.moves.includes("f1b5"))).toBe(true);
  });

  it("orders and normalises approximate frequencies", () => {
    const probabilities = nimzoLarsenWhiteVariants.map((variant) => variant.probability);
    expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
    expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
  });
});
