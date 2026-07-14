import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { choicesFor, parseUci } from "@/lib/repertoire-engine";
import type { UciMove } from "@/lib/types";
import { jobavaRepertoire } from "./jobava-repertoire";
import { jobavaVariants } from "./jobava-variants";

describe("repertorio Jobava London", () => {
  it.each(jobavaRepertoire.map((line) => [line.id, line]))("la linea %s contiene solo mosse legali", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci} dopo ${chess.fen()}`).not.toThrow();
    }
    expect(line.moves.length).toBeGreaterThanOrEqual(16);
    expect(line.goal.plans.length).toBeGreaterThanOrEqual(3);
  });

  it.each(jobavaRepertoire.map((line) => [line.id, line]))("ogni turno bianco di %s ha una risposta accettata", (_, line) => {
    const history: UciMove[] = [];
    line.moves.forEach((move, index) => {
      if (index % 2 === 0) {
        expect(choicesFor(history, jobavaRepertoire).map((choice) => choice.uci)).toContain(move);
      }
      history.push(move);
    });
  });

  it("copre tutte le varianti mostrate nel menu", () => {
    for (const variant of jobavaVariants) {
      expect(jobavaRepertoire.some((line) => line.family === variant.family)).toBe(true);
    }
  });

  it("ordina e normalizza le frequenze orientative", () => {
    const probabilities = jobavaVariants.map((variant) => variant.probability);
    expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
    expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
  });

  it.each([
    ["specchio immediato", "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5"],
    ["specchio dopo e3", "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5 e2e3 e7e6"],
    ["Slav con alfiere in f5", "d2d4 d7d5 b1c3 g8f6 c1f4 c7c6 e2e3 c8f5"],
    ["Nc6 con alfiere in f5", "d2d4 d7d5 b1c3 g8f6 c1f4 b8c6 e2e3 c8f5"],
  ])("accetta il piano aggressivo f3 contro %s", (_, moves) => {
    const history = moves.split(" ") as UciMove[];
    expect(choicesFor(history, jobavaRepertoire).map((choice) => choice.uci)).toContain("f2f3");
  });

  it("accetta g4 dopo ogni risposta nera prevista a f3 nello specchio", () => {
    const history = "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5 f2f3".split(" ") as UciMove[];
    const blackReplies = choicesFor(history, jobavaRepertoire).map((choice) => choice.uci);

    expect(blackReplies.length).toBeGreaterThan(1);
    for (const reply of blackReplies) {
      expect(choicesFor([...history, reply], jobavaRepertoire).map((choice) => choice.uci)).toContain("g2g4");
    }
  });
});
