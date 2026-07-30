import { Chess } from "chess.js";
import { describe, expect, it } from "vitest";
import { openings } from "./openings";
import { createTrainingSession, positionKey } from "@/lib/repertoire-engine";

describe("training session policies", () => {
  for (const opening of openings) {
    for (const variant of opening.variants) {
      it(`${opening.id} / ${variant.id} reaches a curated target without dead ends`, () => {
        const opponentLines = opening.lines.filter((line) =>
          variant.opponentLineIds?.includes(line.id) ?? line.family === variant.family,
        );
        const opponentLineIds = new Set(opponentLines.map((line) => line.id));
        const session = createTrainingSession(opening.lines, opponentLines, opening.playerColor, opening.moveOrderMoves, opening.positionEvaluations);
        const startKey = positionKey(new Chess().fen());
        const pending = [startKey];
        const visited = new Set<string>();
        let targets = 0;
        let playerBranchPositions = 0;
        let opponentBranchPositions = 0;

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
            if (viableEdges.length > 1) opponentBranchPositions += 1;
            for (const edge of viableEdges) {
              expect(edge.lineIds.every((id) => opponentLineIds.has(id)), `computer left ${variant.id}`).toBe(true);
            }
          }
          pending.push(...viableEdges.map((edge) => edge.nextKey));
        }

        expect(targets).toBeGreaterThan(0);
        const expectedPlayerBranches = variant.id === "sicilian-alapin-bishop-exchange" ? 1 : 0;
        expect(playerBranchPositions, `${variant.id} has an unexpected user-side choice`).toBe(expectedPlayerBranches);
        expect(opponentBranchPositions, `${variant.id} mixes multiple opponent continuations`).toBe(0);
      });
    }
  }

});
