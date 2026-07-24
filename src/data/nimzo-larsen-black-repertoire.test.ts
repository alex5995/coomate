import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { choicesFor, parseUci } from "@/lib/repertoire-engine";
import type { UciMove } from "@/lib/types";
import { nimzoLarsenBlackRepertoire } from "./nimzo-larsen-black-repertoire";
import { nimzoLarsenBlackVariants } from "./nimzo-larsen-black-variants";

const materialBalance = (chess: Chess) => {
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  return chess.board().flat().reduce(
    (balance, piece) => balance + (piece ? (piece.color === "w" ? 1 : -1) * values[piece.type] : 0),
    0,
  );
};

describe("Nimzo-Larsen Black repertoire", () => {
  it.each(nimzoLarsenBlackRepertoire.map((line) => [line.id, line]))("line %s contains only legal moves", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci} after ${chess.fen()}`).not.toThrow();
    }
    expect(line.moves.length).toBeGreaterThanOrEqual(18);
    expect(line.goal.plans).toHaveLength(3);
  });

  it.each(nimzoLarsenBlackRepertoire.map((line) => [line.id, line]))("every Black turn in %s is curated", (_, line) => {
    const history: UciMove[] = [];
    line.moves.forEach((move, index) => {
      if (index % 2 === 1) {
        expect(choicesFor(history, nimzoLarsenBlackRepertoire).map((choice) => choice.uci)).toContain(move);
      }
      history.push(move);
    });
  });

  it.each(nimzoLarsenBlackRepertoire.map((line) => [line.id, line]))("%s preserves the reversed opening core", (_, line) => {
    expect(line.moves[1]).toBe("b7b6");
    expect(line.moves).toEqual(expect.arrayContaining(["b7b6", "c8b7", "e7e6"]));
    expect(line.moves.indexOf("b7b6")).toBeLessThan(line.moves.indexOf("c8b7"));
    expect(line.moves.indexOf("c8b7")).toBeLessThan(line.moves.indexOf("e7e6"));
  });

  it.each(nimzoLarsenBlackRepertoire.map((line) => [line.id, line]))("%s develops the c8 bishop before ...e6", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      if (uci === "e7e6") {
        expect(chess.get("c8"), `${line.id}: ...e6 was played while the bishop was still on c8`).not.toMatchObject({ type: "b", color: "b" });
      }
      chess.move(parseUci(uci));
    }
  });

  it("covers the intended first-move families", () => {
    expect(new Set(nimzoLarsenBlackRepertoire.map((line) => line.moves[0]))).toEqual(
      new Set(["d2d4", "e2e4", "c2c4", "g1f3", "b2b3"]),
    );
  });

  it.each(nimzoLarsenBlackRepertoire.map((line) => [line.id, line]))("%s has a complete static evaluation and never drops below -1.00 for Black", (_, line) => {
    expect(line.evaluations).toHaveLength(line.moves.length + 1);
    line.evaluations?.forEach((whiteScore, index) => {
      expect(-whiteScore, `${line.id}: static evaluation after ply ${index}`).toBeGreaterThanOrEqual(-100);
    });
  });

  it.each(nimzoLarsenBlackRepertoire.map((line) => [line.id, line]))("%s never leaves Black down a piece after Black's move", (_, line) => {
    const chess = new Chess();
    line.moves.forEach((move, index) => {
      chess.move(parseUci(move));
      if (index % 2 === 1) {
        expect(materialBalance(chess), `${line.id}: material deficit after ${move}`).toBeLessThanOrEqual(1);
      }
    });
  });

  it("covers every displayed family with at least two paths", () => {
    for (const variant of nimzoLarsenBlackVariants) {
      expect(nimzoLarsenBlackRepertoire.filter((line) => line.family === variant.family).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("orders and normalises approximate frequencies", () => {
    const probabilities = nimzoLarsenBlackVariants.map((variant) => variant.probability);
    expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
    expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
  });
});
