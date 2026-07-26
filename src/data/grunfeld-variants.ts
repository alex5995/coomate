import type { TrainerVariant } from "@/lib/types";

// Deliberately approximate frequencies for training priority, not official statistics.
export const grunfeldVariants: TrainerVariant[] = [
  { id: "grunfeld-exchange", family: "Exchange", label: "3.Nc3 · Exchange Variation", moves: "1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5", description: "Choose among the study's e4 setups and attack White's broad centre.", probability: 34 },
  { id: "grunfeld-no-exchange", family: "No exchange", label: "3.Nc3 · no early exchange", moves: "1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.Nf3", description: "Use the fianchetto and ...c5 when White keeps the central tension.", probability: 22 },
  { id: "grunfeld-knight-takes", family: "Knight recapture", label: "Exchange · 5.Nxd5", moves: "1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.cxd5 Nxd5 5.Nxd5", description: "Recapture with the queen and develop actively against d4.", probability: 16 },
  { id: "grunfeld-nf3-quiet", family: "Quiet Nf3", label: "3.Nf3 · quiet setup", moves: "1.d4 Nf6 2.c4 g6 3.Nf3 Bg7 4.e3", description: "Stay flexible while White delays Nc3.", probability: 12 },
  { id: "grunfeld-bishop-pin", family: "Bishop pin", label: "3.Nc3 · Bg5 pin", moves: "1.d4 Nf6 2.c4 g6 3.Nc3 d5 4.Nf3 Bg7 5.Bg5", description: "Answer the pin with the study's central knight jump.", probability: 9 },
  { id: "grunfeld-nf3-catalan", family: "Catalan setup", label: "3.Nf3 · Catalan g3", moves: "1.d4 Nf6 2.c4 g6 3.Nf3 Bg7 4.g3", description: "Use ...c6 against White's fianchetto move order.", probability: 7 },
];
