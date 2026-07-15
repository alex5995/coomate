import { describe, expect, it } from "vitest";
import { jobavaVariants } from "./jobava-variants";
import { openingById, openings, pickUniformVariant } from "./openings";

describe("repertoire selection", () => {
  it("assigns Black to the Caro-Kann and White to the Jobava", () => {
    expect(openingById("caro-kann")?.playerColor).toBe("b");
    expect(openingById("jobava-london")?.playerColor).toBe("w");
    expect(openingById("slav-universal")?.playerColor).toBe("b");
    expect(openings).toHaveLength(3);
  });

  it("selects random variations uniformly rather than using displayed frequency", () => {
    const step = 1 / jobavaVariants.length;

    jobavaVariants.forEach((variant, index) => {
      expect(pickUniformVariant(jobavaVariants, () => index * step + step / 2)).toEqual(variant);
    });
  });

  it("keeps the final item at the random generator's upper boundary", () => {
    expect(pickUniformVariant(jobavaVariants, () => 1)).toEqual(jobavaVariants.at(-1));
  });
});
