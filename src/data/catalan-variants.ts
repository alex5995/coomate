import type { TrainerVariant } from "@/lib/types";

// Deliberately approximate frequencies for training priority, not official statistics.
export const catalanVariants: TrainerVariant[] = [
  { id: "catalan-closed", family: "Closed Catalan", label: "Closed Catalan", moves: "1.d4 d5 2.c4 e6 3.Nf3 Nf6 4.g3 Be7", description: "Build long-term pressure when Black keeps the central pawn chain intact.", probability: 24 },
  { id: "catalan-open", family: "Open Catalan", label: "Open Catalan · Modern Sharp", moves: "1.d4 d5 2.c4 e6 3.Nf3 Nf6 4.g3 dxc4", description: "Recover the c4 pawn through development and queenside pressure.", probability: 20 },
  { id: "catalan-indian", family: "Indian setup", label: "Indian move order · ...Nf6 and ...e6", moves: "1.d4 Nf6 2.c4 e6 3.g3 d5", description: "Choose Nf3 or the explicitly studied bishop-first development.", probability: 15 },
  { id: "catalan-slav", family: "Slav", label: "Slav · ...c6 and ...Bf5", moves: "1.d4 d5 2.c4 c6 3.Nf3 Bf5", description: "Use Qb3 and Bf4 to gain tempi against Black's queenside.", probability: 12 },
  { id: "catalan-tarrasch", family: "Tarrasch", label: "Tarrasch · ...c5", moves: "1.d4 d5 2.c4 e6 3.Nf3 Nf6 4.g3 c5", description: "Exchange in the centre and play against Black's isolated d-pawn.", probability: 10 },
  { id: "catalan-anti-nimzo", family: "Anti-Nimzo", label: "Anti-Nimzo · ...Nc6", moves: "1.d4 Nf6 2.c4 e6 3.Nf3 Nc6", description: "Keep the Catalan fianchetto while avoiding the usual Nimzo pin.", probability: 7 },
  { id: "catalan-marshall", family: "Marshall", label: "Marshall · early ...Nf6", moves: "1.d4 d5 2.c4 Nf6 3.cxd5 Nxd5", description: "Develop with tempo against Black's exposed central knight.", probability: 5 },
  { id: "catalan-albin", family: "Albin", label: "Albin Counter-Gambit · ...e5", moves: "1.d4 d5 2.c4 e5", description: "Contain Black's advanced centre with precise development and central pressure.", probability: 3 },
  { id: "catalan-hungarian", family: "Hungarian Gambit", label: "Hungarian Gambit · ...e5", moves: "1.d4 Nf6 2.c4 e6 3.g3 e5", description: "Meet the rare early pawn sacrifice without abandoning development.", probability: 2 },
  { id: "catalan-neo", family: "Neo-Catalan", label: "Neo-Catalan · 1.c4", moves: "1.c4 e6 2.Nf3 d5 3.g3", description: "Reach the Catalan structure from the English move order.", probability: 2 },
];
