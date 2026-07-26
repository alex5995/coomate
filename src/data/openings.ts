import { caroKannPositionEvaluations } from "./caro-kann-evaluations";
import { catalanPositionEvaluations } from "./catalan-evaluations";
import { catalanGuidanceFor, catalanRepertoire } from "./catalan-repertoire";
import { catalanVariants } from "./catalan-variants";
import { grunfeldPositionEvaluations } from "./grunfeld-evaluations";
import { grunfeldGuidanceFor, grunfeldRepertoire } from "./grunfeld-repertoire";
import { grunfeldVariants } from "./grunfeld-variants";
import { londonPositionEvaluations } from "./london-evaluations";
import { londonGuidanceFor, londonRepertoire } from "./london-repertoire";
import { londonVariants } from "./london-variants";
import { guidanceFor, repertoire } from "./repertoire";
import { nimzoLarsenBlackGuidanceFor, nimzoLarsenBlackRepertoire } from "./nimzo-larsen-black-repertoire";
import { nimzoLarsenBlackVariants } from "./nimzo-larsen-black-variants";
import { nimzoLarsenWhiteGuidanceFor, nimzoLarsenWhiteRepertoire } from "./nimzo-larsen-white-repertoire";
import { nimzoLarsenWhiteVariants } from "./nimzo-larsen-white-variants";
import { slavPositionEvaluations } from "./slav-evaluations";
import { slavGuidanceFor, slavRepertoire } from "./slav-repertoire";
import { slavVariants } from "./slav-variants";
import { sicilianPositionEvaluations } from "./sicilian-evaluations";
import { sicilianGuidanceFor, sicilianRepertoire } from "./sicilian-repertoire";
import { sicilianVariants } from "./sicilian-variants";
import { stockfishEvaluationMeta } from "./stockfish-evaluation";
import { trainerVariants } from "./trainer-variants";
import type { OpeningId, OpeningRepertoire, TrainerVariant } from "@/lib/types";

export const openings: OpeningRepertoire[] = [
  {
    id: "catalan",
    name: "Catalan Opening",
    shortName: "Catalan",
    description: "Play White using only the Catalan lines curated in the source study.",
    startMessage: "Play 1.d4 or the studied Neo-Catalan 1.c4 move order, depending on the selected variation.",
    playerColor: "w",
    lines: catalanRepertoire,
    variants: catalanVariants,
    moveOrderMoves: ["g1f3", "g2g3", "f1g2", "b1d2", "e1g1"],
    evaluation: stockfishEvaluationMeta,
    positionEvaluations: catalanPositionEvaluations,
    guidanceFor: catalanGuidanceFor,
  },
  {
    id: "sicilian",
    name: "Sicilian Defence",
    shortName: "Sicilian",
    description: "Play Black with the Dragon whenever White permits it, plus studied answers to the Alapin and Closed Sicilian.",
    startMessage: "White will play 1.e4. Answer with 1...c5 and follow the selected White variation.",
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
    description: "Play Black against White's studied 3.Nc3 and 3.Nf3 systems.",
    startMessage: "White will play 1.d4. Build the Grünfeld with ...Nf6 and ...g6.",
    playerColor: "b",
    lines: grunfeldRepertoire,
    variants: grunfeldVariants,
    moveOrderMoves: ["f8g7", "e8g8", "c7c5", "d8a5", "b8c6", "c8g4"],
    evaluation: stockfishEvaluationMeta,
    positionEvaluations: grunfeldPositionEvaluations,
    guidanceFor: grunfeldGuidanceFor,
  },
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
    evaluation: stockfishEvaluationMeta,
    positionEvaluations: caroKannPositionEvaluations,
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
    evaluation: stockfishEvaluationMeta,
    positionEvaluations: londonPositionEvaluations,
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
    evaluation: stockfishEvaluationMeta,
    positionEvaluations: slavPositionEvaluations,
    guidanceFor: slavGuidanceFor,
  },
  {
    id: "nimzo-larsen-white",
    name: "Nimzo-Larsen System - White",
    shortName: "Nimzo-Larsen White",
    description: "Play White with b3, Bb2 and e3, then use the bishop trade and f4 to control e5.",
    startMessage: "Play 1.b3 and build the Nimzo-Larsen setup from the video.",
    playerColor: "w",
    lines: nimzoLarsenWhiteRepertoire,
    variants: nimzoLarsenWhiteVariants,
    moveOrderMoves: [],
    evaluation: stockfishEvaluationMeta,
    guidanceFor: nimzoLarsenWhiteGuidanceFor,
  },
  {
    id: "nimzo-larsen-black",
    name: "Nimzo-Larsen System - Black",
    shortName: "Nimzo-Larsen Black",
    description: "Play the reversed setup with ...b6, ...Bb7 and ...e6, targeting e4 with ...Bb4 and ...f5.",
    startMessage: "White moves first. Build ...b6, ...Bb7 and ...e6, then react to the centre.",
    playerColor: "b",
    lines: nimzoLarsenBlackRepertoire,
    variants: nimzoLarsenBlackVariants,
    moveOrderMoves: [],
    evaluation: stockfishEvaluationMeta,
    guidanceFor: nimzoLarsenBlackGuidanceFor,
  },
];

export const openingById = (id: OpeningId | null) => openings.find((opening) => opening.id === id) ?? null;

export const pickUniformVariant = (variants: TrainerVariant[], random = Math.random) => {
  const index = Math.min(variants.length - 1, Math.floor(random() * variants.length));
  return variants[index];
};
