import { Chess, type Square } from "chess.js";
import { repertoire } from "@/data/repertoire";
import type { MoveChoice, RepertoireLine, UciMove } from "@/lib/types";

export const isPrefix = (history: UciMove[], line: RepertoireLine) =>
  history.every((move, index) => line.moves[index] === move);

export const candidatesFor = (history: UciMove[], lines = repertoire) =>
  lines.filter((line) => isPrefix(history, line));

export const choicesFor = (history: UciMove[], lines = repertoire): MoveChoice[] => {
  const grouped = new Map<UciMove, MoveChoice>();
  for (const line of candidatesFor(history, lines)) {
    const uci = line.moves[history.length];
    if (!uci) continue;
    const existing = grouped.get(uci);
    if (existing) {
      existing.weight += line.weight;
      existing.lineIds.push(line.id);
    } else {
      grouped.set(uci, { uci, weight: line.weight, lineIds: [line.id] });
    }
  }
  return [...grouped.values()].sort((a, b) => b.weight - a.weight);
};

export const weightedChoice = (choices: MoveChoice[], random = Math.random) => {
  if (!choices.length) return null;
  const total = choices.reduce((sum, choice) => sum + choice.weight, 0);
  let cursor = random() * total;
  for (const choice of choices) {
    cursor -= choice.weight;
    if (cursor < 0) return choice;
  }
  return choices.at(-1) ?? null;
};

export const parseUci = (uci: UciMove) => ({
  from: uci.slice(0, 2) as Square,
  to: uci.slice(2, 4) as Square,
  promotion: uci.slice(4, 5) || "q",
});

export const toUci = (from: string, to: string, promotion = "q") =>
  `${from}${to}${promotion === "q" ? "" : promotion}` as UciMove;

export const chessFromHistory = (history: UciMove[]) => {
  const chess = new Chess();
  for (const uci of history) chess.move(parseUci(uci));
  return chess;
};

export const sanFor = (chess: Chess, uci: UciMove) => {
  const clone = new Chess(chess.fen());
  return clone.move(parseUci(uci)).san;
};
