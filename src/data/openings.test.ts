import { describe, expect, it } from "vitest";
import { catalanVariants } from "./catalan-variants";
import { openingById, openings, pickUniformVariant } from "./openings";

describe("repertoire selection", () => {
  it("assigns the fixed player color for every repertoire", () => {
    expect(openingById("catalan")?.playerColor).toBe("w");
    expect(openingById("sicilian")?.playerColor).toBe("b");
    expect(openingById("grunfeld")?.playerColor).toBe("b");
    expect(openings.map((opening) => opening.id)).toEqual(["catalan", "sicilian", "grunfeld"]);
    expect(openings).toHaveLength(3);
    expect(openingById("catalan")?.variants).toHaveLength(10);
    expect(openingById("sicilian")?.variants).toHaveLength(11);
    expect(openingById("grunfeld")?.variants).toHaveLength(6);
  });

  it("keeps each finite menu ordered and normalised", () => {
    for (const opening of openings) {
      const probabilities = opening.variants.map((variant) => variant.probability);
      expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
      expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
    }
  });

  it("selects random variations uniformly rather than using displayed frequency", () => {
    const step = 1 / catalanVariants.length;

    catalanVariants.forEach((variant, index) => {
      expect(pickUniformVariant(catalanVariants, () => index * step + step / 2)).toEqual(variant);
    });
  });

  it("keeps the final item at the random generator's upper boundary", () => {
    expect(pickUniformVariant(catalanVariants, () => 1)).toEqual(catalanVariants.at(-1));
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

  it("keeps all user-facing repertoire copy independent from source studies", () => {
    for (const opening of openings) {
      const copy = [
        opening.name,
        opening.description,
        opening.startMessage,
        ...opening.variants.flatMap((variant) => [variant.label, variant.description]),
        ...opening.lines.flatMap((line) => [
          line.goal.title,
          ...line.goal.plans,
          ...line.moves.flatMap((move) => {
            const guidance = opening.guidanceFor([move]);
            return [guidance.hint, guidance.explanation];
          }),
        ]),
      ].join(" ");
      expect(copy).not.toMatch(/\b(?:study|lichess|source|documented)\b/i);
    }
  });
});
