import type { RepertoireLine, UciMove } from "@/lib/types";
import { sicilianEvaluations } from "./sicilian-evaluations";
import { trainingGoalFor } from "./training-goals";

const line = (
  id: string,
  family: string,
  weight: number,
  moves: string,
): RepertoireLine => ({
  id,
  name: id,
  family,
  weight,
  moves: moves.split(" ") as UciMove[],
  evaluations: sicilianEvaluations[id],
  goal: trainingGoalFor("sicilian", id),
});

export const sicilianRepertoire: RepertoireLine[] = [
  // https://lichess.org/study/AvqP0tL1 - Main Line.
  line(
    "sicilian-dragon-main",
    "Dragon main line",
    24,
    "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6 c1e3 f8g7 f2f3 b8c6 d1d2 e8g8 e1c1 d6d5 e4d5 f6d5",
  ),
  // https://lichess.org/study/AvqP0tL1 - Yugoslav Attack.
  line(
    "sicilian-dragon-yugoslav",
    "Dragon Yugoslav",
    30,
    "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6 c1e3 f8g7 f2f3 b8c6 d1d2 e8g8 f1c4 c8d7 e1c1 a8c8",
  ),
  // https://lichess.org/study/AvqP0tL1 - Classical Variation.
  line(
    "sicilian-dragon-classical",
    "Dragon Classical",
    26,
    "e2e4 c7c5 g1f3 d7d6 d2d4 c5d4 f3d4 g8f6 b1c3 g7g6 f1e2 f8g7 e1g1 e8g8 c1e3 b8c6 f2f4 c8d7",
  ),
  // https://lichess.org/study/AsIsKPrX/8DZotSqG - Moscow Variation.
  line(
    "sicilian-moscow",
    "Moscow",
    12,
    "e2e4 c7c5 g1f3 d7d6 f1b5 c8d7 b5d7 b8d7 c2c4 g8f6 b1c3 g7g6 d2d4 c5d4 f3d4 f8g7 e1g1 e8g8 c1e3 a7a6 a1c1 a8c8",
  ),
  // Smith-Morra declined with ...Nf6, transposing into the curated Alapin central line.
  line(
    "sicilian-smith-morra",
    "Smith-Morra",
    10,
    "e2e4 c7c5 d2d4 c5d4 c2c3 g8f6 e4e5 f6d5 g1f3 b8c6 c3d4 d7d6 f1c4 d6e5 d4e5 d5b6 d1d8 c6d8 c4b5 d8c6 b1c3 g7g6 e1g1 f8g7 c1e3 e8g8",
  ),
  // https://lichess.org/study/ulZswGf8 - Bowdler ...d6, ...Nf6 and Dragon setup.
  line(
    "sicilian-bowdler",
    "Bowdler",
    10,
    "e2e4 c7c5 f1c4 d7d6 g1f3 g8f6 d2d3 b8c6 e1g1 g7g6 c2c3 f8g7 f1e1 e8g8",
  ),
  // https://lichess.org/study/jsSks17H - Alapin prefix.
  // https://lichess.org/study/cA3kOR92 - documented continuations after 5...d6.
  line(
    "sicilian-alapin-central",
    "Alapin central",
    10,
    "e2e4 c7c5 c2c3 g8f6 e4e5 f6d5 d2d4 c5d4 c3d4 d7d6 g1f3 b8c6 f1c4 d6e5 d4e5 d5b6 d1d8 c6d8 c4b5 d8c6 b1c3 g7g6 e1g1 f8g7 c1e3 e8g8",
  ),
  line(
    "sicilian-alapin-bishop-exchange",
    "Alapin bishop exchange",
    6,
    "e2e4 c7c5 c2c3 g8f6 e4e5 f6d5 d2d4 c5d4 c3d4 d7d6 g1f3 b8c6 f1c4 d6e5 c4d5 d8d5 b1c3 d5d6 d4d5 c6d4 f3d4 e5d4 d1d4 e7e5 d4e3 f8e7 e1g1 e8g8 c3b5 d6f6 b5c7 a8b8 e3a7 c8h3 g2h3 f6d6 a7a5 e7d8 a5a3 d6a3 b2a3 d8c7",
  ),
  // https://lichess.org/study/jsSks17H - Closed Sicilian prefix.
  // https://lichess.org/study/72rdAVHd - normal Dragon development and queenside counterplay.
  line(
    "sicilian-closed-f4",
    "Closed f4",
    10,
    "e2e4 c7c5 b1c3 d7d6 g2g3 g8f6 f1g2 g7g6 d2d3 f8g7 f2f4 e8g8 h2h3 b8c6 a2a4 a7a6 g1e2 c8d7 e1g1 a8b8 g3g4 b7b5 a4b5 a6b5",
  ),
  line(
    "sicilian-closed-nge2",
    "Closed Nge2",
    7,
    "e2e4 c7c5 b1c3 d7d6 g2g3 g8f6 f1g2 g7g6 g1e2 f8g7 c3d5 b8c6 e1g1 e8g8 c2c3 c8d7 d2d3 b7b5 d3d4 b5b4 d4c5 d6c5",
  ),
  // https://lichess.org/study/jsSks17H - 2.Nc3 d6.
  // https://lichess.org/study/AvqP0tL1 - exact normal Dragon after transposition.
  line(
    "sicilian-closed-dragon-transposition",
    "Closed Dragon transposition",
    8,
    "e2e4 c7c5 b1c3 d7d6 g1f3 g8f6 d2d4 c5d4 f3d4 g7g6 c1e3 f8g7 f2f3 b8c6 d1d2 e8g8 e1c1 d6d5 e4d5 f6d5",
  ),
];

const guidance: Record<string, { hint: string; explanation: string }> = {
  c7c5: { hint: "Challenge the centre asymmetrically from the first move.", explanation: "...c5 fights for d4 and creates an imbalanced position immediately." },
  d7d6: { hint: "Control e5 and prepare the Dragon development.", explanation: "...d6 supports ...Nf6 and keeps the g7 fianchetto available." },
  c5d4: { hint: "Open the c-file and remove White's central d-pawn.", explanation: "...cxd4 enters the Open Sicilian structure." },
  g8f6: { hint: "Develop with pressure on e4.", explanation: "...Nf6 develops with tempo against e4 in both the Dragon and Alapin." },
  g7g6: { hint: "Commit to the Dragon fianchetto now that White allows it.", explanation: "...g6 creates the Dragon structure without using an accelerated move order." },
  f8g7: { hint: "Place the bishop on the Dragon's long diagonal.", explanation: "...Bg7 completes the fianchetto and targets the centre and queenside." },
  b8c6: { hint: "Develop toward the centre and increase pressure on d4.", explanation: "...Nc6 reinforces pressure on d4 and supports central counterplay." },
  e8g8: { hint: "Secure the king before launching counterplay.", explanation: "Castling is essential before opening the centre or the c-file." },
  d6d5: { hint: "Strike in the centre while Bc4 does not prevent the break.", explanation: "...d5 challenges White's centre and frees Black's position in one move." },
  c8d7: { hint: "Develop and prepare a rook for the c-file.", explanation: "...Bd7 connects the queenside pieces in the Yugoslav and Classical setups." },
  b8d7: { hint: "Recapture with development and keep the queen flexible.", explanation: "...Nxd7 replaces the exchanged bishop and keeps Black's queen uncommitted." },
  a8c8: { hint: "Put the rook on the half-open file against White's king.", explanation: "...Rc8 creates immediate queenside counterplay in the Yugoslav Attack." },
  a7a6: { hint: "Gain queenside space and prepare useful rook activity.", explanation: "...a6 supports ...b5 and prepares queenside expansion without weakening the centre." },
  f6d5: { hint: "Use the d5 square to challenge White's centre.", explanation: "...Nd5 centralises the knight, either meeting e5 or recapturing on d5 while keeping active pressure." },
  d6e5: { hint: "Clarify the advanced centre now that development supports it.", explanation: "...dxe5 removes White's space advantage before it can be reinforced." },
  d5b6: { hint: "Retreat with tempo and keep the centre under control.", explanation: "...Nb6 prepares to meet the queen exchange without losing coordination." },
  d8d5: { hint: "Recapture actively with the queen.", explanation: "...Qxd5 keeps pressure on White's centre after the bishop exchange." },
  d8d6: { hint: "Keep the queen central while supporting the e-pawn.", explanation: "...Qd6 supports the coming ...e5 break and keeps pressure on the centre." },
  c6d4: { hint: "Use the outpost created by White's pawn advance.", explanation: "...Nd4 forces simplification and exploits the weakened central squares." },
  e7e5: { hint: "Finish the central sequence with a tempo on the queen.", explanation: "...e5 challenges White's centre while gaining time against the queen." },
  f8e7: { hint: "Develop directly and prepare to castle instead of forcing a fianchetto.", explanation: "...Be7 gets the king ready to castle; the open centre makes this more urgent than spending a tempo on ...g6." },
  d6f6: { hint: "Keep the queen active and allow the c8 bishop to join the attack.", explanation: "...Qf6 meets the knight jump with tactical pressure and prepares the bishop sacrifice on h3 if White grabs a7." },
  a8b8: { hint: "Activate the rook on the b-file for queenside counterplay.", explanation: "...Rb8 either supports the thematic ...b5 break or creates tactical pressure while White's queen moves onto the a-file." },
  c8h3: { hint: "Remove the g-pawn and expose White's king before recovering the knight.", explanation: "...Bh3 gives up the bishop to drag g2 to h3, opening dark squares for the queen and gaining time to take the knight on c7." },
  f6d6: { hint: "Return the queen to the diagonal that reaches c7.", explanation: "...Qd6 attacks c7 and forces White to spend time moving the queen while Black prepares to recover the trapped knight." },
  e7d8: { hint: "Add a second attack to the knight on c7.", explanation: "...Bd8 challenges the queen-knight alignment on the a5-c7 diagonal and prepares to recover the knight with the bishop after a queen exchange." },
  d6a3: { hint: "Exchange queens before recovering the knight.", explanation: "...Qxa3 removes White's active queen and forces bxa3, leaving two pairs of doubled isolated pawns for the queenless ending." },
  d8c7: { hint: "Recover the knight with the bishop now that the queens are gone.", explanation: "...Bxc7 restores the minor-piece balance and reaches a quiet ending where Black can target White's damaged pawn structure." },
  b7b5: { hint: "Claim queenside space before White's attack develops.", explanation: "...b5 gains space and starts Black's thematic queenside counterplay." },
  b5b4: { hint: "Gain another tempo on White's queenside.", explanation: "...b4 fixes the c3 structure and makes it harder for White to support the centre." },
  a6b5: { hint: "Recapture toward the centre and preserve the advanced pawn.", explanation: "...axb5 keeps a pawn on b5 and opens the a-file for Black's rook." },
  d6c5: { hint: "Restore the central balance after White captures on c5.", explanation: "...dxc5 recaptures immediately and leaves Black ready to challenge the d5 knight." },
};

export const sicilianGuidanceFor = (moves: UciMove[]) =>
  moves.map((move) => guidance[move]).find(Boolean) ?? {
    hint: "Develop rapidly and create central or queenside counterplay.",
    explanation: "This continuation develops actively and creates central or queenside counterplay.",
  };
