import { Chess, type Square } from "chess.js";
import { repertoire } from "@/data/repertoire";
import type { MoveChoice, PlayerColor, RepertoireLine, UciMove } from "@/lib/types";

interface PositionCandidate {
  line: RepertoireLine;
  moveIndex: number;
}

export interface RepertoireEdge extends MoveChoice {
  nextKey: string;
}

export interface RepertoireGraph {
  edgesByPosition: Map<string, RepertoireEdge[]>;
  terminalsByPosition: Map<string, RepertoireLine[]>;
}

export interface TrainingSession {
  allGraph: RepertoireGraph;
  opponentGraph: RepertoireGraph;
  playerColor: PlayerColor;
  livePositions: Set<string>;
  maxTargetLength: number;
  startIsLive: boolean;
}

const positionIndex = new WeakMap<RepertoireLine, { key: string; moveIndex: number }[]>();
const graphIndex = new WeakMap<RepertoireLine[], RepertoireGraph>();
const moveOrderGraphIndex = new WeakMap<RepertoireLine[], Map<string, RepertoireGraph>>();

export const positionKey = (fen: string) => fen.split(" ").slice(0, 4).join(" ");

const indexedPositionsFor = (line: RepertoireLine) => {
  const cached = positionIndex.get(line);
  if (cached) return cached;

  const chess = new Chess();
  const positions = [{ key: positionKey(chess.fen()), moveIndex: 0 }];
  for (const move of line.moves) {
    chess.move(parseUci(move));
    positions.push({ key: positionKey(chess.fen()), moveIndex: positions.length });
  }
  positionIndex.set(line, positions);
  return positions;
};

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

/**
 * Match curated lines by chess position instead of requiring an identical move
 * order. This keeps castling and en-passant rights significant while allowing
 * ordinary opening transpositions to share the same continuations.
 */
export const positionCandidatesFor = (history: UciMove[], lines = repertoire): PositionCandidate[] => {
  const currentKey = positionKey(chessFromHistory(history).fen());
  return lines.flatMap((line) => indexedPositionsFor(line)
    .filter((position) => position.key === currentKey)
    .map((position) => ({ line, moveIndex: position.moveIndex })));
};

export const positionChoicesFor = (history: UciMove[], lines = repertoire): MoveChoice[] => {
  const grouped = new Map<UciMove, MoveChoice>();
  for (const { line, moveIndex } of positionCandidatesFor(history, lines)) {
    const uci = line.moves[moveIndex];
    if (!uci) continue;
    const existing = grouped.get(uci);
    if (existing) {
      existing.weight += line.weight;
      if (!existing.lineIds.includes(line.id)) existing.lineIds.push(line.id);
    } else {
      grouped.set(uci, { uci, weight: line.weight, lineIds: [line.id] });
    }
  }
  return [...grouped.values()].sort((a, b) => b.weight - a.weight);
};

export const terminalLinesFor = (history: UciMove[], lines = repertoire) => positionCandidatesFor(history, lines)
  .filter(({ line, moveIndex }) => moveIndex === line.moves.length)
  .map(({ line }) => line);

export const staticEvaluationFor = (
  history: UciMove[],
  lines: RepertoireLine[],
  playerColor: PlayerColor,
  positionEvaluations?: Record<string, number>,
) => {
  for (const { line, moveIndex } of positionCandidatesFor(history, lines)) {
    const whiteCentipawns = line.evaluations?.[moveIndex];
    if (whiteCentipawns === undefined) continue;
    return playerColor === "w" ? whiteCentipawns : -whiteCentipawns;
  }
  const whiteCentipawns = positionEvaluations?.[positionKey(chessFromHistory(history).fen())];
  if (whiteCentipawns !== undefined) return playerColor === "w" ? whiteCentipawns : -whiteCentipawns;
  return null;
};

const emptyGraph = (): RepertoireGraph => ({
  edgesByPosition: new Map<string, RepertoireEdge[]>(),
  terminalsByPosition: new Map<string, RepertoireLine[]>(),
});

const addPathToGraph = (graph: RepertoireGraph, line: RepertoireLine, moves: UciMove[]) => {
  const { edgesByPosition, terminalsByPosition } = graph;
  const chess = new Chess();
  let currentKey = positionKey(chess.fen());
  for (const uci of moves) {
    chess.move(parseUci(uci));
    const nextKey = positionKey(chess.fen());
    const edges = edgesByPosition.get(currentKey) ?? [];
    const existing = edges.find((edge) => edge.uci === uci);
    if (existing) {
      if (!existing.lineIds.includes(line.id)) {
        existing.weight += line.weight;
        existing.lineIds.push(line.id);
      }
    } else {
      edges.push({ uci, nextKey, weight: line.weight, lineIds: [line.id] });
    }
    edgesByPosition.set(currentKey, edges);
    currentKey = nextKey;
  }

  const terminals = terminalsByPosition.get(currentKey) ?? [];
  if (!terminals.includes(line)) terminals.push(line);
  terminalsByPosition.set(currentKey, terminals);
};

const sortGraphEdges = (graph: RepertoireGraph) => {
  for (const edges of graph.edgesByPosition.values()) edges.sort((a, b) => b.weight - a.weight);
  return graph;
};

export const buildRepertoireGraph = (lines: RepertoireLine[]): RepertoireGraph => {
  const cached = graphIndex.get(lines);
  if (cached) return cached;

  const graph = emptyGraph();
  for (const line of lines) addPathToGraph(graph, line, line.moves);
  sortGraphEdges(graph);
  graphIndex.set(lines, graph);
  return graph;
};

const terminalKeyFor = (moves: UciMove[]) => {
  try {
    return positionKey(chessFromHistory(moves).fen());
  } catch {
    return null;
  }
};

const moveOrderPathsFor = (
  line: RepertoireLine,
  playerColor: PlayerColor,
  reorderableMoves: Set<UciMove>,
  recordedPositionEvaluations: Map<string, number>,
  positionEvaluations?: Record<string, number>,
) => {
  const paths = [line.moves];
  const terminalKey = terminalKeyFor(line.moves);
  const firstPlayerPly = playerColor === "w" ? 0 : 1;

  for (let index = firstPlayerPly; index + 2 < line.moves.length; index += 2) {
    const firstMove = line.moves[index];
    const secondMove = line.moves[index + 2];
    if (!reorderableMoves.has(firstMove) || !reorderableMoves.has(secondMove) || firstMove === secondMove) continue;

    const reordered = [...line.moves];
    reordered[index] = secondMove;
    reordered[index + 2] = firstMove;
    if (terminalKeyFor(reordered) !== terminalKey) continue;
    if (positionEvaluations) {
      const safe = reordered.every((_, moveIndex) => {
        const key = positionKey(chessFromHistory(reordered.slice(0, moveIndex + 1)).fen());
        const whiteScore = positionEvaluations[key] ?? recordedPositionEvaluations.get(key);
        return whiteScore !== undefined && (playerColor === "w" ? whiteScore : -whiteScore) >= -100;
      });
      if (!safe) continue;
    }
    paths.push(reordered);
  }

  return paths;
};

export const buildMoveOrderGraph = (
  lines: RepertoireLine[],
  playerColor: PlayerColor,
  moveOrderMoves: UciMove[],
  positionEvaluations?: Record<string, number>,
  evaluationLines: RepertoireLine[] = lines,
): RepertoireGraph => {
  if (!moveOrderMoves.length) return buildRepertoireGraph(lines);
  const cacheKey = `${playerColor}:${positionEvaluations ? "evaluated:" : ""}${[...new Set(moveOrderMoves)].sort().join(",")}:${
    evaluationLines === lines ? "local" : evaluationLines.map((line) => line.id).join(",")
  }`;
  const cached = moveOrderGraphIndex.get(lines)?.get(cacheKey);
  if (cached) return cached;

  const graph = emptyGraph();
  const reorderableMoves = new Set(moveOrderMoves);
  const recordedPositionEvaluations = new Map<string, number>();
  for (const line of evaluationLines) {
    indexedPositionsFor(line).forEach(({ key, moveIndex }) => {
      const score = line.evaluations?.[moveIndex];
      if (score !== undefined && !recordedPositionEvaluations.has(key)) recordedPositionEvaluations.set(key, score);
    });
  }
  for (const line of lines) {
    for (const moves of moveOrderPathsFor(line, playerColor, reorderableMoves, recordedPositionEvaluations, positionEvaluations)) {
      addPathToGraph(graph, line, moves);
    }
  }
  sortGraphEdges(graph);

  const lineCache = moveOrderGraphIndex.get(lines) ?? new Map<string, RepertoireGraph>();
  lineCache.set(cacheKey, graph);
  moveOrderGraphIndex.set(lines, lineCache);
  return graph;
};

const turnForPosition = (key: string) => key.split(" ")[1] as PlayerColor;

/*
 * A move-order graph adds only adjacent player setup moves that are explicitly
 * whitelisted by the opening. The intervening opponent reply stays fixed, and
 * chess.js must confirm that the reordered path reaches the same target FEN.
 */
export const createTrainingSession = (
  lines: RepertoireLine[],
  opponentLines: RepertoireLine[],
  playerColor: PlayerColor,
  moveOrderMoves: UciMove[] = [],
  positionEvaluations?: Record<string, number>,
): TrainingSession => {
  const allGraph = buildMoveOrderGraph(lines, playerColor, moveOrderMoves, positionEvaluations);
  const opponentGraph = buildMoveOrderGraph(opponentLines, playerColor, moveOrderMoves, positionEvaluations, lines);
  const livePositions = new Set(opponentGraph.terminalsByPosition.keys());
  const positions = new Set([
    ...allGraph.edgesByPosition.keys(),
    ...opponentGraph.edgesByPosition.keys(),
  ]);

  let changed = true;
  while (changed) {
    changed = false;
    for (const key of positions) {
      if (livePositions.has(key)) continue;
      const graph = turnForPosition(key) === playerColor ? allGraph : opponentGraph;
      if ((graph.edgesByPosition.get(key) ?? []).some((edge) => livePositions.has(edge.nextKey))) {
        livePositions.add(key);
        changed = true;
      }
    }
  }

  const startKey = positionKey(new Chess().fen());
  return {
    allGraph,
    opponentGraph,
    playerColor,
    livePositions,
    maxTargetLength: Math.max(1, ...opponentLines.map((line) => line.moves.length)),
    startIsLive: livePositions.has(startKey),
  };
};

const keyFromHistory = (history: UciMove[]) => positionKey(chessFromHistory(history).fen());

export const sessionTarget = (session: TrainingSession, history: UciMove[]) => {
  const targets = session.opponentGraph.terminalsByPosition.get(keyFromHistory(history)) ?? [];
  return [...targets].sort((a, b) => b.weight - a.weight || a.id.localeCompare(b.id))[0] ?? null;
};

export const sessionChoices = (session: TrainingSession, history: UciMove[]): MoveChoice[] => {
  const key = keyFromHistory(history);
  if (session.opponentGraph.terminalsByPosition.has(key)) return [];
  const graph = turnForPosition(key) === session.playerColor ? session.allGraph : session.opponentGraph;
  return (graph.edgesByPosition.get(key) ?? [])
    .filter((edge) => session.livePositions.has(edge.nextKey))
    .map(({ uci, weight, lineIds }) => ({ uci, weight, lineIds }));
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
