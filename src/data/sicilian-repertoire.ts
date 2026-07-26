import type { RepertoireLine, UciMove } from "@/lib/types";
import { sicilianEvaluations } from "./sicilian-evaluations";

const familyGoals: Record<string, RepertoireLine["goal"]> = {
  "Dragon main line": {
    title: "Central counterplay in the Dragon",
    plans: [
      "Complete ...Bg7, ...Nc6 and castling before striking the centre.",
      "Use ...d5 when White has not prevented the break with Bc4.",
      "Create counterplay against the queenside-castled king.",
    ],
  },
  "Dragon Yugoslav": {
    title: "Meet the Yugoslav Attack",
    plans: [
      "Develop ...Bd7 and place a rook on the c-file as the study shows.",
      "Generate queenside counterplay before White's kingside pawns arrive.",
      "Keep the g7 bishop active on the long diagonal.",
    ],
  },
  "Dragon Classical": {
    title: "A sound Dragon against Be2",
    plans: [
      "Fianchetto, castle and complete ...Nc6 without delay.",
      "Develop the c8 bishop to d7.",
      "Use the centre and queenside for active counterplay against White's kingside castle.",
    ],
  },
  Alapin: {
    title: "Challenge the Alapin centre",
    plans: [
      "Attack e4 with ...Nf6 exactly as the source study recommends.",
      "Exchange on d4 to prevent White from maintaining a broad pawn centre.",
      "Use ...d6 to control e5 and prepare normal development.",
    ],
  },
  Closed: {
    title: "A controlled Closed Sicilian",
    plans: [
      "Use the study's ...d6 setup when White chooses Nc3 without d4.",
      "Keep the Dragon fianchetto available if White later enters an open structure.",
      "Develop before choosing a queenside or central pawn break.",
    ],
  },
};

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
  goal: familyGoals[family],
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
  // https://lichess.org/study/jsSks17H - Alapin Variation.
  line(
    "sicilian-alapin",
    "Alapin",
    14,
    "e2e4 c7c5 c2c3 g8f6 e4e5 f6d5 d2d4 c5d4 c3d4 d7d6",
  ),
  // https://lichess.org/study/jsSks17H - Closed Sicilian.
  line("sicilian-closed", "Closed", 10, "e2e4 c7c5 b1c3 d7d6"),
];

const guidance: Record<string, { hint: string; explanation: string }> = {
  c7c5: { hint: "Challenge the centre asymmetrically from the first move.", explanation: "...c5 begins every Sicilian line in the selected studies." },
  d7d6: { hint: "Control e5 and prepare the Dragon development.", explanation: "...d6 supports ...Nf6 and keeps the g7 fianchetto available." },
  c5d4: { hint: "Open the c-file and remove White's central d-pawn.", explanation: "...cxd4 enters the Open Sicilian structure." },
  g8f6: { hint: "Develop with pressure on e4.", explanation: "...Nf6 is the study's natural development in both the Dragon and Alapin." },
  g7g6: { hint: "Commit to the Dragon fianchetto now that White allows it.", explanation: "...g6 creates the Dragon structure without using an accelerated move order." },
  f8g7: { hint: "Place the bishop on the Dragon's long diagonal.", explanation: "...Bg7 completes the fianchetto and targets the centre and queenside." },
  b8c6: { hint: "Develop toward the centre and increase pressure on d4.", explanation: "...Nc6 is the study's standard Dragon development." },
  e8g8: { hint: "Secure the king before launching counterplay.", explanation: "Castling is essential before opening the centre or the c-file." },
  d6d5: { hint: "Strike in the centre while Bc4 does not prevent the break.", explanation: "...d5 is the study's main-line equalising idea." },
  c8d7: { hint: "Develop and prepare a rook for the c-file.", explanation: "...Bd7 connects the queenside pieces in the Yugoslav and Classical setups." },
  a8c8: { hint: "Put the rook on the half-open file against White's king.", explanation: "...Rc8 creates the study's queenside counterplay in the Yugoslav Attack." },
};

export const sicilianGuidanceFor = (moves: UciMove[]) =>
  moves.map((move) => guidance[move]).find(Boolean) ?? {
    hint: "Develop rapidly and create central or queenside counterplay.",
    explanation: "This continuation follows the selected Sicilian study chapter.",
  };
