import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { openings } from "./openings";
import { chessFromHistory, createTrainingSession, positionKey, sessionChoices } from "@/lib/repertoire-engine";
import type { UciMove } from "@/lib/types";

describe("training session policies", () => {
  for (const opening of openings) {
    for (const variant of opening.variants) {
      it(`${opening.id} / ${variant.id} reaches a curated target without dead ends`, () => {
        const opponentLines = opening.lines.filter((line) =>
          variant.opponentLineIds?.includes(line.id) ?? line.family === variant.family,
        );
        const opponentLineIds = new Set(opponentLines.map((line) => line.id));
        const session = createTrainingSession(opening.lines, opponentLines, opening.playerColor, opening.moveOrderMoves);
        const startKey = positionKey(new Chess().fen());
        const pending = [startKey];
        const visited = new Set<string>();
        let targets = 0;
        let playerBranchPositions = 0;

        expect(opponentLines.length, "the menu variation must select internal lines").toBeGreaterThan(0);
        for (const move of opening.moveOrderMoves) {
          expect(opening.lines.some((line) => line.moves.includes(move)), `unused move-order move ${move}`).toBe(true);
        }
        for (const id of variant.opponentLineIds ?? []) {
          expect(opening.lines.some((line) => line.id === id), `unknown opponent line ${id}`).toBe(true);
        }
        expect(session.startIsLive, "the initial position must lead to a target").toBe(true);

        while (pending.length) {
          const key = pending.pop() as string;
          if (visited.has(key)) continue;
          visited.add(key);

          if (session.opponentGraph.terminalsByPosition.has(key)) {
            targets += 1;
            continue;
          }

          const isPlayerTurn = key.split(" ")[1] === opening.playerColor;
          const graph = isPlayerTurn ? session.allGraph : session.opponentGraph;
          const viableEdges = (graph.edgesByPosition.get(key) ?? [])
            .filter((edge) => session.livePositions.has(edge.nextKey));
          expect(viableEdges.length, `dead end at ${key}`).toBeGreaterThan(0);

          if (isPlayerTurn && viableEdges.length > 1) playerBranchPositions += 1;
          if (!isPlayerTurn) {
            for (const edge of viableEdges) {
              expect(edge.lineIds.every((id) => opponentLineIds.has(id)), `computer left ${variant.id}`).toBe(true);
            }
          }
          pending.push(...viableEdges.map((edge) => edge.nextKey));
        }

        expect(targets).toBeGreaterThan(0);
        expect(playerBranchPositions, `${variant.id} should offer a meaningful player choice`).toBeGreaterThan(0);

        const moveOrderMoves = new Set(opening.moveOrderMoves);
        const firstPlayerPly = opening.playerColor === "w" ? 0 : 1;
        for (const line of opponentLines) {
          for (let index = firstPlayerPly; index + 2 < line.moves.length; index += 2) {
            const firstMove = line.moves[index];
            const opponentMove = line.moves[index + 1];
            const secondMove = line.moves[index + 2];
            if (!moveOrderMoves.has(firstMove) || !moveOrderMoves.has(secondMove) || firstMove === secondMove) continue;

            const reordered = [...line.moves];
            reordered[index] = secondMove;
            reordered[index + 2] = firstMove;
            let reorderedKey: string;
            try {
              reorderedKey = positionKey(chessFromHistory(reordered).fen());
            } catch {
              continue;
            }
            if (reorderedKey !== positionKey(chessFromHistory(line.moves).fen())) continue;

            const prefix = line.moves.slice(0, index);
            expect(sessionChoices(session, prefix).map((choice) => choice.uci), `${line.id}: accept ${secondMove} first`).toContain(secondMove);
            const afterSecond = [...prefix, secondMove] as UciMove[];
            expect(sessionChoices(session, afterSecond).map((choice) => choice.uci), `${line.id}: preserve ${opponentMove}`).toContain(opponentMove);
            const afterReply = [...afterSecond, opponentMove] as UciMove[];
            expect(sessionChoices(session, afterReply).map((choice) => choice.uci), `${line.id}: accept ${firstMove} second`).toContain(firstMove);
          }
        }
      });
    }
  }

  it("accepts a natural bishop-first Caro-Kann Exchange move order", () => {
    const opening = openings.find((candidate) => candidate.id === "caro-kann");
    const opponentLines = opening?.lines.filter((line) => [
      "exchange-white-nf3-nc6",
      "exchange-nf3-nc6-bf5",
      "exchange-nf3-bg4",
      "exchange-white-nf3-nf6",
      "exchange-nf3-nf6-bf5",
    ].includes(line.id)) ?? [];
    const session = createTrainingSession(opening?.lines ?? [], opponentLines, "b", opening?.moveOrderMoves ?? []);
    const history = "e2e4 c7c6 d2d4 d7d5 e4d5 c6d5 g1f3".split(" ") as UciMove[];

    expect(sessionChoices(session, history).map((choice) => choice.uci)).toContain("c8f5");
    history.push("c8f5", "f1d3");
    expect(sessionChoices(session, history).map((choice) => choice.uci)).toContain("b8c6");
  });

  it("accepts ...Nf6 before ...d5 while preserving the selected Slav opponent family", () => {
    const opening = openings.find((candidate) => candidate.id === "slav-universal");
    const opponentLines = opening?.lines.filter((line) => line.family === "London") ?? [];
    const session = createTrainingSession(opening?.lines ?? [], opponentLines, "b", opening?.moveOrderMoves ?? []);
    const history = ["d2d4"] as UciMove[];

    expect(sessionChoices(session, history).map((choice) => choice.uci)).toContain("g8f6");
    history.push("g8f6");
    expect(sessionChoices(session, history).flatMap((choice) => choice.lineIds).every((id) => opponentLines.some((line) => line.id === id))).toBe(true);
    history.push("g1f3");
    expect(sessionChoices(session, history).map((choice) => choice.uci)).toContain("d7d5");
  });
});
