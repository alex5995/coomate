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
    name: "Difesa Caro-Kann",
    shortName: "Caro-Kann",
    description: "Gioca con il Nero contro le principali scelte del Bianco, fino al middlegame.",
    startMessage: "Il Bianco giocherà 1.e4. Rispondi costruendo la tua Caro-Kann.",
    playerColor: "b",
    lines: repertoire,
    variants: trainerVariants,
    guidanceFor,
  },
  {
    id: "jobava-london",
    name: "Jobava London",
    shortName: "Jobava",
    description: "Gioca con il Bianco: Nc3, Bf4 e piani attivi contro le risposte più comuni del Nero.",
    startMessage: "Gioca 1.d4 e costruisci il tuo Jobava London con il Bianco.",
    playerColor: "w",
    lines: jobavaRepertoire,
    variants: jobavaVariants,
    guidanceFor: jobavaGuidanceFor,
  },
  {
    id: "slav-universal",
    name: "Sistema Slav universale",
    shortName: "Slav",
    description: "Gioca con il Nero contro 1.d4, Inglese, Réti e aperture di fianco. Il Bianco non giocherà mai 1.e4.",
    startMessage: "Il Bianco inizierà con 1.d4, 1.c4, 1.Nf3 o una mossa di fianco, secondo la variante scelta.",
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
