import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { choicesFor, parseUci } from "@/lib/repertoire-engine";
import type { UciMove } from "@/lib/types";
import { jobavaRepertoire } from "./jobava-repertoire";
import { jobavaVariants } from "./jobava-variants";

describe("Jobava London repertoire", () => {
  it.each(jobavaRepertoire.map((line) => [line.id, line]))("line %s contains only legal moves", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci} after ${chess.fen()}`).not.toThrow();
    }
    expect(line.moves.length).toBeGreaterThanOrEqual(16);
    expect(line.goal.plans.length).toBeGreaterThanOrEqual(3);
  });

  it.each(jobavaRepertoire.map((line) => [line.id, line]))("every White turn in %s has an accepted reply", (_, line) => {
    const history: UciMove[] = [];
    line.moves.forEach((move, index) => {
      if (index % 2 === 0) {
        expect(choicesFor(history, jobavaRepertoire).map((choice) => choice.uci)).toContain(move);
      }
      history.push(move);
    });
  });

  it("covers every variation displayed in the menu", () => {
    for (const variant of jobavaVariants) {
      expect(jobavaRepertoire.some((line) => line.family === variant.family)).toBe(true);
    }
  });

  it("orders and normalises approximate frequencies", () => {
    const probabilities = jobavaVariants.map((variant) => variant.probability);
    expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
    expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
  });

  it.each([
    ["immediate mirror", "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5"],
    ["mirror after e3", "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5 e2e3 e7e6"],
    ["Slav with a bishop on f5", "d2d4 d7d5 b1c3 g8f6 c1f4 c7c6 e2e3 c8f5"],
    ["Nc6 with a bishop on f5", "d2d4 d7d5 b1c3 g8f6 c1f4 b8c6 e2e3 c8f5"],
  ])("accepts the aggressive f3 plan against %s", (_, moves) => {
    const history = moves.split(" ") as UciMove[];
    expect(choicesFor(history, jobavaRepertoire).map((choice) => choice.uci)).toContain("f2f3");
  });

  it("accepts g4 after every curated Black reply to f3 in the mirror setup", () => {
    const history = "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5 f2f3".split(" ") as UciMove[];
    const blackReplies = choicesFor(history, jobavaRepertoire).map((choice) => choice.uci);

    expect(blackReplies.length).toBeGreaterThan(1);
    for (const reply of blackReplies) {
      expect(choicesFor([...history, reply], jobavaRepertoire).map((choice) => choice.uci)).toContain("g2g4");
    }
  });
});
