import { describe, expect, it } from "vitest";
import {
  choicesFor,
  createTrainingSession,
  positionCandidatesFor,
  positionChoicesFor,
  positionKey,
  sessionChoices,
  sessionTarget,
  staticEvaluationFor,
  terminalLinesFor,
  weightedChoice,
} from "./repertoire-engine";
import type { RepertoireLine, UciMove } from "./types";

const testLine = (id: string, moves: UciMove[], evaluations?: number[]): RepertoireLine => ({
  id,
  name: id,
  family: "Test",
  weight: 1,
  moves,
  evaluations,
  goal: { title: "Test", plans: ["One", "Two", "Three"] },
});

describe("repertoire engine", () => {
  it("performs deterministic weighted selection at the boundaries", () => {
    const choices = [
      { uci: "e2e4" as UciMove, weight: 9, lineIds: ["a"] },
      { uci: "d2d4" as UciMove, weight: 1, lineIds: ["b"] },
    ];
    expect(weightedChoice(choices, () => 0)?.uci).toBe("e2e4");
    expect(weightedChoice(choices, () => 0.99)?.uci).toBe("d2d4");
    expect(weightedChoice([], () => 0)).toBeNull();
  });

  it("shares continuations between equivalent positions reached in different move orders", () => {
    const knightFirst = "d2d4 d7d5 g1f3 g8f6 c1f4 c7c5".split(" ") as UciMove[];
    const bishopFirst = "d2d4 d7d5 c1f4 g8f6 g1f3 c7c5".split(" ") as UciMove[];
    const line = testLine("bishop-first", bishopFirst);

    expect(choicesFor(knightFirst.slice(0, 5), [line])).toEqual([]);
    expect(positionChoicesFor(knightFirst.slice(0, 5), [line]).map((choice) => choice.uci)).toEqual(["c7c5"]);
    expect(positionCandidatesFor(knightFirst.slice(0, 5), [line])).toEqual([{ line, moveIndex: 5 }]);
  });

  it("recognises a target reached through a transposition", () => {
    const knightFirst = "d2d4 d7d5 g1f3 g8f6 c1f4 c7c5".split(" ") as UciMove[];
    const bishopFirst = "d2d4 d7d5 c1f4 g8f6 g1f3 c7c5".split(" ") as UciMove[];
    const line = testLine("bishop-first", bishopFirst);

    expect(terminalLinesFor(knightFirst, [line])).toEqual([line]);
  });

  it("uses all curated lines for the player but only variant lines for the opponent", () => {
    const bishopFirst = testLine("bishop-first", "d2d4 d7d5 c1f4 g8f6 g1f3 c7c5".split(" ") as UciMove[]);
    const knightFirst = testLine("knight-first", "d2d4 d7d5 g1f3 g8f6 c1f4 c7c5".split(" ") as UciMove[]);
    const offPolicy = testLine("off-policy", "d2d4 d7d5 g1f3 g8f6 c1f4 c7c6".split(" ") as UciMove[]);
    const deadPlayerBranch = testLine("dead-player-branch", "d2d4 d7d5 c2c4 e7e6 b1c3 g8f6".split(" ") as UciMove[]);
    const session = createTrainingSession(
      [bishopFirst, knightFirst, offPolicy, deadPlayerBranch],
      [bishopFirst, knightFirst],
      "w",
    );

    expect(session.startIsLive).toBe(true);
    expect(sessionChoices(session, "d2d4 d7d5".split(" ") as UciMove[]).map((choice) => choice.uci).sort()).toEqual(["c1f4", "g1f3"]);

    const transposed = "d2d4 d7d5 g1f3 g8f6 c1f4".split(" ") as UciMove[];
    expect(sessionChoices(session, transposed).map((choice) => choice.uci)).toEqual(["c7c5"]);
    expect(sessionTarget(session, [...transposed, "c7c5"])).toMatchObject({ id: "bishop-first" });
  });

  it("adds safe setup move orders without inflating curated weights", () => {
    const line = testLine(
      "setup-order",
      "d2d4 d7d5 c1f4 g8f6 g1f3 e7e6 e2e3 f8d6".split(" ") as UciMove[],
    );
    line.weight = 7;
    const session = createTrainingSession([line], [line], "w", ["c1f4", "g1f3", "e2e3"]);

    expect(sessionChoices(session, []).find((choice) => choice.uci === "d2d4")?.weight).toBe(7);
    const choices = sessionChoices(session, "d2d4 d7d5 c1f4 g8f6".split(" ") as UciMove[]);
    expect(choices.map((choice) => choice.uci).sort()).toEqual(["e2e3", "g1f3"]);
    expect(choices.every((choice) => choice.weight === 7)).toBe(true);
  });

  it("returns static evaluations from White's perspective for either trained color", () => {
    const line = testLine("evaluation", ["e2e4", "c7c5"], [40, 36, -25]);
    expect(staticEvaluationFor([], [line])).toBe(40);
    expect(staticEvaluationFor(["e2e4"], [line])).toBe(36);
    expect(staticEvaluationFor(["e2e4", "c7c5"], [line])).toBe(-25);
  });

  it("keeps rights in position keys while ignoring move clocks", () => {
    const board = "8/8/8/8/8/8/8/8";
    expect(positionKey(`${board} w KQ - 0 1`)).toBe(positionKey(`${board} w KQ - 42 99`));
    expect(positionKey(`${board} w KQ - 0 1`)).not.toBe(positionKey(`${board} w - - 0 1`));
    expect(positionKey(`${board} w - e3 0 1`)).not.toBe(positionKey(`${board} w - - 0 1`));
  });
});
