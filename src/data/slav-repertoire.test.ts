import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { candidatesFor, choicesFor, parseUci } from "@/lib/repertoire-engine";
import type { UciMove } from "@/lib/types";
import { slavRepertoire } from "./slav-repertoire";
import { slavVariants } from "./slav-variants";

describe("repertorio Slav universale", () => {
  it.each(slavRepertoire.map((line) => [line.id, line]))("la linea %s contiene solo mosse legali", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci} dopo ${chess.fen()}`).not.toThrow();
    }
    expect(line.moves.length).toBeGreaterThanOrEqual(16);
    expect(line.goal.plans).toHaveLength(3);
  });

  it.each(slavRepertoire.map((line) => [line.id, line]))("ogni turno nero di %s ha una risposta accettata", (_, line) => {
    const history: UciMove[] = [];
    line.moves.forEach((move, index) => {
      if (index % 2 === 1) {
        expect(choicesFor(history, slavRepertoire).map((choice) => choice.uci)).toContain(move);
      }
      history.push(move);
      expect(candidatesFor(history, slavRepertoire).map((candidate) => candidate.id)).toContain(line.id);
    });
  });

  it.each(slavRepertoire.map((line) => [line.id, line]))("%s non chiude l’alfiere c8 con …e6", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      if (uci === "e7e6") {
        expect(chess.get("c8"), `${line.id}: …e6 è arrivata con l’alfiere ancora in c8`).not.toMatchObject({ type: "b", color: "b" });
      }
      chess.move(parseUci(uci));
    }
  });

  it("non propone mai 1.e4 e varia davvero la prima mossa del Bianco", () => {
    const firstMoves = new Set(slavRepertoire.map((line) => line.moves[0]));
    expect(firstMoves).toEqual(new Set(["d2d4", "c2c4", "g1f3", "b2b3", "g2g3"]));
    expect(choicesFor([], slavRepertoire).map((choice) => choice.uci)).not.toContain("e2e4");
  });

  it("copre ogni famiglia mostrata nel menu", () => {
    for (const variant of slavVariants) {
      expect(slavRepertoire.filter((line) => line.family === variant.family).length).toBeGreaterThanOrEqual(2);
    }
  });

  it("ordina e normalizza le frequenze orientative", () => {
    const probabilities = slavVariants.map((variant) => variant.probability);
    expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
    expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
  });

  it("mantiene alternative pratiche del Nero dentro le famiglie", () => {
    const afterLondon = "d2d4 d7d5 g1f3 g8f6 c1f4".split(" ") as UciMove[];
    const londonLines = slavRepertoire.filter((line) => line.family === "London");
    expect(choicesFor(afterLondon, londonLines).map((choice) => choice.uci).sort()).toEqual(["c7c5", "c7c6"]);

    const afterJobava = "d2d4 d7d5 b1c3 g8f6 c1f4".split(" ") as UciMove[];
    const jobavaLines = slavRepertoire.filter((line) => line.family === "Jobava contro il Nero");
    expect(choicesFor(afterJobava, jobavaLines).map((choice) => choice.uci).sort()).toEqual(["a7a6", "c7c6", "c8f5"]);
  });
});
