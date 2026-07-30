import type { TrainerVariant } from "@/lib/types";

// The accelerated and hyperaccelerated Dragon chapters are intentionally omitted:
// they are Black repertoire choices, not White opponent variations.
export const sicilianVariants: TrainerVariant[] = [
  { id: "sicilian-dragon-yugoslav", family: "Dragon Yugoslav", label: "Dragon · Yugoslav Attack", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be3 Bg7 7.f3 O-O 8.Qd2 Nc6 9.Bc4", description: "Meet White's most aggressive setup with ...Bd7 and ...Rc8.", probability: 20 },
  { id: "sicilian-dragon-classical", family: "Dragon Classical", label: "Dragon · Classical Be2", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be2", description: "Complete the Dragon setup against kingside castling.", probability: 17 },
  { id: "sicilian-dragon-main", family: "Dragon main line", label: "Dragon · main line without Bc4", moves: "1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 g6 6.Be3", description: "Use the central ...d5 break when White does not prevent it with Bc4.", probability: 14 },
  { id: "sicilian-moscow", family: "Moscow", label: "Moscow · Bb5+", moves: "1.e4 c5 2.Nf3 d6 3.Bb5+ Bd7 4.Bxd7+ Nxd7", description: "Neutralise the check, then build a Dragon-style fianchetto and queenside pressure.", probability: 10 },
  { id: "sicilian-bowdler", family: "Bowdler", label: "Bowdler Attack · Bc4", moves: "1.e4 c5 2.Bc4 d6 3.Nf3 Nf6", description: "Make White defend e4 with d3, then complete a normal Dragon setup.", probability: 9 },
  { id: "sicilian-smith-morra", family: "Smith-Morra", label: "Smith-Morra Gambit · Alapin transposition", moves: "1.e4 c5 2.d4 cxd4 3.c3 Nf6 4.e5 Nd5 5.Nf3 Nc6 6.cxd4", description: "Decline the gambit with ...Nf6 and transpose into the same Alapin structure.", probability: 8 },
  { id: "sicilian-alapin-central", family: "Alapin central", label: "Alapin · central recapture", moves: "1.e4 c5 2.c3 Nf6 3.e5 Nd5 4.d4 cxd4 5.cxd4 d6 6.Nf3", description: "Develop through ...Nc6, clarify e5 and complete the fianchetto after the queen exchange.", probability: 7 },
  { id: "sicilian-closed-f4", family: "Closed f4", label: "Closed Sicilian · f4 setup", moves: "1.e4 c5 2.Nc3 d6 3.g3 Nf6 4.Bg2 g6 5.d3 Bg7 6.f4 O-O", description: "Use the normal Dragon development, then launch ...Rb8 and ...b5 queenside counterplay.", probability: 6 },
  { id: "sicilian-closed-dragon-transposition", family: "Closed Dragon transposition", label: "2.Nc3 · Dragon transposition", moves: "1.e4 c5 2.Nc3 d6 3.Nf3 Nf6 4.d4", description: "When White opens the centre after 2.Nc3, transpose to the normal ...d6 Dragon.", probability: 4 },
  { id: "sicilian-closed-nge2", family: "Closed Nge2", label: "Closed Sicilian · Nge2 and Nd5", moves: "1.e4 c5 2.Nc3 d6 3.g3 Nf6 4.Bg2 g6 5.Nge2 Bg7 6.Nd5 O-O 7.O-O Nc6", description: "Keep the normal Dragon setup against Nd5, then castle and expand on the queenside.", probability: 3 },
  { id: "sicilian-alapin-bishop-exchange", family: "Alapin bishop exchange", label: "Alapin · Bxd5 exchange", moves: "1.e4 c5 2.c3 Nf6 3.e5 Nd5 4.d4 cxd4 5.cxd4 d6 6.Nf3 Nc6 7.Bc4 dxe5 8.Bxd5", description: "Use the tactical ...Bh3 sacrifice, then choose whether to keep the queens or enter the pawn-targeting endgame.", probability: 2 },
];
