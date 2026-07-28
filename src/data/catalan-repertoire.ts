import type { RepertoireLine, UciMove } from "@/lib/types";
import { catalanEvaluations } from "./catalan-evaluations";

// Source: https://lichess.org/study/DckpgOgd
// Every recorded move comes from the named chapter of this study.
const familyGoals: Record<string, RepertoireLine["goal"]> = {
  "Indian setup": {
    title: "The Catalan structure",
    plans: [
      "Fianchetto the light-squared bishop and keep pressure on the long diagonal.",
      "Develop the kingside and castle before expanding in the centre.",
      "Choose the Nf3 and Bg2 move order that best fits Black's setup.",
    ],
  },
  "Open Catalan": {
    title: "Pressure after ...dxc4",
    plans: [
      "Use the g2 bishop and queen to recover the c4 pawn without rushing.",
      "Complete development while Black spends time holding the extra pawn.",
      "Look for queenside pressure on the open files and long diagonal.",
    ],
  },
  "Closed Catalan": {
    title: "Long-term queenside pressure",
    plans: [
      "Keep the g2 bishop active against Black's d5 centre.",
      "Castle and complete development before choosing a central break.",
      "Use the space advantage to improve every piece patiently.",
    ],
  },
  "Anti-Nimzo": {
    title: "A Catalan against ...Nc6",
    plans: [
      "Avoid an unnecessary pin and keep the fianchetto plan intact.",
      "Pressure d5 with the g2 bishop and central pawns.",
      "Castle before deciding how to challenge Black's knight placement.",
    ],
  },
  Marshall: {
    title: "Development against the Marshall setup",
    plans: [
      "Use Nf3 and Nbd2 to pressure the exposed d5 knight.",
      "Complete the kingside fianchetto and castle.",
      "Exploit the tempi Black spent moving the same knight and bishop.",
    ],
  },
  Slav: {
    title: "Active Catalan play against the Slav",
    plans: [
      "Use Qb3 and Bf4 to create concrete pressure on b7 and the queen.",
      "Complete the fianchetto while Black untangles the queenside.",
      "Keep the initiative through development rather than pawn grabbing.",
    ],
  },
  "Hungarian Gambit": {
    title: "Meet the early ...e5",
    plans: [
      "Accept the central challenge while keeping development coordinated.",
      "Develop Nf3 and Bg2 to control the centre and protect the king.",
      "Do not chase the advanced knight at the expense of development.",
    ],
  },
  "Neo-Catalan": {
    title: "A Catalan from the English move order",
    plans: [
      "Reach the same fianchetto structure without forcing 1.d4.",
      "Use the delayed d4 push once the kingside pieces are developed.",
      "Keep pressure on the centre from the g2 bishop.",
    ],
  },
  Tarrasch: {
    title: "Play against the isolated d-pawn",
    plans: [
      "Exchange on d5 and make the isolated pawn a long-term target.",
      "Develop rapidly and castle before increasing central pressure.",
      "Coordinate the g2 bishop and queenside knight against d5.",
    ],
  },
  Albin: {
    title: "Contain the Albin counter-gambit",
    plans: [
      "Resolve the central tension without trying to hold every pawn.",
      "Develop Nf3 and Bg2 against Black's advanced d4 pawn.",
      "Prepare to challenge the centre after completing development.",
    ],
  },
};

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
  goal: familyGoals[family],
});

export const catalanRepertoire: RepertoireLine[] = [
  // Basic Catalan Opening Setup, including the study's explicit 4.Bg2 variation.
  line("catalan-indian-nf3", "Indian setup", 22, "d2d4 g8f6 c2c4 e7e6 g2g3 d7d5 g1f3"),
  line("catalan-indian-bg2", "Indian setup", 12, "d2d4 g8f6 c2c4 e7e6 g2g3 d7d5 f1g2"),

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
    "d2d4 d7d5 c2c4 g8f6 c4d5 f6d5 g1f3 c8f5 g2g3 e7e6 b1d2 f5g6 f1g2 b8c6 e1g1",
  ),

  // Catalan Opening; Slav Defense.
  line(
    "catalan-slav",
    "Slav",
    10,
    "d2d4 d7d5 c2c4 c7c6 g1f3 c8f5 d1b3 d8c7 g2g3 g8f6 c1f4 c7c8 f1g2",
  ),

  // Catalan Opening; Hungarian Gambit.
  line(
    "catalan-hungarian",
    "Hungarian Gambit",
    5,
    "d2d4 g8f6 c2c4 e7e6 g2g3 e6e5 d4e5 f6g4 g1f3 b8c6 f1g2",
  ),

  // English Opening; Neo-Catalan.
  line(
    "catalan-neo",
    "Neo-Catalan",
    5,
    "c2c4 e7e6 g1f3 d7d5 g2g3 g8f6 f1g2 b8d7 d2d4",
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
