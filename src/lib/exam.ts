import type { ExamLineResult, ExamLineStatus } from "@/lib/types";

export const shuffleExamVariants = (variantIds: string[], random = Math.random) => {
  const shuffled = [...variantIds];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [shuffled[index], shuffled[target]] = [shuffled[target], shuffled[index]];
  }
  return shuffled;
};

export const examLineStatus = (errors: number, revealed: boolean): ExamLineStatus => {
  if (revealed) return "review";
  return errors > 0 ? "passed" : "mastered";
};

export const revealedMovesPrompt = (moves: string[]) => moves.length === 1
  ? `Try this move: ${moves[0]}.`
  : `Try one of these moves: ${moves.join(", ")}.`;

export const summarizeExam = (results: ExamLineResult[]) => {
  const correctMoves = results.reduce((total, result) => total + result.correctMoves, 0);
  const firstTryMoves = results.reduce((total, result) => total + result.firstTryMoves, 0);
  return {
    mastered: results.filter((result) => result.status === "mastered").length,
    passed: results.filter((result) => result.status === "passed").length,
    review: results.filter((result) => result.status === "review").length,
    errors: results.reduce((total, result) => total + result.errors, 0),
    correctMoves,
    firstTryMoves,
    accuracy: correctMoves ? Math.round((firstTryMoves / correctMoves) * 100) : 100,
    reviewVariantIds: results
      .filter((result) => result.status !== "mastered")
      .map((result) => result.variantId),
  };
};
