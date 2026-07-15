import type { RepertoireLine, UciMove } from "@/lib/types";

const line = (
  id: string,
  family: RepertoireLine["family"],
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

export const repertoire: RepertoireLine[] = [
  line(
    "advance-main",
    "Advance",
    24,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c8f5 g1f3 e7e6 f1e2 c6c5 c2c3 b8c6 e1g1 c5d4 c3d4 g8e7 b1c3 e7c8",
  ),
  line(
    "advance-shirov",
    "Advance",
    11,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c8f5 b1c3 e7e6 g1e2 c6c5 c1e3 b8c6 d4c5 g8e7 e2d4 c6d4 e3d4 e7c6",
  ),
  line(
    "advance-c3-main",
    "Advance",
    18,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c8f5 c2c3 e7e6 f1e2 c6c5 g1f3 b8c6 e1g1 f5g6 a2a3 c5d4 c3d4 g8e7 b1c3 g6h5",
  ),
  line(
    "advance-c3-early-capture",
    "Advance",
    10,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c8f5 c2c3 e7e6 f1e2 c6c5 g1f3 b8c6 e1g1 c5d4 c3d4 g8e7 b1c3 f5g4",
  ),
  line(
    "advance-tal",
    "Advance",
    13,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c8f5 h2h4 h7h5 f1d3 f5d3 d1d3 e7e6 g1f3 d8a5 c1d2 a5a6",
  ),
  line(
    "advance-botvinnik",
    "Advance",
    8,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c6c5 d4c5 b8c6 g1f3 c8g4 f1e2 e7e6 e1g1 f8c5 c2c4 g8e7",
  ),
  line(
    "advance-c5-c3-main",
    "Advance",
    18,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c6c5 c2c3 b8c6 g1f3 c8f5 f1e2 e7e6 e1g1 c5d4 c3d4 g8e7 b1c3 f5g4 c1e3 e7f5",
  ),
  line(
    "advance-c5-c3-early",
    "Advance",
    12,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c6c5 c2c3 c5d4 c3d4 b8c6 g1f3 c8f5 b1c3 e7e6 f1e2 g8e7 e1g1 e7g6 c1e3 f8e7",
  ),
  line(
    "advance-c5-nf3-capture",
    "Advance",
    18,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c6c5 g1f3 c5d4 f3d4 b8c6 d4c6 b7c6 f1d3 c8g4 d1d2 e7e6 e1g1 g8e7 c2c4 e7g6",
  ),
  line(
    "advance-c5-nf3-nc6",
    "Advance",
    16,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c6c5 g1f3 b8c6 d4c5 c8g4 f1e2 e7e6 e1g1 f8c5 c2c3 g8e7 b1d2 e7g6",
  ),
  line(
    "advance-c5-nf3-bg4",
    "Advance",
    12,
    "e2e4 c7c6 d2d4 d7d5 e4e5 c6c5 g1f3 c8g4 f1e2 e7e6 e1g1 b8c6 c2c3 g8e7 b1d2 e7g6 f1e1 f8e7",
  ),
  line(
    "classical-main",
    "Classical",
    10,
    "e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4 c8f5 e4g3 f5g6 h2h4 h7h6 g1f3 b8d7 h4h5 g6h7 f1d3 h7d3 d1d3 e7e6",
  ),
  line(
    "classical-tartakower",
    "Classical",
    26,
    "e2e4 c7c6 d2d4 d7d5 b1c3 d5e4 c3e4 g8f6 e4f6 e7f6 g1f3 f8d6 f1d3 e8g8 e1g1 f8e8 c2c3 b8d7 d1c2 d7f8 c1e3 c8e6 f1e1 d8d7",
  ),
  line(
    "classical-nd2",
    "Classical",
    10,
    "e2e4 c7c6 d2d4 d7d5 b1d2 d5e4 d2e4 c8f5 e4g3 f5g6 g1f3 b8d7 f1d3 g6d3 d1d3 e7e6 e1g1 g8f6",
  ),
  line(
    "classical-nd2-tartakower",
    "Classical",
    16,
    "e2e4 c7c6 d2d4 d7d5 b1d2 d5e4 d2e4 g8f6 e4f6 e7f6 g1f3 f8d6 f1d3 e8g8 e1g1 f8e8 c2c3 b8d7 d1c2 d7f8",
  ),
  line(
    "exchange-main",
    "Exchange",
    13,
    "e2e4 c7c6 d2d4 d7d5 e4d5 c6d5 f1d3 b8c6 c2c3 g8f6 c1f4 c8g4 d1b3 d8d7 b1d2 e7e6 g1f3 f8d6 f4d6 d7d6 b3b7 a8b8 b7a6 e8g8",
  ),
  line(
    "exchange-nf6",
    "Exchange",
    13,
    "e2e4 c7c6 d2d4 d7d5 e4d5 c6d5 f1d3 g8f6 c2c3 b8c6 c1f4 c8g4 g1f3 e7e6 b1d2 f8d6 f4d6 d8d6 e1g1 e8g8 f1e1 a8b8",
  ),
  line(
    "exchange-white-nf3-nc6",
    "Exchange",
    14,
    "e2e4 c7c6 d2d4 d7d5 e4d5 c6d5 g1f3 b8c6 f1d3 c8g4 c2c3 e7e6 c1f4 f8d6 f4d6 d8d6 b1d2 g8f6 e1g1 e8g8 f1e1 a8b8",
  ),
  line(
    "exchange-white-nf3-nf6",
    "Exchange",
    11,
    "e2e4 c7c6 d2d4 d7d5 e4d5 c6d5 g1f3 g8f6 f1d3 b8c6 e1g1 c8g4 c2c3 e7e6 c1f4 f8d6 f4d6 d8d6 b1d2 e8g8 f1e1 a8b8",
  ),
  line(
    "panov-main",
    "Panov",
    14,
    "e2e4 c7c6 d2d4 d7d5 e4d5 c6d5 c2c4 g8f6 b1c3 b8c6 g1f3 c8g4 c4d5 f6d5 f1e2 e7e6 e1g1 f8e7",
  ),
  line(
    "panov-nc6",
    "Panov",
    7,
    "e2e4 c7c6 d2d4 d7d5 e4d5 c6d5 c2c4 b8c6 g1f3 g8f6 b1c3 c8g4 c4d5 f6d5 f1e2 e7e6 e1g1 f8e7",
  ),
  line(
    "fantasy-main",
    "Fantasy",
    10,
    "e2e4 c7c6 d2d4 d7d5 f2f3 d5e4 f3e4 e7e5 g1f3 e5d4 f1c4 g8f6 e1g1 f8e7 e4e5 f6d5 d1d4 c8e6",
  ),
  line(
    "fantasy-e6",
    "Fantasy",
    6,
    "e2e4 c7c6 d2d4 d7d5 f2f3 d8b6 b1c3 d5e4 f3e4 e7e5 g1f3 e5d4 d1d4 b6d4 f3d4 g8f6",
  ),
  line(
    "two-knights-bg4",
    "Two Knights",
    15,
    "e2e4 c7c6 b1c3 d7d5 g1f3 c8g4 h2h3 g4f3 d1f3 e7e6 d2d4 g8f6 f1d3 d5e4 c3e4 b8d7 e1g1 f8e7",
  ),
  line(
    "two-knights-nf6",
    "Two Knights",
    10,
    "e2e4 c7c6 b1c3 d7d5 g1f3 g8f6 e4e5 f6e4 c3e2 c8g4 f3d4 g4e2 d1e2 e7e6 d2d3 b8d7 f2f3 e4c5",
  ),
];

export const blackMoveGuidance: Record<string, { hint: string; explanation: string }> = {
  c7c6: { hint: "Prepare a central push while keeping the light-squared bishop free.", explanation: "…c6 prepares …d5 - the founding idea of the Caro-Kann." },
  d7d5: { hint: "Challenge the e4 pawn immediately with a well-supported pawn.", explanation: "…d5 occupies the centre and challenges e4." },
  c8f5: { hint: "Bring the bishop outside the pawn chain before closing it.", explanation: "…Bf5 develops the bad bishop before …e6." },
  c8g4: { hint: "Develop the bishop with tempo against the f3 knight before consolidating.", explanation: "…Bg4 pins the knight and gets the light-squared bishop outside before …e6." },
  c6c5: { hint: "Attack the base of White's pawn chain.", explanation: "…c5 is the thematic break against the d4–e5 centre." },
  d5e4: { hint: "Remove the central pawn and prepare natural development.", explanation: "…dxe4 clarifies the centre before developing the bishop." },
  g8f6: { hint: "Develop with tempo; if White's knight is on e4, offer the exchange.", explanation: "…Nf6 develops with tempo and, in the Classical, offers the Tartakower after Nxf6+ exf6." },
  e7e6: { hint: "Reinforce d5 and open the kingside bishop's diagonal.", explanation: "…e6 makes the centre solid after the c8 bishop has developed." },
  h7h6: { hint: "Create a retreat square for the bishop without weakening the king too much.", explanation: "…h6 prepares …Bh7 in the Classical line." },
  h7h5: { hint: "Stop the h-pawn while keeping your bishop active.", explanation: "…h5 is the thematic response to the Tal Variation." },
  b8c6: { hint: "Develop with direct pressure on d4.", explanation: "…Nc6 increases pressure on White's centre." },
  e7e5: { hint: "React energetically while White's centre is still fragile.", explanation: "…e5 is the main break against the Fantasy Variation." },
};

export const guidanceFor = (moves: UciMove[]) => {
  const known = moves.map((move) => blackMoveGuidance[move]).find(Boolean);
  return known ?? {
    hint: "Develop with tempo or increase the pressure on the centre.",
    explanation: "This continuation keeps a theoretically sound position.",
  };
};
