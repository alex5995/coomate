import type { TrainerVariant } from "@/lib/types";

// Deliberately approximate frequencies, ordered and normalised to 100.
export const slavVariants: TrainerVariant[] = [
  { id: "slav-queens-gambit", family: "Slav · Queen's Gambit", label: "1.d4 · Queen's Gambit", moves: "1.d4 d5 2.c4 c6", description: "Main Slav, quiet line, Exchange and Chebanenko - all with the bishop outside.", probability: 30 },
  { id: "slav-london", family: "London", label: "1.d4 · London System", moves: "1.d4 d5 2.Nf3 Nf6 3.Bf4", description: "…Bf5, the exchange on d3, …Qb6 pressure and a quick …c5 break.", probability: 16 },
  { id: "slav-english", family: "English · setup Slav", label: "1.c4 · English Opening", moves: "1.c4 c6", description: "Transpose to a Slav or use the …c6–…d5 setup against g3, b3 and e3.", probability: 14 },
  { id: "slav-reti-c4", family: "Réti · c4", label: "1.Nf3 · Réti with c4", moves: "1.Nf3 d5 2.c4 c6", description: "Handle d4, e3 and g3 without leaving your Slav system.", probability: 10 },
  { id: "slav-jobava", family: "Anti-Jobava", label: "1.d4 · Jobava London", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4", description: "…c6, …Bf5 and …a6 against Nb5 and the aggressive f3–g4 expansion.", probability: 9 },
  { id: "slav-colle", family: "Colle and Zukertort", label: "1.d4 · Colle and Zukertort", moves: "1.d4 d5 2.Nf3 Nf6 3.e3", description: "Get the bishop out before White builds an unopposed e4 centre.", probability: 7 },
  { id: "slav-reti-fianchetto", family: "Réti · Fianchetto", label: "1.Nf3 · Réti and fianchetto", moves: "1.Nf3 d5 2.g3 / 2.b3", description: "Use the …d5–…c6 centre and a bishop on f5 against KIA and Zukertort.", probability: 5 },
  { id: "slav-english-e4", family: "English · Early e4", label: "1.c4 · English with e4", moves: "1.c4 c6 2.e4 d5", description: "Transpose to Panov or Advance structures using familiar Caro-Kann ideas.", probability: 4 },
  { id: "slav-veresov", family: "Veresov and Gambits", label: "1.d4 · Veresov and gambits", moves: "1.d4 d5 2.Nc3 / 2.e4", description: "Concrete replies to Bg5 and the Blackmar-Diemer, always with rapid development.", probability: 3 },
  { id: "slav-flank", family: "Flank Openings", label: "1.b3 / 1.g3 · Flank openings", moves: "1.b3 d5 or 1.g3 d5", description: "Occupy the centre and rebuild your Slav setup against rare first moves.", probability: 2 },
];
