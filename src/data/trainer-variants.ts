import type { RepertoireLine } from "@/lib/types";

export interface TrainerVariant {
  id: string;
  family: RepertoireLine["family"];
  lineIds?: string[];
  label: string;
  moves: string;
  description: string;
  probability: number;
}

// Frequenze volutamente orientative: servono a dare priorità allo studio
// e sommano a 100, ma non rappresentano statistiche ufficiali.
export const trainerVariants: TrainerVariant[] = [
  { id: "classical-nc3", family: "Classical", lineIds: ["classical-main", "classical-tartakower"], label: "Classical · 3.Nc3", moves: "3.Nc3 dxe4 4.Nxe4", description: "Tartakower con …Nf6 oppure sviluppo immediato …Bf5.", probability: 18 },
  { id: "exchange-bd3", family: "Exchange", lineIds: ["exchange-main", "exchange-nf6"], label: "Exchange · 4.Bd3", moves: "3.exd5 cxd5 4.Bd3", description: "La linea di cambio più diretta, con pressione su h7.", probability: 14 },
  { id: "advance-defends-nf3", family: "Advance", lineIds: ["advance-main", "advance-c5-nf3-capture", "advance-c5-nf3-nc6", "advance-c5-nf3-bg4"], label: "Advance · difende con Nf3", moves: "3.e5 e 4.Nf3", description: "Il cavallo sostiene d4 contro …Bf5 oppure …c5.", probability: 13 },
  { id: "classical-nd2", family: "Classical", lineIds: ["classical-nd2", "classical-nd2-tartakower"], label: "Classical · 3.Nd2", moves: "3.Nd2 dxe4 4.Nxe4", description: "Un ordine di mosse solido con più risposte nere.", probability: 10 },
  { id: "panov", family: "Panov", label: "Attacco Panov", moves: "3.exd5 cxd5 4.c4", description: "Gioco dinamico contro il pedone isolato di Donna.", probability: 9 },
  { id: "advance-tal", family: "Advance", lineIds: ["advance-tal"], label: "Advance · attacco h4", moves: "3.e5 e 4.h4", description: "La variante Tal mette subito in discussione l’alfiere f5.", probability: 8 },
  { id: "exchange-nf3", family: "Exchange", lineIds: ["exchange-white-nf3-nc6", "exchange-white-nf3-nf6"], label: "Exchange · 4.Nf3", moves: "3.exd5 cxd5 4.Nf3", description: "Sviluppo flessibile prima di definire alfiere e struttura.", probability: 7 },
  { id: "fantasy", family: "Fantasy", label: "Variante Fantasy", moves: "3.f3", description: "Il Bianco costruisce un grande centro, ma indebolisce il Re.", probability: 6 },
  { id: "advance-nc3", family: "Advance", lineIds: ["advance-shirov"], label: "Advance · sviluppo con Nc3", moves: "3.e5 e 4.Nc3", description: "Sviluppo rapido e pressione immediata sul centro.", probability: 5 },
  { id: "two-knights", family: "Two Knights", label: "Variante dei Due Cavalli", moves: "2.Nc3 d5 3.Nf3", description: "Sviluppo naturale; scegli fra …Bg4 e …Nf6.", probability: 4 },
  { id: "advance-defends-c3", family: "Advance", lineIds: ["advance-c3-main", "advance-c3-early-capture", "advance-c5-c3-main", "advance-c5-c3-early"], label: "Advance · difende con c3", moves: "3.e5 e 4.c3", description: "Il Bianco sostiene d4 contro …Bf5 oppure …c5.", probability: 3 },
  { id: "advance-takes", family: "Advance", lineIds: ["advance-botvinnik"], label: "Advance · prende in c5", moves: "3.e5 e 4.dxc5", description: "Il Bianco accetta la sfida immediata al centro.", probability: 3 },
];

export const pickRandomVariant = (random = Math.random) => {
  const index = Math.min(trainerVariants.length - 1, Math.floor(random() * trainerVariants.length));
  return trainerVariants[index];
};
