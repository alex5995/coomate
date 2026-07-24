import { londonGuidanceFor, londonRepertoire } from "./london-repertoire";
import { londonVariants } from "./london-variants";
import { guidanceFor, repertoire } from "./repertoire";
import { slavGuidanceFor, slavRepertoire } from "./slav-repertoire";
import { slavVariants } from "./slav-variants";
import { trainerVariants } from "./trainer-variants";
import { nimzoLarsenBlackGuidanceFor, nimzoLarsenBlackRepertoire } from "./nimzo-larsen-black-repertoire";
import { nimzoLarsenBlackVariants } from "./nimzo-larsen-black-variants";
import { nimzoLarsenWhiteGuidanceFor, nimzoLarsenWhiteRepertoire } from "./nimzo-larsen-white-repertoire";
import { nimzoLarsenWhiteVariants } from "./nimzo-larsen-white-variants";
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
  {
    id: "nimzo-larsen-white",
    name: "Nimzo-Larsen System - White",
    shortName: "Nimzo-Larsen White",
    description: "Play White with b3, Bb2 and e3, then use the bishop trade and f4 to control e5.",
    startMessage: "Play 1.b3 and build the Nimzo-Larsen setup from the video.",
    playerColor: "w",
    lines: nimzoLarsenWhiteRepertoire,
    variants: nimzoLarsenWhiteVariants,
    moveOrderMoves: ["c1b2", "f1b5", "f2f4", "g1f3", "f1e2", "d2d3", "b1d2", "e1g1", "f3e5"],
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
    moveOrderMoves: ["c8b7", "f8b4", "f7f5", "g8f6", "f8e7", "d7d6", "e8g8"],
    guidanceFor: nimzoLarsenBlackGuidanceFor,
  },
];

export const openingById = (id: OpeningId | null) => openings.find((opening) => opening.id === id) ?? null;

export const pickUniformVariant = (variants: TrainerVariant[], random = Math.random) => {
  const index = Math.min(variants.length - 1, Math.floor(random() * variants.length));
  return variants[index];
};
