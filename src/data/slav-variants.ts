import type { TrainerVariant } from "@/lib/types";

// Frequenze volutamente orientative, ordinate e normalizzate a 100.
export const slavVariants: TrainerVariant[] = [
  { id: "slav-queens-gambit", family: "Slav · Gambetto di Donna", label: "1.d4 · Gambetto di Donna", moves: "1.d4 d5 2.c4 c6", description: "Slav principale, linea tranquilla, cambio e Chebanenko con l’alfiere fuori.", probability: 30 },
  { id: "slav-london", family: "London", label: "1.d4 · London System", moves: "1.d4 d5 2.Nf3 Nf6 3.Bf4", description: "…Bf5, cambio in d3, pressione con …Qb6 e rottura rapida …c5.", probability: 16 },
  { id: "slav-english", family: "English · setup Slav", label: "1.c4 · Inglese", moves: "1.c4 c6", description: "Trasposizione Slav oppure setup …c6–…d5 contro g3, b3 ed e3.", probability: 14 },
  { id: "slav-reti-c4", family: "Réti · c4", label: "1.Nf3 · Réti con c4", moves: "1.Nf3 d5 2.c4 c6", description: "Gestisci d4, e3 e g3 senza uscire dal tuo sistema Slav.", probability: 10 },
  { id: "slav-jobava", family: "Jobava contro il Nero", label: "1.d4 · Jobava London", moves: "1.d4 d5 2.Nc3 Nf6 3.Bf4", description: "…c6, …Bf5 e …a6 contro Nb5 e le spinte aggressive f3–g4.", probability: 9 },
  { id: "slav-colle", family: "Colle e Zukertort", label: "1.d4 · Colle e Zukertort", moves: "1.d4 d5 2.Nf3 Nf6 3.e3", description: "Fai uscire l’alfiere prima che il Bianco costruisca e4 senza opposizione.", probability: 7 },
  { id: "slav-reti-fianchetto", family: "Réti · fianchetto", label: "1.Nf3 · Réti e fianchetto", moves: "1.Nf3 d5 2.g3 / 2.b3", description: "Centro …d5–…c6 e alfiere in f5 contro KIA e Zukertort.", probability: 5 },
  { id: "slav-english-e4", family: "English · e4 precoce", label: "1.c4 · Inglese con e4", moves: "1.c4 c6 2.e4 d5", description: "Rientra in strutture Panov o Advance usando idee già note dalla Caro-Kann.", probability: 4 },
  { id: "slav-veresov", family: "Veresov e gambetti", label: "1.d4 · Veresov e gambetti", moves: "1.d4 d5 2.Nc3 / 2.e4", description: "Risposte concrete a Bg5 e al Blackmar-Diemer, sempre con sviluppo rapido.", probability: 3 },
  { id: "slav-flank", family: "Aperture di fianco", label: "1.b3 / 1.g3 · Aperture di fianco", moves: "1.b3 d5 oppure 1.g3 d5", description: "Occupa il centro e ricostruisci il setup Slav contro mosse rare.", probability: 2 },
];
