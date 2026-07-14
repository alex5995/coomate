import type { TrainerVariant } from "@/lib/types";

// Frequenze orientative, ordinate e normalizzate a 100.
export const jobavaVariants: TrainerVariant[] = [
  { id: "jobava-e6", family: "Main line …e6", label: "Main line · …e6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 e6", description: "La risposta più solida: scegli tra Nb5 e sviluppo posizionale.", probability: 24 },
  { id: "jobava-bf5", family: "Specchio …Bf5", label: "Specchio · …Bf5", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 Bf5", description: "Il Nero copia l’alfiere; puoi reagire con f3, g4 ed e4.", probability: 17 },
  { id: "jobava-c5", family: "Rottura …c5", label: "Rottura immediata · …c5", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 c5", description: "La risposta critica al centro, con e4 oppure un piano più solido.", probability: 16 },
  { id: "jobava-c6", family: "Struttura …c6", label: "Struttura Slav · …c6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 c6", description: "Il Nero sostiene d5; allena sviluppo tranquillo ed espansione f3–g4.", probability: 13 },
  { id: "jobava-g6", family: "Fianchetto …g6", label: "Fianchetto · …g6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 g6", description: "Qd2, Bh6 e h4 contro il principale difensore del Re.", probability: 11 },
  { id: "jobava-a6", family: "Profilassi …a6", label: "Profilassi · …a6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 a6", description: "Il Nero ferma Nb5 ma concede un tempo per l’espansione.", probability: 7 },
  { id: "jobava-nc6", family: "Sviluppo …Nc6", label: "Sviluppo · …Nc6", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 Nc6", description: "Pressione centrale reciproca e lotta per l’avamposto e5.", probability: 5 },
  { id: "jobava-nbd7", family: "Sviluppo …Nbd7", label: "Sviluppo · …Nbd7", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4 Nbd7", description: "Nb5 rende subito sensibili e5 e c7.", probability: 4 },
  { id: "jobava-kid", family: "Setup indiano", label: "Deviazione · setup indiano", moves: "1.d4 Nf6 2.Nc3 g6", description: "Se manca …d5, occupa il centro con e4 e attacca il fianchetto.", probability: 3 },
];
