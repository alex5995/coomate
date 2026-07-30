import { catalanPositionEvaluations } from "./catalan-evaluations";
import { catalanGuidanceFor, catalanRepertoire } from "./catalan-repertoire";
import { catalanVariants } from "./catalan-variants";
import { grunfeldPositionEvaluations } from "./grunfeld-evaluations";
import { grunfeldGuidanceFor, grunfeldRepertoire } from "./grunfeld-repertoire";
import { grunfeldVariants } from "./grunfeld-variants";
import { sicilianPositionEvaluations } from "./sicilian-evaluations";
import { sicilianGuidanceFor, sicilianRepertoire } from "./sicilian-repertoire";
import { sicilianVariants } from "./sicilian-variants";
import { stockfishEvaluationMeta } from "./stockfish-evaluation";
import type { OpeningId, OpeningRepertoire, TrainerVariant } from "@/lib/types";

export const openings: OpeningRepertoire[] = [
  {
    id: "catalan",
    name: "Catalan Opening",
    shortName: "Catalan",
    description: "Play White with long-term pressure from the g2 bishop and a strong queen-side centre.",
    startMessage: "Play 1.d4 and build the Catalan with c4, g3 and Bg2.",
    playerColor: "w",
    lines: catalanRepertoire,
    variants: catalanVariants,
    moveOrderMoves: [],
    evaluation: stockfishEvaluationMeta,
    positionEvaluations: catalanPositionEvaluations,
    guidanceFor: catalanGuidanceFor,
  },
  {
    id: "sicilian",
    name: "Sicilian Defence",
    shortName: "Sicilian",
    description: "Play Black with the normal Dragon whenever White permits it, plus practical answers to the main anti-Sicilians.",
    startMessage: "White starts with 1.e4. Answer with 1...c5 and follow the selected White variation.",
    playerColor: "b",
    lines: sicilianRepertoire,
    variants: sicilianVariants,
    moveOrderMoves: [],
    evaluation: stockfishEvaluationMeta,
    positionEvaluations: sicilianPositionEvaluations,
    guidanceFor: sicilianGuidanceFor,
  },
  {
    id: "grunfeld",
    name: "Grünfeld Defence",
    shortName: "Grünfeld",
    description: "Play Black against White's main 3.Nc3 and 3.Nf3 systems.",
    startMessage: "White starts with 1.d4. Build the Grünfeld with ...Nf6 and ...g6.",
    playerColor: "b",
    lines: grunfeldRepertoire,
    variants: grunfeldVariants,
    moveOrderMoves: [],
    evaluation: stockfishEvaluationMeta,
    positionEvaluations: grunfeldPositionEvaluations,
    guidanceFor: grunfeldGuidanceFor,
  },
];

export const openingById = (id: OpeningId | null) => openings.find((opening) => opening.id === id) ?? null;

export const pickUniformVariant = (variants: TrainerVariant[], random = Math.random) => {
  const index = Math.min(variants.length - 1, Math.floor(random() * variants.length));
  return variants[index];
};
