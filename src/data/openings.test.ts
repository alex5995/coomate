import { describe, expect, it } from "vitest";
import { londonVariants } from "./london-variants";
import { openingById, openings, pickUniformVariant } from "./openings";

describe("repertoire selection", () => {
  it("assigns the fixed player color for every repertoire", () => {
    expect(openingById("catalan")?.playerColor).toBe("w");
    expect(openingById("sicilian")?.playerColor).toBe("b");
    expect(openingById("grunfeld")?.playerColor).toBe("b");
    expect(openingById("caro-kann")?.playerColor).toBe("b");
    expect(openingById("london-system")?.playerColor).toBe("w");
    expect(openingById("slav-universal")?.playerColor).toBe("b");
    expect(openingById("nimzo-larsen-white")?.playerColor).toBe("w");
    expect(openingById("nimzo-larsen-black")?.playerColor).toBe("b");
    expect(openings.map((opening) => opening.id).slice(0, 3)).toEqual(["catalan", "sicilian", "grunfeld"]);
    expect(openings).toHaveLength(8);
    expect(openingById("catalan")?.variants).toHaveLength(10);
    expect(openingById("sicilian")?.variants).toHaveLength(5);
    expect(openingById("grunfeld")?.variants).toHaveLength(6);
    expect(openingById("caro-kann")?.variants).toHaveLength(12);
    expect(openingById("london-system")?.variants).toHaveLength(9);
    expect(openingById("slav-universal")?.variants).toHaveLength(10);
    expect(openingById("nimzo-larsen-white")?.variants).toHaveLength(7);
    expect(openingById("nimzo-larsen-black")?.variants).toHaveLength(8);
  });

  it("keeps each finite menu ordered and normalised", () => {
    for (const opening of openings) {
      const probabilities = opening.variants.map((variant) => variant.probability);
      expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
      expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
    }
  });

  it("selects random variations uniformly rather than using displayed frequency", () => {
    const step = 1 / londonVariants.length;

    londonVariants.forEach((variant, index) => {
      expect(pickUniformVariant(londonVariants, () => index * step + step / 2)).toEqual(variant);
    });
  });

  it("keeps the final item at the random generator's upper boundary", () => {
    expect(pickUniformVariant(londonVariants, () => 1)).toEqual(londonVariants.at(-1));
  });

  it("keeps every recorded position within one pawn for the trained side", () => {
    for (const opening of openings) {
      expect(opening.evaluation).toBeDefined();
      for (const line of opening.lines) {
        expect(line.evaluations, line.id).toHaveLength(line.moves.length + 1);
        for (const whiteScore of line.evaluations ?? []) {
          const userScore = opening.playerColor === "w" ? whiteScore : -whiteScore;
          expect(userScore, line.id).toBeGreaterThanOrEqual(-100);
        }
      }
    }
  });
});
