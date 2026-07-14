import { jobavaGuidanceFor, jobavaRepertoire } from "./jobava-repertoire";
import { jobavaVariants } from "./jobava-variants";
import { guidanceFor, repertoire } from "./repertoire";
import { trainerVariants } from "./trainer-variants";
import type { OpeningId, OpeningRepertoire, TrainerVariant } from "@/lib/types";

export const openings: OpeningRepertoire[] = [
  {
    id: "caro-kann",
    name: "Difesa Caro-Kann",
    shortName: "Caro-Kann",
    description: "Gioca con il Nero contro le principali scelte del Bianco, fino al middlegame.",
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
    playerColor: "w",
    lines: jobavaRepertoire,
    variants: jobavaVariants,
    guidanceFor: jobavaGuidanceFor,
  },
];

export const openingById = (id: OpeningId | null) => openings.find((opening) => opening.id === id) ?? null;

export const pickUniformVariant = (variants: TrainerVariant[], random = Math.random) => {
  const index = Math.min(variants.length - 1, Math.floor(random() * variants.length));
  return variants[index];
};
