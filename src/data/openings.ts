import { londonGuidanceFor, londonRepertoire } from "./london-repertoire";
import { londonVariants } from "./london-variants";
import { guidanceFor, repertoire } from "./repertoire";
import { slavGuidanceFor, slavRepertoire } from "./slav-repertoire";
import { slavVariants } from "./slav-variants";
import { trainerVariants } from "./trainer-variants";
import type { OpeningId, OpeningRepertoire, TrainerVariant } from "@/lib/types";

export const openings: OpeningRepertoire[] = [
  {
    id: "caro-kann",
    name: "Caro-Kann Defence",
    shortName: "Caro-Kann",
    description: "Play Black against White's main choices and build a practical middlegame repertoire.",
    startMessage: "White will play 1.e4. Build your Caro-Kann from the very first move.",
    playerColor: "b",
    lines: repertoire,
    variants: trainerVariants,
    moveOrderMoves: ["c8f5", "c8g4", "g8f6", "g8e7", "b8c6", "b8d7", "e7e6", "f8e7", "f8d6", "f8c5", "e8g8"],
    guidanceFor,
  },
  {
    id: "london-system",
    name: "London System",
    shortName: "London",
    description: "Play White with a resilient d4, Nf3, Bf4 and e3 setup against Black's main replies.",
    startMessage: "Play 1.d4 and build a flexible London System as White.",
    playerColor: "w",
    lines: londonRepertoire,
    variants: londonVariants,
    moveOrderMoves: ["c1f4", "g1f3", "e2e3", "c2c3", "f1d3", "f1e2", "b1d2", "h2h3", "e1g1", "f3e5"],
    guidanceFor: londonGuidanceFor,
  },
  {
    id: "slav-universal",
    name: "Universal Slav System",
    shortName: "Universal Slav",
    description: "Play Black against 1.d4, the English, the Réti and flank openings. White will never play 1.e4.",
    startMessage: "White will begin with 1.d4, 1.c4, 1.Nf3 or a flank move, depending on the selected variation.",
    playerColor: "b",
    lines: slavRepertoire,
    variants: slavVariants,
    moveOrderMoves: ["d7d5", "c7c6", "c8f5", "c8g4", "g8f6", "g8e7", "b8c6", "b8d7", "e7e6", "f8e7", "f8d6", "f8b4", "e8g8"],
    guidanceFor: slavGuidanceFor,
  },
];

export const openingById = (id: OpeningId | null) => openings.find((opening) => opening.id === id) ?? null;

export const pickUniformVariant = (variants: TrainerVariant[], random = Math.random) => {
  const index = Math.min(variants.length - 1, Math.floor(random() * variants.length));
  return variants[index];
};
