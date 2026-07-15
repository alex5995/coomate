import type { TrainerVariant } from "@/lib/types";

// Approximate frequencies, ordered and normalised to 100.
export const jobavaVariants: TrainerVariant[] = [
  { id: "jobava-e6", family: "Main line …e6", label: "Main line · …e6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 e6", description: "Black's soundest reply: Nb5 or positional development.", probability: 24 },
  { id: "jobava-bf5", family: "Mirror …Bf5", label: "Mirror · …Bf5", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 Bf5", description: "Black mirrors the bishop; react with the aggressive f3, g4 and e4 plan.", probability: 17 },
  { id: "jobava-c5", family: "…c5 Break", label: "Immediate break · …c5", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 c5", description: "The critical central reply, met by e4 or a sounder positional plan.", probability: 16 },
  { id: "jobava-c6", family: "…c6 Structure", label: "Slav structure · …c6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 c6", description: "Black supports d5; train both calm development and the f3–g4 expansion.", probability: 13 },
  { id: "jobava-g6", family: "…g6 Fianchetto", label: "Fianchetto · …g6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 g6", description: "Qd2, Bh6 and h4 target the king's main defender.", probability: 11 },
  { id: "jobava-a6", family: "Prophylaxis …a6", label: "Prophylaxis · …a6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 a6", description: "Black stops Nb5 but gives you a tempo for expansion.", probability: 7 },
  { id: "jobava-nc6", family: "Development …Nc6", label: "Development · …Nc6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 Nc6", description: "Mutual central pressure and a fight for the e5 outpost.", probability: 5 },
  { id: "jobava-nbd7", family: "Development …Nbd7", label: "Development · …Nbd7", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 Nbd7", description: "Nb5 immediately makes e5 and c7 tactically sensitive.", probability: 4 },
  { id: "jobava-kid", family: "Indian Setup", label: "Deviation · Indian setup", moves: "1.d4 Nf6 2.Nc3 g6", description: "Without …d5, occupy the centre with e4 and attack the fianchetto.", probability: 3 },
];
