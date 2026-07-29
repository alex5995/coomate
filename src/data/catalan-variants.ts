import type { TrainerVariant } from "@/lib/types";

// Deliberately approximate frequencies for training priority, not official statistics.
export const catalanVariants: TrainerVariant[] = [
  { id: "catalan-closed", family: "Closed Catalan", label: "Closed Catalan", moves: "1.d4 d5 2.c4 e6 3.Nf3 Nf6 4.g3 Be7", description: "Build long-term pressure when Black keeps the central pawn chain intact.", probability: 24 },
  { id: "catalan-open", family: "Open Catalan", label: "Open Catalan · Modern Sharp", moves: "1.d4 d5 2.c4 e6 3.Nf3 Nf6 4.g3 dxc4", description: "Recover the c4 pawn through development and queenside pressure.", probability: 20 },
  { id: "catalan-indian", family: "Indian setup", label: "Indian move order · ...Nf6 and ...e6", moves: "1.d4 Nf6 2.c4 e6 3.g3 d5", description: "Choose Nf3 or the bishop-first development from the same flexible position.", probability: 15 },
  { id: "catalan-slav", family: "Slav", label: "Slav · ...c6 and ...Bf5", moves: "1.d4 d5 2.c4 c6 3.Nf3 Bf5", description: "Use Qb3 and Bf4 to gain tempi against Black's queenside.", probability: 12 },
  { id: "catalan-tarrasch", family: "Tarrasch", label: "Tarrasch · ...c5", moves: "1.d4 d5 2.c4 e6 3.Nf3 Nf6 4.g3 c5", description: "Exchange in the centre and play against Black's isolated d-pawn.", probability: 10 },
  { id: "catalan-anti-nimzo", family: "Anti-Nimzo", label: "Anti-Nimzo · ...Nc6", moves: "1.d4 Nf6 2.c4 e6 3.Nf3 Nc6", description: "Keep the Catalan fianchetto while avoiding the usual Nimzo pin.", probability: 7 },
  { id: "catalan-marshall", family: "Marshall", label: "Marshall · early ...Nf6", moves: "1.d4 d5 2.c4 Nf6 3.cxd5 Nxd5", description: "Develop with tempo against Black's exposed central knight.", probability: 5 },
  { id: "catalan-benoni", family: "Old Benoni", label: "Old Benoni · 1...c5", moves: "1.d4 c5 2.d5 e6 3.c4 exd5 4.cxd5 d6 5.Nf3 Nf6 6.g3 g6 7.Bg2 Bg7 8.O-O O-O 9.Nc3", description: "Transpose into a Fianchetto Benoni and use the extra central space for an e4-e5 break.", probability: 3 },
  { id: "catalan-albin", family: "Albin", label: "Albin Counter-Gambit · ...e5", moves: "1.d4 d5 2.c4 e5", description: "Contain Black's advanced centre with precise development and central pressure.", probability: 2 },
  { id: "catalan-budapest", family: "Budapest Gambit", label: "Budapest Gambit · 2...e5", moves: "1.d4 Nf6 2.c4 e5 3.dxe5 Ng4 4.g3", description: "Fianchetto the light-squared bishop, return the pawn and gain space by driving back the e5 knight.", probability: 2 },
];
