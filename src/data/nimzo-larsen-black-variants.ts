import type { TrainerVariant } from "@/lib/types";

// Approximate practical frequencies, ordered and normalised to 100.
export const nimzoLarsenBlackVariants: TrainerVariant[] = [
  {
    id: "nl-black-queens-gambit",
    family: "Queen's Gambit",
    label: "1.d4 · Queen's Gambit",
    moves: "1.d4 b6 2.c4 Bb7 3.Nc3 e6",
    description: "Use ...Bb4 to trade for the c3 knight, then seek ...f5, ...Nf6 and kingside castling.",
    probability: 24,
  },
  {
    id: "nl-black-e4",
    family: "King's pawn · e4",
    label: "1.e4 · King's pawn centre",
    moves: "1.e4 b6 2.d4 Bb7 3.Bd3 e6",
    description: "When ...f5 is unavailable, challenge the centre with pieces and a timely ...c5 or ...d5.",
    probability: 20,
  },
  {
    id: "nl-black-london",
    family: "Queen's pawn · London",
    label: "1.d4 · London System",
    moves: "1.d4 b6 2.Nf3 Bb7 3.Bf4 e6",
    description: "Complete the reversed setup and use ...Bb4+, ...f5 or central pressure from White's move order.",
    probability: 15,
  },
  {
    id: "nl-black-colle",
    family: "Colle and Zukertort",
    label: "1.d4 · Colle and Zukertort",
    moves: "1.d4 b6 2.Nf3 Bb7 3.e3 e6",
    description: "Use ...f5 when safe and meet White's quiet centre with active development.",
    probability: 13,
  },
  {
    id: "nl-black-english",
    family: "English",
    label: "1.c4 · English Opening",
    moves: "1.c4 b6 2.Nc3 Bb7 3.e4 e6",
    description: "Pin or exchange the c3 knight, then attack e4 with ...f5 and ...Nf6.",
    probability: 10,
  },
  {
    id: "nl-black-reti",
    family: "Réti",
    label: "1.Nf3 · Réti",
    moves: "1.Nf3 b6 2.g3 Bb7 3.Bg2 e6",
    description: "Choose ...f5 or a direct central break after White reveals the structure.",
    probability: 8,
  },
  {
    id: "nl-black-jobava",
    family: "Jobava and Veresov",
    label: "1.d4 · Jobava and Veresov",
    moves: "1.d4 b6 2.Nc3 Bb7 3.e4 e6",
    description: "Use ...Bb4 to exchange the attacking knight and undermine White's e4 centre.",
    probability: 6,
  },
  {
    id: "nl-black-flank",
    family: "Flank openings",
    label: "1.b3 · Larsen mirror",
    moves: "1.b3 b6 2.Bb2 Bb7 3.e3 e6",
    description: "Complete the mirrored setup and use ...f5 or ...Nf6 according to White's development.",
    probability: 4,
  },
];
