import { describe, expect, it } from "vitest";
import { examLineStatus, revealedMovesPrompt, shuffleExamVariants, summarizeExam } from "./exam";

describe("repertoire exams", () => {
  it("shuffles a copy while keeping every variation exactly once", () => {
    const original = ["a", "b", "c", "d"];
    const shuffled = shuffleExamVariants(original, () => 0);

    expect(shuffled).toEqual(["b", "c", "d", "a"]);
    expect(original).toEqual(["a", "b", "c", "d"]);
    expect(new Set(shuffled)).toEqual(new Set(original));
  });

  it("classifies lines by mistakes and revealed continuations", () => {
    expect(examLineStatus(0, false)).toBe("mastered");
    expect(examLineStatus(1, false)).toBe("passed");
    expect(examLineStatus(2, true)).toBe("review");
  });

  it("uses singular and plural copy for revealed moves", () => {
    expect(revealedMovesPrompt(["Qb3"])).toBe("Try this move: Qb3.");
    expect(revealedMovesPrompt(["Qxc7", "Qxa3"])).toBe("Try one of these moves: Qxc7, Qxa3.");
  });

  it("summarizes first-try accuracy and every non-mastered variation", () => {
    expect(summarizeExam([
      { variantId: "one", status: "mastered", errors: 0, correctMoves: 4, firstTryMoves: 4 },
      { variantId: "two", status: "passed", errors: 1, correctMoves: 3, firstTryMoves: 2 },
      { variantId: "three", status: "review", errors: 2, correctMoves: 3, firstTryMoves: 2 },
    ])).toEqual({
      mastered: 1,
      passed: 1,
      review: 1,
      errors: 3,
      correctMoves: 10,
      firstTryMoves: 8,
      accuracy: 80,
      reviewVariantIds: ["two", "three"],
    });
  });
});
