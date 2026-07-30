import type { RepertoireLine, UciMove } from "@/lib/types";
import { catalanEvaluations } from "./catalan-evaluations";
import { trainingGoalFor } from "./training-goals";

// Main source: https://lichess.org/study/DckpgOgd
// Budapest practical 4.g3 fianchetto: https://www.chess.com/openings/Budapest-Gambit
// Old Benoni into the Fianchetto Variation: https://www.chess.com/openings/Benoni-Defense-Modern-Fianchetto-Variation
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
  evaluations: catalanEvaluations[id],
  goal: trainingGoalFor("catalan", id),
});

export const catalanRepertoire: RepertoireLine[] = [
  // Basic Catalan Opening Setup with the committed 3.Nf3 move order.
  line("catalan-indian-nf3", "Indian setup", 34, "d2d4 g8f6 c2c4 e7e6 g1f3 d7d5 g2g3"),

  // Open Catalan Opening; Modern Sharp Variation.
  line(
    "catalan-open-modern-sharp",
    "Open Catalan",
    24,
    "d2d4 d7d5 c2c4 e7e6 g1f3 g8f6 g2g3 d5c4 f1g2 b8c6 d1a4 f8b4 c1d2 f6d5 d2b4 d5b4 e1g1 a8b8 b1a3 e8g8 a4b5 b7b6 b5c4 c8a6 a3b5 d8d5 c4d5 b4d5 a2a4",
  ),

  // Closed Catalan Opening.
  line("catalan-closed", "Closed Catalan", 24, "d2d4 d7d5 c2c4 e7e6 g1f3 g8f6 g2g3 f8e7 f1g2"),

  // Catalan Opening; Anti-Nimzo-Indian.
  line("catalan-anti-nimzo", "Anti-Nimzo", 12, "d2d4 g8f6 c2c4 e7e6 g1f3 b8c6 g2g3 d7d5 f1g2"),

  // Catalan Opening; Marshall Defense.
  line(
    "catalan-marshall",
    "Marshall",
    10,
    "d2d4 d7d5 c2c4 g8f6 c4d5 f6d5 g1f3 c8f5 g2g3 e7e6 f1g2 f5g6 e1g1 b8c6 b1c3",
  ),

  // Catalan Opening; Slav Defense.
  line(
    "catalan-slav",
    "Slav",
    10,
    "d2d4 d7d5 c2c4 c7c6 g1f3 c8f5 d1b3 d8c7 g2g3 g8f6 c1f4 c7c8 f1g2",
  ),

  // Old Benoni move order into a Fianchetto Benoni structure.
  line(
    "catalan-benoni",
    "Old Benoni",
    6,
    "d2d4 c7c5 d4d5 e7e6 c2c4 e6d5 c4d5 d7d6 g1f3 g8f6 g2g3 g7g6 f1g2 f8g7 e1g1 e8g8 b1c3",
  ),

  // Budapest Gambit with a practical 4.g3 fianchetto.
  line(
    "catalan-budapest",
    "Budapest Gambit",
    5,
    "d2d4 g8f6 c2c4 e7e5 d4e5 f6g4 g2g3 g4e5 e2e3 f8b4 c1d2 a7a5 f2f4 e5c6 f1g2 d7d6 g1f3 e8g8 e1g1",
  ),

  // Catalan Opening; Tarrasch Defense.
  line(
    "catalan-tarrasch",
    "Tarrasch",
    10,
    "d2d4 d7d5 c2c4 e7e6 g1f3 g8f6 g2g3 c7c5 c4d5 e6d5 f1g2 b8c6 e1g1 f8e7 b1c3 e8g8",
  ),

  // Catalan Opening; Albin Counter-Gambit.
  line(
    "catalan-albin",
    "Albin",
    5,
    "d2d4 d7d5 c2c4 e7e5 d4e5 d5d4 g1f3 b8c6 g2g3 c8g4 f1g2",
  ),
];

const guidance: Record<string, { hint: string; explanation: string }> = {
  d2d4: { hint: "Claim the centre with the queen's pawn.", explanation: "d4 claims central space and prepares the Catalan structure." },
  c2c4: { hint: "Challenge Black's d-pawn and open the queen's diagonal.", explanation: "c4 creates central tension and increases pressure on d5." },
  g2g3: { hint: "Prepare the defining light-squared bishop fianchetto.", explanation: "g3 opens g2 for the bishop and builds long-term pressure on the long diagonal." },
  g1f3: { hint: "Develop while increasing control over the centre.", explanation: "Nf3 supports d4, prepares castling and keeps the setup flexible." },
  f1g2: { hint: "Complete the fianchetto and aim through the centre.", explanation: "Bg2 activates the Catalan bishop on the long diagonal." },
  e1g1: { hint: "Secure the king before increasing central pressure.", explanation: "Castling completes the core kingside development and connects the rooks." },
  d1b3: { hint: "Create immediate pressure on b7.", explanation: "Qb3 targets b7 and makes Black spend time defending the queenside." },
  c1f4: { hint: "Develop with tempo against the queen.", explanation: "Bf4 adds pressure to c7 and gains time against Black's queen." },
};

export const catalanGuidanceFor = (moves: UciMove[]) =>
  moves.map((move) => guidance[move]).find(Boolean) ?? {
    hint: "Improve development while preserving pressure on the long diagonal.",
    explanation: "This continuation improves coordination while preserving Catalan pressure on the centre and long diagonal.",
  };
