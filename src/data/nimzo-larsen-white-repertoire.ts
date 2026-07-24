import type { RepertoireLine, UciMove } from "@/lib/types";
import { nimzoLarsenEvaluations } from "./nimzo-larsen-evaluations";

const familyGoals: Record<string, RepertoireLine["goal"]> = {
  "Classical …d5/…Nc6": {
    title: "The complete Nimzo-Larsen attacking setup",
    plans: [
      "Exchange Bb5 for the c6 knight when it damages Black's structure or removes an e5 defender.",
      "Use f4, Nf3 and O-O to clamp e5.",
      "Bring the remaining pieces into a kingside attack instead of rushing the pawns.",
    ],
  },
  "King's Indian …Nf6/…g6": {
    title: "A flexible kingside battle",
    plans: [
      "Preserve the b2 bishop and finish Nf3, Be2 and O-O.",
      "Play f4 only when Black cannot exploit the weakened e3-e1 diagonal.",
      "Use d3 and Nbd2 to reinforce e4 and e5.",
    ],
  },
  "…e5 and …Nc6": {
    title: "Pressure against Black's e5 centre",
    plans: [
      "Use Bb5 and Bxc6 to remove a central defender when the exchange is available.",
      "Attack e5 with f4 and Nf3.",
      "Castle before opening the f-file or launching a kingside attack.",
    ],
  },
  "…c5 and …Nc6": {
    title: "Dark-square control against …c5",
    plans: [
      "Exchange the c6 knight when that improves control of e5.",
      "Complete Nf3 and O-O before occupying the central outpost.",
      "Use d3 and Nbd2 to connect the queenside bishop with the kingside attack.",
    ],
  },
  "…c6 blocks Bb5": {
    title: "The system without the bishop trade",
    plans: [
      "Accept that Bb5 is unavailable and keep the bishop useful on e2.",
      "Build f4, Nf3, O-O and Nbd2 without forcing the usual exchange.",
      "Attack e5 through piece coordination and a timely central break.",
    ],
  },
  "Dutch …f5": {
    title: "A familiar setup against the Dutch",
    plans: [
      "Use Bb2 and Nf3 to contest e5.",
      "Keep f4 optional because Black already occupies the f-file.",
      "Castle and challenge the centre with e4 or Ne5 when prepared.",
    ],
  },
  "Mirror …b6": {
    title: "Use the extra tempo in the mirror",
    plans: [
      "Complete Nf3, Be2 and O-O before Black creates central counterplay.",
      "Use f4 when it strengthens the e5 clamp.",
      "Occupy e5 and prepare a kingside attack with the pieces.",
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
  evaluations: nimzoLarsenEvaluations[id],
  goal: familyGoals[family],
});

export const nimzoLarsenWhiteRepertoire: RepertoireLine[] = [
  line(
    "nl-white-classical-f4",
    "Classical …d5/…Nc6",
    24,
    "b2b3 d7d5 c1b2 b8c6 e2e3 e7e5 f1b5 f8d6 b5c6 b7c6 f2f4 d8e7 f4e5 d6e5 b2e5 e7e5 b1c3 g8f6 g1f3 e5d6 e1g1 e8g8 d1e1",
  ),
  line(
    "nl-white-classical-d3",
    "Classical …d5/…Nc6",
    20,
    "b2b3 d7d5 c1b2 b8c6 e2e3 e7e5 f1b5 f8d6 b5c6 b7c6 d2d3 g8h6 g1f3 d8e7 b1d2 e8g8 c2c4 e5e4 d3e4 d5e4 f3d4 c8g4 d1c2 c6c5 d4b5",
  ),

  line(
    "nl-white-kid-f4",
    "King's Indian …Nf6/…g6",
    21,
    "b2b3 g8f6 c1b2 g7g6 e2e3 f8g7 f2f4 e8g8 g1f3 d7d6 f1e2 f8e8 e1g1 b8c6 e2b5 c8d7 d1e2 a7a6 b5c6",
  ),
  line(
    "nl-white-kid-quiet",
    "King's Indian …Nf6/…g6",
    17,
    "b2b3 g8f6 c1b2 g7g6 e2e3 f8g7 g1f3 c7c5 c2c4 e8g8 f1e2 d7d5 c4d5 d8d5 e1g1 b8c6 b1c3 d5f5 a1c1",
  ),

  line(
    "nl-white-e5-exchange",
    "…e5 and …Nc6",
    20,
    "b2b3 e7e5 c1b2 b8c6 e2e3 g8f6 f1b5 f8d6 b1a3 e5e4 a3c4 d6e7 b5c6 b7c6 g1e2 a7a5 d2d3 a5a4 d3e4 f6e4 e2g3 e4g3 h2g3",
  ),
  line(
    "nl-white-e5-central",
    "…e5 and …Nc6",
    17,
    "b2b3 e7e5 c1b2 b8c6 e2e3 g8f6 d2d4 e5d4 e3d4 d7d5 g1f3 f8d6 f1e2 c6e7 e1g1 e8g8 c2c4 c7c6 f1e1",
  ),

  line(
    "nl-white-c5-exchange",
    "…c5 and …Nc6",
    18,
    "b2b3 c7c5 c1b2 b8c6 e2e3 d7d5 f1b5 c8d7 b5c6 d7c6 f2f4 e7e6 g1f3 g8f6 e1g1 f8e7 f3e5 a8c8 d2d3 e8g8",
  ),
  line(
    "nl-white-c5-f4",
    "…c5 and …Nc6",
    15,
    "b2b3 c7c5 c1b2 b8c6 e2e3 d7d5 f2f4 e7e6 g1f3 g8f6 f1b5 c8d7 b5c6 d7c6 e1g1 f8e7 f3e5 a8c8 d2d3 e8g8",
  ),

  line(
    "nl-white-c6-be2",
    "…c6 blocks Bb5",
    16,
    "b2b3 d7d5 c1b2 c7c6 e2e3 g8f6 f1e2 c8f5 g1f3 e7e6 f3h4 f5g6 e1g1 f8d6 c2c4 e8g8 d2d3 b8d7 b1d2",
  ),
  line(
    "nl-white-c6-quiet",
    "…c6 blocks Bb5",
    14,
    "b2b3 d7d5 c1b2 c7c6 e2e3 g8f6 g1f3 c8f5 f3h4 f5g4 f1e2 g4e2 d1e2 g7g6 c2c4 d5c4 b3c4 b8d7 e1g1",
  ),

  line(
    "nl-white-dutch-central",
    "Dutch …f5",
    14,
    "b2b3 f7f5 c1b2 g8f6 e2e3 e7e6 f1e2 d7d5 c2c4 f8d6 g1f3 e8g8 e1g1 d8e7 d1c2 c8d7 c4d5 f6d5 f3e5",
  ),
  line(
    "nl-white-dutch-quiet",
    "Dutch …f5",
    12,
    "b2b3 f7f5 c1b2 g8f6 e2e3 e7e6 c2c4 b7b6 g1h3 c8b7 b1c3 c7c5 c3b5 b8c6 f1e2 f8e7 e1g1 e8g8 d2d4",
  ),

  line(
    "nl-white-mirror-nf3",
    "Mirror …b6",
    13,
    "b2b3 b7b6 c1b2 c8b7 e2e3 e7e6 g1f3 g8f6 c2c4 f8e7 b1c3 e8g8 d2d4 d7d5 a1c1 c7c5 c4d5 f6d5 c3d5 d8d5 f1c4",
  ),
  line(
    "nl-white-mirror-quiet",
    "Mirror …b6",
    11,
    "b2b3 b7b6 c1b2 c8b7 e2e3 e7e6 c2c4 g8f6 g1f3 f8e7 b1c3 e8g8 d2d4 d7d5 a1c1 c7c5 c4d5 f6d5 c3d5 d8d5 d4c5",
  ),
];

export const nimzoLarsenWhiteGuidanceFor = (moves: UciMove[]) => {
  if (moves.includes("b2b3")) {
    return {
      hint: "Start the queenside fianchetto that defines the system.",
      explanation: "b3 prepares Bb2 and begins the Nimzo-Larsen setup shown in the video.",
    };
  }
  if (moves.includes("c1b2")) {
    return {
      hint: "Place the bishop on the long diagonal before building the rest of the setup.",
      explanation: "Bb2 pressures e5 and anchors the system's central strategy.",
    };
  }
  if (moves.includes("e2e3")) {
    return {
      hint: "Open the f1 bishop and prepare its exchange for a c6 knight.",
      explanation: "e3 releases Bb5 and supports the central dark squares.",
    };
  }
  if (moves.includes("f1b5") || moves.includes("b5c6")) {
    return {
      hint: "Use the bishop to remove a knight that defends the key central square.",
      explanation: "The Bb5-Bxc6 exchange removes an e5 defender and can damage Black's pawn structure.",
    };
  }
  if (moves.includes("f2f4")) {
    return {
      hint: "Clamp the key central square when Black cannot punish the pawn advance.",
      explanation: "f4 reinforces control of e5 and prepares kingside play.",
    };
  }
  if (moves.includes("g1f3") || moves.includes("e1g1")) {
    return {
      hint: "Complete kingside development before attacking.",
      explanation: "Nf3 and O-O secure the king and add another piece to the fight for e5.",
    };
  }
  return {
    hint: "Improve a piece while keeping pressure on e5.",
    explanation: "The move coordinates the Nimzo-Larsen setup for its central clamp and kingside attack.",
  };
};
