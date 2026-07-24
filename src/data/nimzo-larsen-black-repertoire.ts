import type { RepertoireLine, UciMove } from "@/lib/types";

const familyGoals: Record<string, RepertoireLine["goal"]> = {
  "Queen's Gambit": {
    title: "The reversed Nimzo-Larsen against c4",
    plans: [
      "Develop ...b6, ...Bb7 and ...e6 before committing the kingside.",
      "Use ...Bb4 and ...Bxc3 to remove the knight that supports e4.",
      "Play ...f5, ...Nf6 and O-O when the centre makes the plan safe.",
    ],
  },
  "King's pawn · e4": {
    title: "Pressure the e4 centre",
    plans: [
      "Use ...b6, ...Bb7 and ...e6 to attack e4 from the long diagonal.",
      "If ...f5 is unsafe, challenge the centre with ...c5 or ...d5 instead.",
      "Develop ...Nf6, ...Be7 and O-O before opening lines.",
    ],
  },
  "Queen's pawn · London": {
    title: "An active reversed setup against the London",
    plans: [
      "Use ...Bb4+ when it disrupts White's normal development.",
      "Prepare ...f5 only after the b7 bishop and king are secure.",
      "Challenge the centre instead of copying White's setup.",
    ],
  },
  "Colle and Zukertort": {
    title: "Kingside activity against a quiet centre",
    plans: [
      "Complete ...b6, ...Bb7 and ...e6 before playing ...f5.",
      "Develop ...Nf6 and ...Be7, then castle.",
      "Use ...Ne4 or ...c5 to prevent White from building e4 uncontested.",
    ],
  },
  "English": {
    title: "Target e4 in the English",
    plans: [
      "Pin or exchange the c3 knight with ...Bb4.",
      "Use ...f5 to attack e4 when tactics permit.",
      "Finish ...Nf6 and O-O before increasing central pressure.",
    ],
  },
  "Réti": {
    title: "A flexible reversed fianchetto",
    plans: [
      "Develop ...b6, ...Bb7 and ...e6 while White reveals the centre.",
      "Choose ...f5 against a slow setup or a direct central break against e4.",
      "Castle and use the e4 square as the main strategic target.",
    ],
  },
  "Jobava and Veresov": {
    title: "Remove the Jobava knight",
    plans: [
      "Use ...Bb4 to pin and exchange the c3 knight.",
      "Attack e4 with ...f5 or ...d5 after developing.",
      "Castle before White can redirect the attack toward the king.",
    ],
  },
  "Flank openings": {
    title: "Use the second move in the mirror",
    plans: [
      "Complete ...b6, ...Bb7 and ...e6 without losing time.",
      "Use ...f5 when it claims e4 safely.",
      "Develop ...Nf6, ...Be7 and O-O before central expansion.",
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
  goal: familyGoals[family],
});

export const nimzoLarsenBlackRepertoire: RepertoireLine[] = [
  line(
    "nl-black-qg-bb4",
    "Queen's Gambit",
    23,
    "d2d4 b7b6 c2c4 c8b7 b1c3 e7e6 e2e4 f8b4 f1d3 f7f5 d1e2 g8f6 f2f3 f5e4 f3e4 e8g8 g1f3 b4c3 b2c3 f6e4 d3e4 b7e4",
  ),
  line(
    "nl-black-qg-nf6",
    "Queen's Gambit",
    19,
    "d2d4 b7b6 c2c4 c8b7 b1c3 e7e6 e2e4 g8f6 f1d3 f8b4 g1e2 f6e4 e1g1 e4c3 b2c3 b4e7 e2g3 d7d6 f2f4 b8d7 f4f5",
  ),

  line(
    "nl-black-e4-nf6",
    "King's pawn · e4",
    20,
    "e2e4 b7b6 d2d4 c8b7 f1d3 e7e6 g1f3 g8f6 d1e2 c7c5 c2c3 f8e7 e1g1 e8g8 e4e5 f6d5 e2e4 g7g6 c1h6 f8e8",
  ),
  line(
    "nl-black-e4-c5",
    "King's pawn · e4",
    17,
    "e2e4 b7b6 d2d4 c8b7 f1d3 e7e6 g1f3 c7c5 c2c3 g8f6 d1e2 f8e7 e1g1 e8g8 e4e5 f6d5 e2e4 g7g6 c1h6 f8e8",
  ),

  line(
    "nl-black-london-nf6",
    "Queen's pawn · London",
    18,
    "d2d4 b7b6 g1f3 c8b7 c1f4 e7e6 e2e3 g8f6 f1d3 f8e7 e1g1 e8g8 h2h3 c7c5 b1d2 d7d5 c2c3 b8c6 f3e5",
  ),
  line(
    "nl-black-london-bb4",
    "Queen's pawn · London",
    15,
    "d2d4 b7b6 g1f3 c8b7 c1f4 e7e6 e2e3 f8b4 c2c3 b4e7 f1d3 f7f5 b1d2 g8f6 e1g1 e8g8 f3e5 d7d6 e5f3",
  ),

  line(
    "nl-black-colle-f5",
    "Colle and Zukertort",
    17,
    "d2d4 b7b6 g1f3 c8b7 e2e3 e7e6 f1d3 f7f5 e1g1 g8f6 c2c4 f8e7 b1c3 e8g8 b2b3 f6e4 c1b2 e4c3 b2c3",
  ),
  line(
    "nl-black-colle-nf6",
    "Colle and Zukertort",
    14,
    "d2d4 b7b6 g1f3 c8b7 e2e3 e7e6 f1d3 g8f6 e1g1 f8e7 c2c4 e8g8 b1c3 d7d5 b2b3 b8d7 c1b2 c7c5 f3e5",
  ),

  line(
    "nl-black-english-bb4",
    "English",
    16,
    "c2c4 b7b6 b1c3 c8b7 e2e4 e7e6 d2d3 f8b4 g1e2 f7f5 a2a3 b4c3 e2c3 g8f6 f1e2 e8g8 e1g1 f5e4 d3e4 f6e4",
  ),
  line(
    "nl-black-english-f5",
    "English",
    13,
    "c2c4 b7b6 b1c3 c8b7 e2e4 e7e6 d2d3 f7f5 e4f5 g8f6 g1f3 e6f5 f1e2 f8e7 e1g1 e8g8 d3d4 f6e4 d1c2 e4c3 c2c3",
  ),

  line(
    "nl-black-reti-nf6",
    "Réti",
    14,
    "g1f3 b7b6 g2g3 c8b7 f1g2 e7e6 e1g1 g8f6 d2d3 f8e7 e2e4 d7d5 b1d2 e8g8 e4e5 f6d7 f1e1 c7c5 d2f1 b8c6",
  ),
  line(
    "nl-black-reti-f5",
    "Réti",
    12,
    "g1f3 b7b6 g2g3 c8b7 f1g2 e7e6 e1g1 f7f5 d2d3 g8f6 b1d2 f8e7 e2e4 f5e4 d3e4 e8g8 e4e5 f6g4 h2h3 g4h6",
  ),

  line(
    "nl-black-jobava-bb4",
    "Jobava and Veresov",
    13,
    "d2d4 b7b6 b1c3 c8b7 e2e4 e7e6 c1f4 f8b4 f1d3 f7f5 d1e2 g8f6 f2f3 e8g8 g1h3 f5e4 f3e4 f6e4 e1g1 b4c3 b2c3 e4c3",
  ),
  line(
    "nl-black-jobava-nf6",
    "Jobava and Veresov",
    11,
    "d2d4 b7b6 b1c3 c8b7 e2e4 e7e6 c1f4 g8f6 f1d3 f8b4 g1e2 d7d5 e4e5 f6e4 d3e4 d5e4 e1g1 b4c3 b2c3 e8g8",
  ),

  line(
    "nl-black-flank-nf6",
    "Flank openings",
    11,
    "b2b3 b7b6 c1b2 c8b7 e2e3 e7e6 g1f3 g8f6 f1e2 f8e7 e1g1 e8g8 d2d3 c7c5 b1d2 d7d5 f3e5 b8d7 f2f4",
  ),
  line(
    "nl-black-flank-f5",
    "Flank openings",
    9,
    "b2b3 b7b6 c1b2 c8b7 e2e3 e7e6 g1f3 f7f5 f1e2 g8f6 e1g1 f8e7 d2d3 e8g8 b1d2 d7d5 f3e5 c7c5 f2f4",
  ),
];

export const nimzoLarsenBlackGuidanceFor = (moves: UciMove[]) => {
  if (moves.includes("b7b6")) {
    return {
      hint: "Begin the reversed queenside fianchetto.",
      explanation: "...b6 prepares ...Bb7 and starts the Black version of the video's system.",
    };
  }
  if (moves.includes("c8b7")) {
    return {
      hint: "Place the bishop on the long diagonal before closing the light squares.",
      explanation: "...Bb7 develops the c8 bishop before ...e6 and targets e4.",
    };
  }
  if (moves.includes("e7e6")) {
    return {
      hint: "Open the f8 bishop and reinforce the central dark squares.",
      explanation: "...e6 prepares ...Bb4 and supports the fight for e4.",
    };
  }
  if (moves.includes("f8b4") || moves.includes("b4c3")) {
    return {
      hint: "Use the bishop to remove the knight that protects the centre.",
      explanation: "The ...Bb4-...Bxc3 exchange weakens White's control of e4.",
    };
  }
  if (moves.includes("f7f5")) {
    return {
      hint: "Clamp e4 only when White cannot punish the pawn advance.",
      explanation: "...f5 creates the aggressive Dutch-style structure shown in the video.",
    };
  }
  if (moves.includes("g8f6") || moves.includes("e8g8")) {
    return {
      hint: "Complete kingside development before increasing the pressure.",
      explanation: "...Nf6 and O-O add force against e4 while keeping the king safe.",
    };
  }
  return {
    hint: "Develop actively and keep e4 as the strategic target.",
    explanation: "The move coordinates the reversed Nimzo-Larsen setup for central and kingside play.",
  };
};
