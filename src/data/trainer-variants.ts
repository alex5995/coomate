import type { TrainerVariant } from "@/lib/types";

// Deliberately approximate frequencies: useful for study priorities, not official statistics.
export const trainerVariants: TrainerVariant[] = [
  { id: "classical-nc3", family: "Classical", opponentLineIds: ["classical-main", "classical-tartakower", "classical-tartakower-bf5"], label: "Classical · 3.Nc3", moves: "3.Nc3 dxe4 4.Nxe4", description: "Tartakower with …Nf6 or immediate development with …Bf5.", probability: 18 },
  { id: "exchange-bd3", family: "Exchange", opponentLineIds: ["exchange-main", "exchange-nf6", "exchange-bd3-early-bg4"], label: "Exchange · 4.Bd3", moves: "3.exd5 cxd5 4.Bd3", description: "The most direct Exchange line, putting pressure on h7.", probability: 14 },
  { id: "advance-defends-nf3", family: "Advance", opponentLineIds: ["advance-main", "advance-nf3-bf5-qb6", "advance-c5-nf3-nc6", "advance-c5-nf3-bg4"], label: "Advance · Nf3 defends", moves: "3.e5 and 4.Nf3", description: "The knight supports d4 against either …Bf5 or …c5.", probability: 13 },
  { id: "classical-nd2", family: "Classical", opponentLineIds: ["classical-nd2", "classical-nd2-bf5-h5", "classical-nd2-tartakower", "classical-nd2-tartakower-bf5"], label: "Classical · 3.Nd2", moves: "3.Nd2 dxe4 4.Nxe4", description: "A sound move order with several practical Black replies.", probability: 10 },
  { id: "panov", family: "Panov", label: "Panov Attack", moves: "3.exd5 cxd5 4.c4", description: "Dynamic play against the isolated queen's pawn.", probability: 9 },
  { id: "advance-tal", family: "Advance", opponentLineIds: ["advance-tal", "advance-tal-h6"], label: "Advance · h4 attack", moves: "3.e5 and 4.h4", description: "The Tal Variation immediately questions the bishop on f5.", probability: 8 },
  { id: "exchange-nf3", family: "Exchange", opponentLineIds: ["exchange-white-nf3-nc6", "exchange-nf3-bg4", "exchange-white-nf3-nf6"], label: "Exchange · 4.Nf3", moves: "3.exd5 cxd5 4.Nf3", description: "Flexible development before committing bishop and structure.", probability: 7 },
  { id: "fantasy", family: "Fantasy", label: "Fantasy Variation", moves: "3.f3", description: "White builds a large centre but slightly weakens the king.", probability: 6 },
  { id: "advance-nc3", family: "Advance", opponentLineIds: ["advance-shirov", "advance-nc3-g4", "advance-nc3-a6"], label: "Advance · Nc3 development", moves: "3.e5 and 4.Nc3", description: "Fast development and immediate pressure on the centre.", probability: 5 },
  { id: "two-knights", family: "Two Knights", label: "Two Knights Variation", moves: "2.Nc3 d5 3.Nf3", description: "Natural development; choose between …Bg4 and …Nf6.", probability: 4 },
  { id: "advance-defends-c3", family: "Advance", opponentLineIds: ["advance-c3-main", "advance-c3-early-capture", "advance-c5-c3-early", "advance-c5-c3-nc6-bg4"], label: "Advance · c3 defends", moves: "3.e5 and 4.c3", description: "White supports d4 against either …Bf5 or …c5.", probability: 3 },
  { id: "advance-takes", family: "Advance", opponentLineIds: ["advance-botvinnik", "advance-takes-bf5", "advance-takes-e6"], label: "Advance · takes on c5", moves: "3.e5 and 4.dxc5", description: "White immediately accepts the central challenge.", probability: 3 },
];

export const pickRandomVariant = (random = Math.random) => {
  const index = Math.min(trainerVariants.length - 1, Math.floor(random() * trainerVariants.length));
  return trainerVariants[index];
};
