import { describe, expect, it } from "vitest";
import { jobavaVariants } from "./jobava-variants";
import { openingById, openings, pickUniformVariant } from "./openings";

describe("selezione dei repertori", () => {
  it("assegna il Nero alla Caro-Kann e il Bianco al Jobava", () => {
    expect(openingById("caro-kann")?.playerColor).toBe("b");
    expect(openingById("jobava-london")?.playerColor).toBe("w");
    expect(openingById("slav-universal")?.playerColor).toBe("b");
    expect(openings).toHaveLength(3);
  });

  it("sceglie la variante casuale in modo uniforme, non in base alla frequenza mostrata", () => {
    const step = 1 / jobavaVariants.length;

    jobavaVariants.forEach((variant, index) => {
      expect(pickUniformVariant(jobavaVariants, () => index * step + step / 2)).toEqual(variant);
    });
  });

  it("mantiene l'ultimo elemento anche al limite superiore del generatore casuale", () => {
    expect(pickUniformVariant(jobavaVariants, () => 1)).toEqual(jobavaVariants.at(-1));
  });
});
