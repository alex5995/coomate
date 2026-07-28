import type { RepertoireLine, UciMove } from "@/lib/types";
import { grunfeldEvaluations } from "./grunfeld-evaluations";
import { trainingGoalFor } from "./training-goals";

// Source: https://lichess.org/study/0AUYoSOH
// Continuation chapters are prefixed only with the exact setup encoded in their FEN.
const line = (
  id: string,
  family: string,
  weight: number,
  moves: string,
): RepertoireLine => ({
  id,
  name: id,
  family,
  weight,
  moves: moves.split(" ") as UciMove[],
  evaluations: grunfeldEvaluations[id],
  goal: trainingGoalFor("grunfeld", id),
});

export const grunfeldRepertoire: RepertoireLine[] = [
  // 3.Nc3 - The Exchange Variation.
  line(
    "grunfeld-exchange-classical",
    "Exchange",
    24,
    "d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 c4d5 f6d5 e2e4 d5c3 b2c3 f8g7 g1f3 c7c5 f1e2 e8g8 e1g1 d8a5 c1d2 c8g4",
  ),
  // 3.Nc3 - The Typical Continuation (GM Level).
  line(
    "grunfeld-exchange-gm",
    "Exchange",
    18,
    "d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 c4d5 f6d5 e2e4 d5c3 b2c3 f8g7 g1f3 c7c5 c1e3 d8a5 a1c1",
  ),
  // The "Exact Moves".
  line(
    "grunfeld-exchange-exact",
    "Exchange",
    18,
    "d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 c4d5 f6d5 e2e4 d5c3 b2c3 f8g7 f1c4 c7c5 g1e2 e8g8 e1g1 b8c6 c1e3 b7b6",
  ),
  // 3.Nc3 - The Exchange Variation - Knight Takes?!
  line(
    "grunfeld-knight-takes",
    "Knight recapture",
    16,
    "d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 c4d5 f6d5 c3d5 d8d5 g1f3 f8g7 e2e3 e8g8 f1e2 c7c5 e1g1 b8c6 c1d2 c8g4 a1c1",
  ),
  // 3.Nc3 - No Exchange.
  line(
    "grunfeld-no-exchange",
    "No exchange",
    18,
    "d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 g1f3 f8g7 e2e3 e8g8 f1e2 c7c5 d4c5 d8a5 c4d5 f6d5 d1d5 g7c3 b2c3 a5c3",
  ),
  // Another Variation - Bishop Pin.
  line(
    "grunfeld-bishop-pin",
    "Bishop pin",
    12,
    "d2d4 g8f6 c2c4 g7g6 b1c3 d7d5 g1f3 f8g7 c1g5 f6e4",
  ),
  // 3.Nf3.
  line(
    "grunfeld-nf3-quiet",
    "Quiet Nf3",
    12,
    "d2d4 g8f6 c2c4 g7g6 g1f3 f8g7 e2e3 e8g8 f1e2",
  ),
  // 3.Nf3 - The Catalan.
  line(
    "grunfeld-nf3-catalan",
    "Catalan setup",
    10,
    "d2d4 g8f6 c2c4 g7g6 g1f3 f8g7 g2g3 c7c6",
  ),
];

const guidance: Record<string, { hint: string; explanation: string }> = {
  g8f6: { hint: "Begin with the flexible Indian Defence knight move.", explanation: "...Nf6 prevents an immediate e4 and keeps the central pawn structure flexible." },
  g7g6: { hint: "Prepare the kingside bishop fianchetto.", explanation: "...g6 opens the long diagonal for the bishop." },
  d7d5: { hint: "Challenge White's centre before it becomes stable.", explanation: "...d5 is the defining Grünfeld central strike after Nc3." },
  f6d5: { hint: "Recapture and prepare to exchange the c3 knight.", explanation: "...Nxd5 restores the pawn and puts immediate pressure on c3 and e3." },
  d5c3: { hint: "Remove the knight that supports White's centre.", explanation: "...Nxc3 leaves White with a broad but attackable pawn centre." },
  f8g7: { hint: "Activate the bishop against White's centre.", explanation: "...Bg7 completes the fianchetto and pressures d4." },
  c7c5: { hint: "Attack the base of White's central pawn chain.", explanation: "...c5 attacks d4 and forces White to make a concrete decision in the centre." },
  d8a5: { hint: "Use the queen to add pressure on c3 and d4.", explanation: "...Qa5 increases pressure on the c3 knight and White's broad centre." },
  c8g4: { hint: "Pin the knight and remove a defender of d4.", explanation: "...Bg4 develops with pressure and makes d4 harder to defend." },
  f6e4: { hint: "Jump into the centre when White pins the knight.", explanation: "...Ne4 exploits the queen and bishop pressure on d4." },
};

export const grunfeldGuidanceFor = (moves: UciMove[]) =>
  moves.map((move) => guidance[move]).find(Boolean) ?? {
    hint: "Develop with pressure against White's centre.",
    explanation: "This continuation develops with direct pressure against White's centre.",
  };
