import { describe, expect, it } from "vitest";
import { pickRandomVariant, trainerVariants } from "./trainer-variants";

describe("variation selector", () => {
  it("orders cards from the highest estimated frequency to the lowest", () => {
    const probabilities = trainerVariants.map((variant) => variant.probability);
    expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
    expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
  });

  it("assigns every variation a random interval of equal width", () => {
    const selectedIds = trainerVariants.map((_, index) =>
      pickRandomVariant(() => (index + 0.5) / trainerVariants.length).id,
    );
    expect(selectedIds).toEqual(trainerVariants.map((variant) => variant.id));
  });

  it("keeps random selection independent from displayed frequencies", () => {
    expect(pickRandomVariant(() => 0).id).toBe(trainerVariants[0].id);
    expect(pickRandomVariant(() => 0.999999).id).toBe(trainerVariants.at(-1)?.id);
  });
});
