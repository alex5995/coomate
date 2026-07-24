import type { TrainerVariant } from "@/lib/types";

// Approximate practical frequencies, ordered and normalised to 100.
export const nimzoLarsenWhiteVariants: TrainerVariant[] = [
  {
    id: "nl-white-classical",
    family: "Classical …d5/…Nc6",
    label: "Classical · …d5 and …Nc6",
    moves: "1.b3 d5 2.Bb2 Nc6 3.e3",
    description: "Use Bb5 and Bxc6 when available, then build f4, Nf3 and kingside pressure.",
    probability: 26,
  },
  {
    id: "nl-white-kings-indian",
    family: "King's Indian …Nf6/…g6",
    label: "King's Indian setup · …Nf6 and …g6",
    moves: "1.b3 Nf6 2.Bb2 g6 3.e3 Bg7",
    description: "Keep the b3, Bb2 and e3 shell, castle quickly and choose f4 or a quieter central build.",
    probability: 18,
  },
  {
    id: "nl-white-e5",
    family: "…e5 and …Nc6",
    label: "Central space · …e5 and …Nc6",
    moves: "1.b3 e5 2.Bb2 Nc6 3.e3",
    description: "Pin or exchange the c6 knight, then challenge e5 with f4 and piece pressure.",
    probability: 16,
  },
  {
    id: "nl-white-c5",
    family: "…c5 and …Nc6",
    label: "Queenside pressure · …c5",
    moves: "1.b3 c5 2.Bb2 Nc6 3.e3",
    description: "Trade the c6 knight when useful and occupy e5 after completing development.",
    probability: 14,
  },
  {
    id: "nl-white-c6",
    family: "…c6 blocks Bb5",
    label: "Adaptive setup · …c6",
    moves: "1.b3 d5 2.Bb2 c6 3.e3",
    description: "When Bb5 is unavailable, omit the exchange plan and develop through Nf3, Be2 and O-O.",
    probability: 11,
  },
  {
    id: "nl-white-dutch",
    family: "Dutch …f5",
    label: "Dutch structure · …f5",
    moves: "1.b3 f5 2.Bb2 Nf6 3.e3",
    description: "Fight for e5 with the same piece setup and avoid forcing f4 into a closed square.",
    probability: 8,
  },
  {
    id: "nl-white-mirror",
    family: "Mirror …b6",
    label: "Mirror · …b6 and …Bb7",
    moves: "1.b3 b6 2.Bb2 Bb7 3.e3",
    description: "Use the first-move tempo to claim e5 before Black completes the mirrored setup.",
    probability: 7,
  },
];
