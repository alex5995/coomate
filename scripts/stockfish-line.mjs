#!/usr/bin/env node

import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { Chess } from "chess.js";

const enginePath = process.argv[2];
const depth = Number(process.argv[3] ?? 18);
const multiPv = Number(process.argv[4] ?? 3);
const moves = process.argv.slice(5);

if (!enginePath) {
  console.error("Usage: node scripts/stockfish-line.mjs /path/to/stockfish [depth] [multiPv] [...uciMoves]");
  process.exit(1);
}

const chess = new Chess();
for (const uci of moves) {
  chess.move({
    from: uci.slice(0, 2),
    to: uci.slice(2, 4),
    promotion: uci.slice(4, 5) || "q",
  });
}

const engine = spawn(enginePath, [], { stdio: ["pipe", "pipe", "inherit"] });
const output = createInterface({ input: engine.stdout });
const waiters = [];
const variations = new Map();

output.on("line", (line) => {
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
send(`setoption name MultiPV value ${multiPv}`);
const ready = waitFor((line) => line === "readyok");
send("isready");
await ready;

const bestMove = waitFor(
  (line) => line.startsWith("bestmove "),
  (line) => {
    if (!line.startsWith(`info depth ${depth} `) || !line.includes(" score ") || !line.includes(" pv ")) return;
    const rank = Number(line.match(/\bmultipv (\d+)/)?.[1] ?? 1);
    const score = line.match(/\bscore (cp|mate) (-?\d+)/);
    const pv = line.match(/\bpv (.+)$/)?.[1].split(" ") ?? [];
    if (!score) return;
    const raw = score[1] === "mate"
      ? Math.sign(Number(score[2])) * 100_000
      : Number(score[2]);
    variations.set(rank, {
      whiteCentipawns: chess.turn() === "w" ? raw : -raw,
      pv,
    });
  },
);

send(`position fen ${chess.fen()}`);
send(`go depth ${depth}`);
await bestMove;
send("quit");

console.log(JSON.stringify({
  fen: chess.fen(),
  sideToMove: chess.turn(),
  variations: [...variations.entries()]
    .sort(([a], [b]) => a - b)
    .map(([rank, variation]) => ({ rank, ...variation })),
}, null, 2));
