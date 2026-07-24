import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { repertoire } from "@/data/repertoire";
import { candidatesFor, choicesFor, createTrainingSession, parseUci, positionCandidatesFor, positionChoicesFor, positionKey, sessionChoices, sessionTarget, terminalLinesFor, weightedChoice } from "./repertoire-engine";
import type { RepertoireLine, UciMove } from "./types";

const testLine = (id: string, moves: UciMove[]): RepertoireLine => ({
  id,
  name: id,
  family: "Test",
  weight: 1,
  moves,
  goal: { title: "Test", plans: ["One", "Two", "Three"] },
});

describe("Caro-Kann repertoire", () => {
  it("contains every required family", () => {
    expect(new Set(repertoire.map((line) => line.family))).toEqual(
      new Set(["Advance", "Classical", "Exchange", "Panov", "Fantasy", "Two Knights"]),
    );
  });

  it.each(repertoire.map((line) => [line.id, line]))("line %s contains only legal moves", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci} after ${chess.fen()}`).not.toThrow();
    }
    expect(line.moves.length).toBeGreaterThanOrEqual(16);
    expect(line.goal.plans.length).toBeGreaterThanOrEqual(3);
  });

  it.each(repertoire.map((line) => [line.id, line]))("every Black turn in %s has an accepted reply", (_, line) => {
    const history: UciMove[] = [];
    line.moves.forEach((move, index) => {
      if (index % 2 === 1) {
        expect(choicesFor(history).map((choice) => choice.uci)).toContain(move);
      }
      history.push(move);
      expect(candidatesFor(history).map((candidate) => candidate.id)).toContain(line.id);
    });
  });

  it.each(repertoire.map((line) => [line.id, line]))("%s does not play …e6 while the bishop is still on c8", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      if (uci === "e7e6") {
        if (line.id !== "advance-takes-e6") {
          expect(chess.get("c8"), `${line.id}: …e6 traps the light-squared bishop`).not.toMatchObject({ type: "b", color: "b" });
        }
      }
      chess.move(parseUci(uci));
    }
  });

  it("aggregates theoretical alternatives without duplicates", () => {
    const afterAdvance = ["e2e4", "c7c6", "d2d4", "d7d5", "e4e5"] as UciMove[];
    const choices = choicesFor(afterAdvance);
    expect(choices.map((choice) => choice.uci).sort()).toEqual(["c6c5", "c8f5"]);
    expect(choices.find((choice) => choice.uci === "c8f5")?.lineIds.length).toBeGreaterThan(5);
  });

  it("offers the Tartakower as the first Classical choice", () => {
    const afterNxe4 = ["e2e4", "c7c6", "d2d4", "d7d5", "b1c3", "d5e4", "c3e4"] as UciMove[];
    const classicalLines = repertoire.filter((line) => line.family === "Classical");
    expect(choicesFor(afterNxe4, classicalLines)[0].uci).toBe("g8f6");
    expect(choicesFor(afterNxe4, classicalLines).map((choice) => choice.uci)).toContain("c8f5");
  });

  it("offers the pin instead of …e6 in the Advance with …Nc6 and dxc5", () => {
    const position = ["e2e4", "c7c6", "d2d4", "d7d5", "e4e5", "c6c5", "g1f3", "b8c6", "d4c5"] as UciMove[];
    const line = repertoire.filter((candidate) => candidate.id === "advance-c5-nf3-nc6");
    expect(choicesFor(position, line).map((choice) => choice.uci)).toEqual(["c8g4"]);
  });

  it("takes both Exchange lines beyond the bishop exchange", () => {
    const exchangeLines = repertoire.filter((line) => line.family === "Exchange");
    expect(exchangeLines.every((line) => line.moves.length >= 22)).toBe(true);
    expect(exchangeLines.every((line) => line.moves.includes("f4d6"))).toBe(true);
  });

  it("limits choices to the selected family", () => {
    const afterTwoMoves = ["e2e4", "c7c6", "d2d4", "d7d5"] as UciMove[];
    const fantasyLines = repertoire.filter((line) => line.family === "Fantasy");
    const advanceLines = repertoire.filter((line) => line.family === "Advance");
    expect(choicesFor(afterTwoMoves, fantasyLines).map((choice) => choice.uci)).toEqual(["f2f3"]);
    expect(choicesFor(afterTwoMoves, advanceLines).map((choice) => choice.uci)).toEqual(["e4e5"]);
  });

  it("separates the Advance between taking on c5 and defending with c3", () => {
    const afterC5 = ["e2e4", "c7c6", "d2d4", "d7d5", "e4e5", "c6c5"] as UciMove[];
    const takes = repertoire.filter((line) => line.id === "advance-botvinnik");
    const defends = repertoire.filter((line) => ["advance-c5-c3-main", "advance-c5-c3-early"].includes(line.id));
    expect(choicesFor(afterC5, takes).map((choice) => choice.uci)).toEqual(["d4c5"]);
    expect(choicesFor(afterC5, defends).map((choice) => choice.uci)).toEqual(["c2c3"]);
  });

  it("keeps Black replies as alternatives inside White's lines", () => {
    const afterAdvance = ["e2e4", "c7c6", "d2d4", "d7d5", "e4e5"] as UciMove[];
    const nf3Advance = repertoire.filter((line) => ["advance-main", "advance-c5-nf3-capture", "advance-c5-nf3-nc6", "advance-c5-nf3-bg4"].includes(line.id));
    expect(choicesFor(afterAdvance, nf3Advance).map((choice) => choice.uci).sort()).toEqual(["c6c5", "c8f5"]);

    const afterNxe4 = ["e2e4", "c7c6", "d2d4", "d7d5", "b1c3", "d5e4", "c3e4"] as UciMove[];
    const nc3Classical = repertoire.filter((line) => ["classical-main", "classical-tartakower"].includes(line.id));
    expect(choicesFor(afterNxe4, nc3Classical).map((choice) => choice.uci).sort()).toEqual(["c8f5", "g8f6"]);

    const afterExchangeNf3 = ["e2e4", "c7c6", "d2d4", "d7d5", "e4d5", "c6d5", "g1f3"] as UciMove[];
    const nf3Exchange = repertoire.filter((line) => line.id.startsWith("exchange-white-nf3"));
    expect(choicesFor(afterExchangeNf3, nf3Exchange).map((choice) => choice.uci).sort()).toEqual(["b8c6", "g8f6"]);

    const afterTwoKnights = ["e2e4", "c7c6", "b1c3", "d7d5", "g1f3"] as UciMove[];
    const twoKnights = repertoire.filter((line) => line.family === "Two Knights");
    expect(choicesFor(afterTwoKnights, twoKnights).map((choice) => choice.uci).sort()).toEqual(["c8g4", "g8f6"]);
  });

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
      "classical-london",
      "d2d4 d7d5 c1f4 g8f6 g1f3 e7e6 e2e3 f8d6".split(" ") as UciMove[],
    );
    line.weight = 7;
    const session = createTrainingSession([line], [line], "w", ["c1f4", "g1f3", "e2e3"]);

    expect(sessionChoices(session, []).find((choice) => choice.uci === "d2d4")?.weight).toBe(7);
    const choices = sessionChoices(session, "d2d4 d7d5 c1f4 g8f6".split(" ") as UciMove[]);
    expect(choices.map((choice) => choice.uci).sort()).toEqual(["e2e3", "g1f3"]);
    expect(choices.every((choice) => choice.weight === 7)).toBe(true);
  });

  it("keeps rights in position keys while ignoring move clocks", () => {
    const board = "8/8/8/8/8/8/8/8";
    expect(positionKey(`${board} w KQ - 0 1`)).toBe(positionKey(`${board} w KQ - 42 99`));
    expect(positionKey(`${board} w KQ - 0 1`)).not.toBe(positionKey(`${board} w - - 0 1`));
    expect(positionKey(`${board} w - e3 0 1`)).not.toBe(positionKey(`${board} w - - 0 1`));
  });
});
