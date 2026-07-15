import type { RepertoireLine, UciMove } from "@/lib/types";

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
  goal: {
    title: "Middlegame setup",
    plans: ["Complete development.", "Coordinate the pieces.", "Prepare the thematic pawn break."],
  },
});

export const slavRepertoire: RepertoireLine[] = [
  line(
    "slav-main-alapin",
    "Slav · Queen's Gambit",
    24,
    "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 d5c4 a2a4 c8f5 e2e3 e7e6 f1c4 f8b4 e1g1 b8d7 d1e2 e8g8 e3e4 f5g6",
  ),
  line(
    "slav-quiet-bf5",
    "Slav · Queen's Gambit",
    18,
    "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 e2e3 c8f5 b1c3 e7e6 f3h4 f5g6 h4g6 h7g6 f1d3 b8d7 e1g1 f8d6",
  ),
  line(
    "slav-exchange",
    "Slav · Queen's Gambit",
    16,
    "d2d4 d7d5 c2c4 c7c6 c4d5 c6d5 b1c3 g8f6 c1f4 b8c6 e2e3 c8f5 g1f3 e7e6 f1b5 f8d6 f4d6 d8d6 e1g1 e8g8",
  ),
  line(
    "slav-chebanenko-bf5",
    "Slav · Queen's Gambit",
    11,
    "d2d4 d7d5 c2c4 c7c6 g1f3 g8f6 b1c3 a7a6 c4c5 c8f5 c1f4 b8d7 e2e3 e7e6 f1e2 f8e7 e1g1 e8g8",
  ),
  line(
    "slav-early-nc3",
    "Slav · Queen's Gambit",
    10,
    "d2d4 d7d5 c2c4 c7c6 b1c3 g8f6 e2e3 c8f5 d1b3 d8b6 g1f3 e7e6 c4c5 b6b3 a2b3 b8d7 b3b4 f8e7",
  ),

  line(
    "slav-london-mirror",
    "London",
    22,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c7c6 e2e3 c8f5 f1d3 f5d3 d1d3 e7e6 b1d2 f8e7 e1g1 e8g8 c2c4 b8d7",
  ),
  line(
    "slav-london-c5",
    "London",
    18,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c7c5 e2e3 b8c6 c2c3 c8f5 b1d2 e7e6 f1b5 f8d6 f4d6 d8d6 e1g1 e8g8",
  ),
  line(
    "slav-london-qb6",
    "London",
    13,
    "d2d4 d7d5 c1f4 g8f6 e2e3 c7c6 g1f3 c8f5 c2c4 d8b6 d1b3 b6b3 a2b3 e7e6 b1c3 b8d7 f1e2 f8e7",
  ),
  line(
    "slav-london-mainline",
    "London",
    11,
    "d2d4 d7d5 c1f4 g8f6 e2e3 c7c6 g1f3 c8f5 f1d3 f5d3 d1d3 e7e6 e1g1 f8e7 c2c4 e8g8 b1c3 b8d7",
  ),

  line(
    "slav-english-transpose",
    "English · setup Slav",
    19,
    "c2c4 c7c6 d2d4 d7d5 g1f3 g8f6 b1c3 d5c4 a2a4 c8f5 e2e3 e7e6 f1c4 f8b4 e1g1 b8d7",
  ),
  line(
    "slav-english-g3",
    "English · setup Slav",
    17,
    "c2c4 c7c6 g1f3 d7d5 g2g3 g8f6 f1g2 c8f5 e1g1 e7e6 d2d3 f8e7 d1c2 e8g8 b1d2 b8d7 b2b3 h7h6",
  ),
  line(
    "slav-english-b3",
    "English · setup Slav",
    12,
    "c2c4 c7c6 b2b3 d7d5 c1b2 g8f6 g1f3 c8f5 g2g3 e7e6 f1g2 f8e7 e1g1 e8g8 d2d3 b8d7 b1d2 h7h6",
  ),
  line(
    "slav-english-nc3",
    "English · setup Slav",
    10,
    "c2c4 c7c6 b1c3 d7d5 e2e3 g8f6 g1f3 c8f5 d2d4 e7e6 f1d3 f5d3 d1d3 f8e7 e1g1 e8g8",
  ),

  line(
    "slav-reti-c4-main",
    "Réti · c4",
    18,
    "g1f3 d7d5 c2c4 c7c6 d2d4 g8f6 b1c3 d5c4 a2a4 c8f5 e2e3 e7e6 f1c4 f8b4 e1g1 b8d7",
  ),
  line(
    "slav-reti-c4-e3",
    "Réti · c4",
    14,
    "g1f3 d7d5 c2c4 c7c6 e2e3 g8f6 b2b3 c8f5 c1b2 e7e6 f1e2 f8e7 e1g1 e8g8 d2d3 b8d7",
  ),
  line(
    "slav-reti-c4-g3",
    "Réti · c4",
    11,
    "g1f3 d7d5 c2c4 c7c6 g2g3 g8f6 f1g2 c8f5 e1g1 e7e6 d2d3 f8e7 b1d2 e8g8 b2b3 b8d7",
  ),

  line(
    "slav-jobava-c6",
    "Anti-Jobava",
    19,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c7c6 e2e3 c8f5 f2f3 e7e6 g2g4 f5g6 h2h4 h7h6 h4h5 g6h7 f1d3 h7d3 d1d3 b8d7",
  ),
  line(
    "slav-jobava-mirror",
    "Anti-Jobava",
    15,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5 f2f3 c7c5 e2e4 d5e4 d4d5 e4f3 d1f3 d8c8 e1c1 e7e6 f1b5 b8d7",
  ),
  line(
    "slav-jobava-a6",
    "Anti-Jobava",
    10,
    "d2d4 d7d5 b1c3 g8f6 c1f4 a7a6 e2e3 c8f5 g2g4 f5g6 h2h4 h7h6 h4h5 g6h7 f1d3 h7d3 d1d3 e7e6",
  ),

  line(
    "slav-colle-main",
    "Colle and Zukertort",
    18,
    "d2d4 d7d5 g1f3 g8f6 e2e3 c8f5 f1d3 f5d3 d1d3 c7c6 e1g1 b8d7 c2c4 e7e6 b1c3 f8d6 e3e4 d5e4",
  ),
  line(
    "slav-zukertort-b3",
    "Colle and Zukertort",
    14,
    "d2d4 d7d5 g1f3 g8f6 e2e3 c8f5 b2b3 e7e6 c1b2 f8e7 f1d3 f5d3 d1d3 e8g8 e1g1 c7c5",
  ),
  line(
    "slav-stonewall-bg4",
    "Colle and Zukertort",
    9,
    "d2d4 d7d5 e2e3 g8f6 f1d3 c7c6 f2f4 c8g4 g1f3 e7e6 e1g1 b8d7 b1d2 f8d6 d1e1 e8g8",
  ),

  line(
    "slav-reti-kia",
    "Réti · Fianchetto",
    17,
    "g1f3 d7d5 g2g3 c7c6 f1g2 c8f5 d2d3 g8f6 e1g1 e7e6 b1d2 f8e7 e2e4 f5g6 d1e2 e8g8",
  ),
  line(
    "slav-reti-b3",
    "Réti · Fianchetto",
    12,
    "g1f3 d7d5 b2b3 g8f6 c1b2 c7c6 e2e3 c8f5 f1e2 e7e6 e1g1 f8e7 d2d3 e8g8 b1d2 b8d7",
  ),

  line(
    "slav-english-e4-panov",
    "English · Early e4",
    16,
    "c2c4 c7c6 e2e4 d7d5 e4d5 c6d5 c4d5 g8f6 b1c3 f6d5 g1f3 b8c6 f1b5 d5c3 b2c3 d8d5 d1a4 c8d7 e1g1 e7e6",
  ),
  line(
    "slav-english-e5",
    "English · Early e4",
    10,
    "c2c4 c7c6 e2e4 d7d5 e4e5 c8f5 d2d4 e7e6 b1c3 g8e7 g1f3 b8d7 f1e2 d5c4 e2c4 e7d5 e1g1 f8e7",
  ),

  line(
    "slav-veresov",
    "Veresov and Gambits",
    16,
    "d2d4 d7d5 b1c3 g8f6 c1g5 c7c6 e2e3 c8f5 f1d3 f5d3 d1d3 b8d7 g1f3 e7e6 e1g1 f8e7 e3e4 d5e4",
  ),
  line(
    "slav-blackmar-diemer",
    "Veresov and Gambits",
    10,
    "d2d4 d7d5 e2e4 d5e4 b1c3 g8f6 f2f3 e4f3 g1f3 c7c6 f1c4 c8f5 e1g1 e7e6 f3e5 f5g6 h2h4 b8d7 d1e2 d7e5",
  ),

  line(
    "slav-larsen-b3",
    "Flank Openings",
    14,
    "b2b3 d7d5 c1b2 g8f6 g1f3 c7c6 e2e3 c8f5 f1e2 e7e6 e1g1 f8e7 d2d3 e8g8 b1d2 b8d7",
  ),
  line(
    "slav-grob-g3",
    "Flank Openings",
    10,
    "g2g3 d7d5 f1g2 c7c6 g1f3 c8f5 d2d3 g8f6 e1g1 e7e6 b1d2 f8e7 e2e4 f5g6 d1e2 e8g8",
  ),
];

const guidance: Record<string, { hint: string; explanation: string }> = {
  d7d5: { hint: "Claim the centre and limit White's transpositions.", explanation: "…d5 immediately establishes the Slav centre against d4, the Réti and flank openings." },
  c7c6: { hint: "Support d5 while keeping the c8 bishop's diagonal open.", explanation: "…c6 builds the Slav triangle without blocking the light-squared bishop." },
  g8f6: { hint: "Develop with control over e4 and prepare the bishop's development.", explanation: "…Nf6 develops naturally and increases central control." },
  c8f5: { hint: "Bring the bishop out before consolidating with the e-pawn.", explanation: "…Bf5 solves the potentially bad bishop of the Slav structure." },
  c8g4: { hint: "Develop the bishop with tempo against the f3 knight.", explanation: "…Bg4 gets the bishop outside the pawn chain and creates a useful pin." },
  d5c4: { hint: "Temporarily surrender the centre and make White spend time recovering the pawn.", explanation: "…dxc4 is the thematic Main Slav choice and gains time for …Bf5." },
  b8c6: { hint: "Develop while increasing pressure on d4.", explanation: "…Nc6 activates the knight and supports central breaks." },
  b8d7: { hint: "Complete development without obstructing the c-pawn.", explanation: "…Nbd7 supports …e5 and keeps the Slav centre flexible." },
  e7e6: { hint: "Now that the c8 bishop is outside, consolidate the centre.", explanation: "…e6 supports d5 without trapping the light-squared bishop." },
  c7c5: { hint: "Challenge White's centre before the setup becomes automatic.", explanation: "…c5 is the most direct break against the London and other slow structures." },
  d8b6: { hint: "Put queen pressure on b2 and d4.", explanation: "…Qb6 exploits the weakened diagonal in systems with Bf4." },
  a7a6: { hint: "Stop Nb5 and prepare queenside expansion.", explanation: "…a6 is a flexible move against the Jobava and in Chebanenko structures." },
  f5d3: { hint: "Exchange White's most active bishop.", explanation: "…Bxd3 reduces White's attack and prevents the bishop from permanently targeting h7." },
};

export const slavGuidanceFor = (moves: UciMove[]) => moves.map((move) => guidance[move]).find(Boolean) ?? {
  hint: "Develop a piece, strike the centre or prepare …e5 without trapping the c8 bishop.",
  explanation: "This continuation keeps the Slav setup: a solid centre, active light-squared bishop and …c5 or …e5 breaks.",
};
