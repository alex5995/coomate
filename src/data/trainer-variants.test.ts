import { describe, expect, it } from "vitest";
import { pickRandomVariant, trainerVariants } from "./trainer-variants";

describe("selettore delle varianti", () => {
  it("ordina le schede dalla frequenza stimata più alta alla più bassa", () => {
    const probabilities = trainerVariants.map((variant) => variant.probability);
    expect(probabilities).toEqual([...probabilities].sort((a, b) => b - a));
    expect(probabilities.reduce((sum, probability) => sum + probability, 0)).toBe(100);
  });

  it("assegna a ogni variante un intervallo casuale della stessa ampiezza", () => {
    const selectedIds = trainerVariants.map((_, index) =>
      pickRandomVariant(() => (index + 0.5) / trainerVariants.length).id,
    );
    expect(selectedIds).toEqual(trainerVariants.map((variant) => variant.id));
  });

  it("mantiene il casuale indipendente dalle frequenze mostrate", () => {
    expect(pickRandomVariant(() => 0).id).toBe(trainerVariants[0].id);
    expect(pickRandomVariant(() => 0.999999).id).toBe(trainerVariants.at(-1)?.id);
  });
});
