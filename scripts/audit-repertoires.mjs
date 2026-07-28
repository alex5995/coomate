#!/usr/bin/env node

import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline";
import { Chess } from "chess.js";

const enginePath = process.argv[2];
const depth = Number(process.argv[3] ?? 18);
const summaryOnly = process.argv.includes("--summary");
const groupArgument = process.argv.find((argument) => argument.startsWith("--group="));
const group = groupArgument?.slice("--group=".length) ?? "all";
const idsArgument = process.argv.find((argument) => argument.startsWith("--ids="));
const selectedIds = idsArgument ? new Set(idsArgument.slice("--ids=".length).split(",")) : null;
const reorderedOnly = process.argv.includes("--reordered-only");
const shardArgument = process.argv.find((argument) => argument.startsWith("--shard="));
const [shardIndex, shardCount] = (shardArgument?.slice("--shard=".length) ?? "0/1").split("/").map(Number);

if (!enginePath) {
  console.error("Usage: node scripts/audit-repertoires.mjs /path/to/stockfish [depth] [--group=all] [--summary]");
  process.exit(1);
}

if (!Number.isInteger(depth) || depth < 1) {
  console.error("Depth must be a positive integer.");
  process.exit(1);
}

if (!Number.isInteger(shardIndex) || !Number.isInteger(shardCount) || shardIndex < 0 || shardCount < 1 || shardIndex >= shardCount) {
  console.error("Shard must use --shard=index/count with a zero-based index.");
  process.exit(1);
}

const sources = [
  {
    path: "src/data/catalan-repertoire.ts",
    playerColor: "w",
    moveOrderMoves: ["g1f3", "g2g3", "f1g2", "b1d2", "e1g1"],
  },
  {
    path: "src/data/sicilian-repertoire.ts",
    playerColor: "b",
    moveOrderMoves: [],
  },
  {
    path: "src/data/grunfeld-repertoire.ts",
    playerColor: "b",
    moveOrderMoves: ["f8g7", "e8g8", "c7c5", "d8a5", "b8c6", "c8g4"],
  },
];

if (group !== "all") {
  console.error("Group must be all.");
  process.exit(1);
}

const parseLines = async ({ path, playerColor, moveOrderMoves }) => {
  const source = await readFile(path, "utf8");
  const pattern = /line\(\s*"([^"]+)",\s*"([^"]+)",\s*\d+,\s*"([a-h][1-8][a-h][1-8][^"]*)"\s*,?\s*\)/g;
  return [...source.matchAll(pattern)].map((match) => ({
    id: match[1],
    family: match[2],
    moves: match[3].split(" "),
    playerColor,
    moveOrderMoves,
  }));
};

const lines = (await Promise.all(sources.map(parseLines))).flat()
  .filter((line) => !selectedIds || selectedIds.has(line.id))
  .filter((_, index) => index % shardCount === shardIndex);
if (!lines.length) throw new Error(`No repertoire lines found for group ${group}.`);

const positionKey = (fen) => fen.split(" ").slice(0, 4).join(" ");
const fensFor = (moves) => {
  const chess = new Chess();
  const fens = [chess.fen()];
  for (const uci of moves) {
    chess.move({
      from: uci.slice(0, 2),
      to: uci.slice(2, 4),
      promotion: uci.slice(4, 5) || "q",
    });
    fens.push(chess.fen());
  }
  return fens;
};

const reorderedPathsFor = (line) => {
  const paths = [];
  const allowed = new Set(line.moveOrderMoves);
  const firstPlayerPly = line.playerColor === "w" ? 0 : 1;
  const target = positionKey(fensFor(line.moves).at(-1));
  for (let index = firstPlayerPly; index + 2 < line.moves.length; index += 2) {
    if (!allowed.has(line.moves[index]) || !allowed.has(line.moves[index + 2]) || line.moves[index] === line.moves[index + 2]) continue;
    const reordered = [...line.moves];
    reordered[index] = line.moves[index + 2];
    reordered[index + 2] = line.moves[index];
    try {
      if (positionKey(fensFor(reordered).at(-1)) === target) paths.push(reordered);
    } catch {
      // The application also ignores illegal reorderings.
    }
  }
  return paths;
};

const lineFens = new Map();
const rawFens = new Set();
const reorderedFens = new Set();
for (const line of lines) {
  const fens = fensFor(line.moves);
  fens.forEach((fen) => rawFens.add(fen));
  reorderedPathsFor(line).flatMap(fensFor).forEach((fen) => reorderedFens.add(fen));
  lineFens.set(line.id, fens);
}
const uniqueFens = reorderedOnly
  ? new Set([...reorderedFens].filter((fen) => ![...rawFens].some((rawFen) => positionKey(rawFen) === positionKey(fen))))
  : rawFens;

const engine = spawn(enginePath, [], { stdio: ["pipe", "pipe", "inherit"] });
const output = createInterface({ input: engine.stdout });
const waiters = [];
let engineName = "Stockfish";

output.on("line", (line) => {
  if (line.startsWith("id name ")) engineName = line.slice("id name ".length);
  for (const waiter of [...waiters]) {
    waiter.onLine(line);
    if (!waiter.done(line)) continue;
    waiters.splice(waiters.indexOf(waiter), 1);
    waiter.resolve();
  }
});

const waitFor = (done, onLine = () => {}) => new Promise((resolve) => {
  waiters.push({ done, onLine, resolve });
});

const send = (command) => engine.stdin.write(`${command}\n`);

const uciReady = waitFor((line) => line === "uciok");
send("uci");
await uciReady;
send("setoption name Threads value 2");
send("setoption name Hash value 256");
const ready = waitFor((line) => line === "readyok");
send("isready");
await ready;

const analyses = new Map();
let completed = 0;
for (const fen of uniqueFens) {
  let latest = null;
  const bestMove = waitFor(
    (line) => line.startsWith("bestmove "),
    (line) => {
      if (!line.startsWith("info ") || !line.includes(" score ")) return;
      const score = line.match(/\bscore (cp|mate) (-?\d+)/);
      const pv = line.match(/\bpv ([a-h][1-8][a-h][1-8][nbrq]?)/);
      if (!score) return;
      const raw = score[1] === "mate"
        ? Math.sign(Number(score[2])) * 100_000
        : Number(score[2]);
      const whiteCentipawns = fen.split(" ")[1] === "w" ? raw : -raw;
      latest = {
        whiteCentipawns,
        bestMove: pv?.[1] ?? null,
      };
    },
  );
  send(`position fen ${fen}`);
  send(`go depth ${depth}`);
  await bestMove;
  if (!latest) throw new Error(`No evaluation returned for ${fen}`);
  analyses.set(fen, latest);
  completed += 1;
  if (completed % 25 === 0 || completed === uniqueFens.size) {
    console.error(`Analysed ${completed}/${uniqueFens.size} unique positions`);
  }
}

send("quit");

if (reorderedOnly) {
  console.log(JSON.stringify({
    engine: engineName,
    depth,
    scorePerspective: "White",
    positions: Object.fromEntries([...analyses].map(([fen, analysis]) => [positionKey(fen), analysis.whiteCentipawns])),
  }, null, 2));
  process.exit(0);
}

const report = {
  engine: engineName,
  depth,
  scorePerspective: "White",
  lines: Object.fromEntries(lines.map((line) => {
    const points = lineFens.get(line.id).map((fen) => analyses.get(fen));
    const evaluations = points.map(({ whiteCentipawns }) => whiteCentipawns);
    const userEvaluations = evaluations.map((score) => line.playerColor === "w" ? score : -score);
    const afterUser = userEvaluations
      .map((score, index) => ({ score, index }))
      .filter(({ index }) => index > 0 && index % 2 === (line.playerColor === "w" ? 1 : 0));
    return [line.id, {
      playerColor: line.playerColor,
      evaluations,
      bestMoves: points.map(({ bestMove }) => bestMove),
      target: userEvaluations.at(-1),
      worst: Math.min(...userEvaluations),
      worstIndex: userEvaluations.indexOf(Math.min(...userEvaluations)),
      worstAfterUser: Math.min(...afterUser.map(({ score }) => score)),
      firstPositionBelowThreshold: userEvaluations.findIndex((score) => score < -100),
    }];
  })),
};

console.log(JSON.stringify(summaryOnly ? {
  engine: report.engine,
  depth: report.depth,
  lines: Object.fromEntries(Object.entries(report.lines).map(([id, line]) => [id, {
    target: line.target,
    worst: line.worst,
    worstAfterUser: line.worstAfterUser,
    firstPositionBelowThreshold: line.firstPositionBelowThreshold,
  }])),
} : report, null, 2));
