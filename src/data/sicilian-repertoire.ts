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
  // https://lichess.org/study/AsIsKPrX/0tmQXtZL - Smith-Morra Gambit.
  line(
    "sicilian-smith-morra",
    "Smith-Morra",
    10,
    "e2e4 c7c5 d2d4 c5d4 c2c3 d4c3 b1c3 b8c6 g1f3 d7d6 f1c4 a7a6 e1g1 g8f6 d1e2 c8g4 f1d1 e7e6 c1f4 f6h5 f4e3 c6e5 c4b3 g4f3 g2f3 d8h4",
  ),
  // https://lichess.org/study/ulZswGf8/Iaw5fExU - Bowdler Attack.
  line(
    "sicilian-bowdler",
    "Bowdler",
    10,
    "e2e4 c7c5 f1c4 g8f6 d2d3 d7d5 e4d5 f6d5 g1f3 b8c6 e1g1 g7g6 f1e1 f8g7 c2c3 e8g8",
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
    "e2e4 c7c5 c2c3 g8f6 e4e5 f6d5 d2d4 c5d4 c3d4 d7d6 g1f3 b8c6 f1c4 d6e5 c4d5 d8d5 b1c3 d5d6 d4d5 c6d4 f3d4 e5d4 d1d4 e7e5",
  ),
  // https://lichess.org/study/jsSks17H - Closed Sicilian prefix.
  // https://lichess.org/study/72rdAVHd - Dragon-style Closed Sicilian plans.
  // The initial quiet setup is reordered so ...d6 remains Black's first choice.
  line(
    "sicilian-closed-f4",
    "Closed f4",
    10,
    "e2e4 c7c5 b1c3 d7d6 g2g3 g7g6 f1g2 f8g7 d2d3 b8c6 f2f4 e7e6 g1f3 g8e7 e1g1 e8g8 c1e3 a8b8 d1d2 b7b5",
  ),
  line(
    "sicilian-closed-nge2",
    "Closed Nge2",
    7,
    "e2e4 c7c5 b1c3 d7d6 g2g3 g7g6 f1g2 f8g7 d2d3 b8c6 g1e2 e7e6 c1e3 g8e7 d1d2 c6d4 c3d1 e6e5 c2c3 d4e2 d2e2 c8e6 e1g1 e8g8",
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
  a7a6: { hint: "Gain queenside space and prepare useful rook activity.", explanation: "...a6 prepares ...Rc8 in the Moscow and supports queenside expansion in the Smith-Morra." },
  d4c3: { hint: "Accept the gambit and make White prove the compensation.", explanation: "...dxc3 accepts the Smith-Morra pawn and forces White to justify the initiative." },
  c8g4: { hint: "Develop the light-squared bishop before closing the centre.", explanation: "...Bg4 pins the knight and prepares ...e6 without trapping the bishop." },
  f6h5: { hint: "Attack the bishop and preserve pressure on f4.", explanation: "...Nh5 gains time against White's active bishop and prepares simplification." },
  c6e5: { hint: "Centralise the knight and challenge White's attacking pieces.", explanation: "...Ne5 blocks White's central files and contests key attacking squares." },
  g4f3: { hint: "Remove a key attacker and damage White's kingside structure.", explanation: "...Bxf3 removes a defender and weakens White's kingside pawn structure." },
  d8h4: { hint: "Use the opened kingside before White consolidates.", explanation: "...Qh4 creates direct threats while White's king position is disrupted." },
  d7d5: { hint: "Challenge the bishop and the centre in one move.", explanation: "...d5 gains central space and makes the Bowdler bishop justify its placement." },
  f6d5: { hint: "Recapture centrally and keep developing with tempo.", explanation: "...Nxd5 restores the pawn while keeping the pieces active." },
  d6e5: { hint: "Clarify the advanced centre now that development supports it.", explanation: "...dxe5 removes White's space advantage before it can be reinforced." },
  d5b6: { hint: "Retreat with tempo and keep the centre under control.", explanation: "...Nb6 prepares to meet the queen exchange without losing coordination." },
  d8d5: { hint: "Recapture actively with the queen.", explanation: "...Qxd5 keeps pressure on White's centre after the bishop exchange." },
  d8d6: { hint: "Keep the queen central while supporting the e-pawn.", explanation: "...Qd6 supports the coming ...e5 break and keeps pressure on the centre." },
  c6d4: { hint: "Use the outpost created by White's pawn advance.", explanation: "...Nd4 forces simplification and exploits the weakened central squares." },
  e7e5: { hint: "Finish the central sequence with a tempo on the queen.", explanation: "...e5 challenges White's centre while gaining time against the queen." },
  e7e6: { hint: "Support the dark squares without blocking the fianchettoed bishop.", explanation: "...e6 prepares ...Nge7 in the Closed Sicilian setup." },
  g8e7: { hint: "Develop flexibly behind the f-pawn.", explanation: "...Nge7 keeps the f-file structure adaptable against White's kingside play." },
  a8b8: { hint: "Prepare queenside expansion.", explanation: "...Rb8 supports the thematic ...b5 break in the Closed Sicilian." },
  b7b5: { hint: "Claim queenside space before White's attack develops.", explanation: "...b5 gains space and starts Black's thematic queenside counterplay." },
};

export const sicilianGuidanceFor = (moves: UciMove[]) =>
  moves.map((move) => guidance[move]).find(Boolean) ?? {
    hint: "Develop rapidly and create central or queenside counterplay.",
    explanation: "This continuation develops actively and creates central or queenside counterplay.",
  };
