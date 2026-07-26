import type { TrainerVariant } from "@/lib/types";

// The accelerated and hyperaccelerated Dragon chapters are intentionally omitted:
// they are Black repertoire choices, not White opponent variations.
export const sicilianVariants: TrainerVariant[] = [
  { id: "sicilian-dragon-yugoslav", family: "Dragon Yugoslav", label: "Dragon · Yugoslav Attack", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be3 Bg7 7.f3 Nc6 8.Qd2 O-O 9.Bc4", description: "Meet White's most aggressive setup with ...Bd7 and ...Rc8.", probability: 30 },
  { id: "sicilian-dragon-classical", family: "Dragon Classical", label: "Dragon · Classical Be2", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be2", description: "Complete the Dragon setup against kingside castling.", probability: 25 },
  { id: "sicilian-dragon-main", family: "Dragon main line", label: "Dragon · main line without Bc4", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be3", description: "Use the central ...d5 break when White does not prevent it with Bc4.", probability: 20 },
  { id: "sicilian-alapin", family: "Alapin", label: "Alapin · 2.c3", moves: "1.e4 c5 2.c3", description: "Use the secondary study's ...Nf6 line when a Dragon setup is unavailable.", probability: 15 },
  { id: "sicilian-closed", family: "Closed", label: "Closed Sicilian · 2.Nc3", moves: "1.e4 c5 2.Nc3", description: "Use the secondary study's ...d6 setup when White avoids the open Sicilian.", probability: 10 },
];
