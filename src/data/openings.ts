import { jobavaGuidanceFor, jobavaRepertoire } from "./jobava-repertoire";
import { jobavaVariants } from "./jobava-variants";
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
    guidanceFor,
  },
  {
    id: "jobava-london",
    name: "Jobava London",
    shortName: "Jobava",
    description: "Play White with Nc3, Bf4 and active plans against Black's most common replies.",
    startMessage: "Play 1.d4 and build your Jobava London as White.",
    playerColor: "w",
    lines: jobavaRepertoire,
    variants: jobavaVariants,
    guidanceFor: jobavaGuidanceFor,
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
    guidanceFor: slavGuidanceFor,
  },
];

export const openingById = (id: OpeningId | null) => openings.find((opening) => opening.id === id) ?? null;

export const pickUniformVariant = (variants: TrainerVariant[], random = Math.random) => {
  const index = Math.min(variants.length - 1, Math.floor(random() * variants.length));
  return variants[index];
};
