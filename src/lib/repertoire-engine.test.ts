import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { repertoire } from "@/data/repertoire";
import { candidatesFor, choicesFor, parseUci, weightedChoice } from "./repertoire-engine";
import type { UciMove } from "./types";

describe("repertorio Caro-Kann", () => {
  it("contiene tutte le famiglie richieste", () => {
    expect(new Set(repertoire.map((line) => line.family))).toEqual(
      new Set(["Advance", "Classical", "Exchange", "Panov", "Fantasy", "Two Knights"]),
    );
  });

  it.each(repertoire.map((line) => [line.id, line]))("la linea %s contiene solo mosse legali", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      expect(() => chess.move(parseUci(uci)), `${line.id}: ${uci} dopo ${chess.fen()}`).not.toThrow();
    }
    expect(line.moves.length).toBeGreaterThanOrEqual(16);
    expect(line.goal.plans.length).toBeGreaterThanOrEqual(3);
  });

  it.each(repertoire.map((line) => [line.id, line]))("ogni turno nero di %s ha una risposta accettata", (_, line) => {
    const history: UciMove[] = [];
    line.moves.forEach((move, index) => {
      if (index % 2 === 1) {
        expect(choicesFor(history).map((choice) => choice.uci)).toContain(move);
      }
      history.push(move);
      expect(candidatesFor(history).map((candidate) => candidate.id)).toContain(line.id);
    });
  });

  it.each(repertoire.map((line) => [line.id, line]))("%s non gioca …e6 con l’alfiere ancora in c8", (_, line) => {
    const chess = new Chess();
    for (const uci of line.moves) {
      if (uci === "e7e6") {
        expect(chess.get("c8"), `${line.id}: …e6 rinchiude l’alfiere campochiaro`).not.toMatchObject({ type: "b", color: "b" });
      }
      chess.move(parseUci(uci));
    }
  });

  it("aggrega le alternative teoriche senza duplicati", () => {
    const afterAdvance = ["e2e4", "c7c6", "d2d4", "d7d5", "e4e5"] as UciMove[];
    const choices = choicesFor(afterAdvance);
    expect(choices.map((choice) => choice.uci).sort()).toEqual(["c6c5", "c8f5"]);
    expect(choices.find((choice) => choice.uci === "c8f5")?.lineIds.length).toBe(5);
  });

  it("propone la Tartakower come prima scelta nella Classica", () => {
    const afterNxe4 = ["e2e4", "c7c6", "d2d4", "d7d5", "b1c3", "d5e4", "c3e4"] as UciMove[];
    const classicalLines = repertoire.filter((line) => line.family === "Classical");
    expect(choicesFor(afterNxe4, classicalLines)[0].uci).toBe("g8f6");
    expect(choicesFor(afterNxe4, classicalLines).map((choice) => choice.uci)).toContain("c8f5");
  });

  it("nell’Advance con …Nc6 e dxc5 propone l’inchiodatura, non …e6", () => {
    const position = ["e2e4", "c7c6", "d2d4", "d7d5", "e4e5", "c6c5", "g1f3", "b8c6", "d4c5"] as UciMove[];
    const line = repertoire.filter((candidate) => candidate.id === "advance-c5-nf3-nc6");
    expect(choicesFor(position, line).map((choice) => choice.uci)).toEqual(["c8g4"]);
  });

  it("porta entrambe le linee Exchange oltre il cambio degli alfieri", () => {
    const exchangeLines = repertoire.filter((line) => line.family === "Exchange");
    expect(exchangeLines.every((line) => line.moves.length >= 22)).toBe(true);
    expect(exchangeLines.every((line) => line.moves.includes("f4d6"))).toBe(true);
  });

  it("limita le scelte alla famiglia selezionata", () => {
    const afterTwoMoves = ["e2e4", "c7c6", "d2d4", "d7d5"] as UciMove[];
    const fantasyLines = repertoire.filter((line) => line.family === "Fantasy");
    const advanceLines = repertoire.filter((line) => line.family === "Advance");
    expect(choicesFor(afterTwoMoves, fantasyLines).map((choice) => choice.uci)).toEqual(["f2f3"]);
    expect(choicesFor(afterTwoMoves, advanceLines).map((choice) => choice.uci)).toEqual(["e4e5"]);
  });

  it("separa l’Advance tra presa in c5 e difesa con c3", () => {
    const afterC5 = ["e2e4", "c7c6", "d2d4", "d7d5", "e4e5", "c6c5"] as UciMove[];
    const takes = repertoire.filter((line) => line.id === "advance-botvinnik");
    const defends = repertoire.filter((line) => ["advance-c5-c3-main", "advance-c5-c3-early"].includes(line.id));
    expect(choicesFor(afterC5, takes).map((choice) => choice.uci)).toEqual(["d4c5"]);
    expect(choicesFor(afterC5, defends).map((choice) => choice.uci)).toEqual(["c2c3"]);
  });

  it("mantiene le risposte nere come alternative dentro le linee bianche", () => {
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

  it("effettua una selezione pesata deterministica ai bordi", () => {
    const choices = [
      { uci: "e2e4" as UciMove, weight: 9, lineIds: ["a"] },
      { uci: "d2d4" as UciMove, weight: 1, lineIds: ["b"] },
    ];
    expect(weightedChoice(choices, () => 0)?.uci).toBe("e2e4");
    expect(weightedChoice(choices, () => 0.99)?.uci).toBe("d2d4");
    expect(weightedChoice([], () => 0)).toBeNull();
  });
});
