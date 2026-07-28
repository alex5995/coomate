import type { OpeningId } from "@/lib/types";

export interface TrainingGoal {
  title: string;
  plans: string[];
}

const dragonCentralPlan: TrainingGoal = {
  title: "Turn the open centre into active piece play",
  plans: [
    "If White plays Nxc6, recapture with ...bxc6 and use the b-file and g7 bishop.",
    "Develop ...Be6 and place the queen on c7 or a5 to pressure c3 and e4.",
    "Bring a rook to b8 or d8 and trade only when it increases central pressure.",
  ],
};

const trainingGoals = {
  catalan: {
    "catalan-indian-nf3": {
      title: "Finish development, then prepare e4",
      plans: [
        "Place the bishop on g2 and castle before opening the centre.",
        "Use Qc2, Nbd2 and Rd1 to increase pressure on d5.",
        "Prepare e4; if Black takes on c4, recover the pawn through development.",
      ],
    },
    "catalan-indian-bg2": {
      title: "Build around the Catalan bishop",
      plans: [
        "Develop Nf3 and castle so the g2 bishop can work without tactical distractions.",
        "Coordinate Qc2 and Rd1 against d5 before committing the queenside knight.",
        "Prepare e4 and recover c4 calmly if Black releases the central tension.",
      ],
    },
    "catalan-open-modern-sharp": {
      title: "Activate the rooks against Black's queenside",
      plans: [
        "Place the rooks on c1 and d1 to target c7 and Black's loose queenside pieces.",
        "Reroute the b5 knight through a3 and c4 if Black drives it back.",
        "Use e3 and Ne5 to stabilise the centre before expanding.",
      ],
    },
    "catalan-closed": {
      title: "Prepare the central e4 break",
      plans: [
        "Castle, then develop Nbd2 and Qc2 behind the d4-c4 centre.",
        "Place a rook on d1 so e4 is supported by every piece.",
        "If e4 is not ready, improve the queenside pieces without releasing pressure on d5.",
      ],
    },
    "catalan-anti-nimzo": {
      title: "Exploit Black's blocked c-pawn",
      plans: [
        "Castle and develop Nc3 and Qc2 while the knight on c6 obstructs ...c5.",
        "Prepare e4 to challenge d5 once the king is safe.",
        "If Black takes on c4, regain the pawn without abandoning the g2 diagonal.",
      ],
    },
    "catalan-marshall": {
      title: "Drive back the centralised knight",
      plans: [
        "Use e4 or Nc4 to question the knight on d5 and gain space.",
        "Develop the c1 bishop with b3 and Bb2 when the diagonal is useful.",
        "Put the rooks on c1 and d1, then exploit Black's lag in development.",
      ],
    },
    "catalan-slav": {
      title: "Convert the lead in development",
      plans: [
        "Complete Nc3 and castling while the queen keeps pressure on b7.",
        "Meet ...e6 with Ne5 or Nh4 so the f4 bishop remains active.",
        "Clarify the centre with cxd5 only when it opens useful files for the rooks.",
      ],
    },
    "catalan-hungarian": {
      title: "Trade the extra pawn for development",
      plans: [
        "Castle instead of spending tempi trying to hold e5 at all costs.",
        "Develop Nc3 and Bf4, and use h3 to question the knight on g4.",
        "Open central lines while Black's king and queenside pieces remain undeveloped.",
      ],
    },
    "catalan-neo": {
      title: "Turn the move order into a full Catalan",
      plans: [
        "Castle and develop Nc3 or Nbd2 according to Black's pressure on d4.",
        "Use Qc2 and Rd1 to prepare the e4 break.",
        "If Black takes on c4, recover it without giving up the long diagonal.",
      ],
    },
    "catalan-tarrasch": {
      title: "Fix and attack the isolated d-pawn",
      plans: [
        "Clarify the c5 tension with dxc5 when it leaves d5 as a fixed target.",
        "Develop Bf4 or Bg5 and use b3 to add pressure without weakening the centre.",
        "Occupy the c- and d-files and welcome minor-piece exchanges that expose d5.",
      ],
    },
    "catalan-albin": {
      title: "Undermine the advanced d4 pawn",
      plans: [
        "Castle and use h3 if the bishop remains on g4.",
        "Develop Nbd2 and Nb3 to blockade and attack d4.",
        "Return the e5 pawn if that opens central files while Black's king is still exposed.",
      ],
    },
  },
  sicilian: {
    "sicilian-dragon-main": dragonCentralPlan,
    "sicilian-dragon-yugoslav": {
      title: "Race against White on the queenside",
      plans: [
        "Meet Bb3 or Be2 with ...Ne5 or ...Nxd4 when the central tactics work.",
        "Use ...b5-b4 to dislodge the c3 knight and open lines toward White's king.",
        "Keep the thematic ...Rxc3 exchange sacrifice available on the half-open c-file.",
      ],
    },
    "sicilian-dragon-classical": {
      title: "Build pressure without weakening the king",
      plans: [
        "Test the centre with ...Nxd4 or ...d5 before White can stabilise e4.",
        "Place a rook on c8 and prepare ...a6-b5 queenside expansion.",
        "Keep the g7 bishop active and avoid unnecessary kingside pawn moves.",
      ],
    },
    "sicilian-moscow": {
      title: "Target c4 and e4 from the queenside",
      plans: [
        "Reroute the d7 knight to e5 or c5 according to White's setup.",
        "Use ...Qa5 and ...Rfe8 to increase pressure on e4 and the centre.",
        "Prepare ...b5 only after the pieces are coordinated behind the c-file pressure.",
      ],
    },
    "sicilian-smith-morra": {
      title: "Convert the extra pawn through forcing play",
      plans: [
        "Use ...Rd8 to challenge White's rook and queen on the d-file.",
        "Keep Qh4 and the knights aimed at f2 and f3 while White's king is loose.",
        "Develop ...Be7 and secure the king once the immediate threats have forced concessions.",
      ],
    },
    "sicilian-bowdler": {
      title: "Finish development and squeeze the centre",
      plans: [
        "Develop the c8 bishop to f5, e6 or b7 according to White's setup.",
        "Use ...b6 and the c-file to increase pressure on c3 and d3.",
        "Prepare ...e5 or ...b5 only after the queenside pieces are connected.",
      ],
    },
    "sicilian-alapin-central": {
      title: "Attack the advanced e5 pawn",
      plans: [
        "If White exchanges on b6, recapture ...axb6 and use the open a-file.",
        "Develop ...Bg4 or ...Bf5, then place a rook on d8 or c8.",
        "Exchange on e5 when it removes White's space without releasing the d-file.",
      ],
    },
    "sicilian-alapin-bishop-exchange": {
      title: "Complete development around the exposed queen",
      plans: [
        "Play ...Bd7 and ...Be7 before castling.",
        "Use ...Rc8 to gain time against a queen on c4 or d4.",
        "Challenge the d5 pawn with ...f6 once the king is safe.",
      ],
    },
    "sicilian-closed-f4": {
      title: "Keep the queenside expansion moving",
      plans: [
        "Follow ...b5 with ...b4 or ...a5 to gain space against the c3 knight.",
        "Use ...Qc7 and ...Rd8 to support the queenside and central breaks.",
        "Occupy d4 when White plays c3, and avoid weakening the kingside without need.",
      ],
    },
    "sicilian-closed-nge2": {
      title: "Occupy d4 and expand on the queenside",
      plans: [
        "Reroute the e7 knight through c6 toward the d4 outpost.",
        "Prepare ...a6-b5 while White spends time reorganising the d1 knight.",
        "Use ...f5 only when e5 is secure and the kingside cannot be opened against your king.",
      ],
    },
    "sicilian-closed-dragon-transposition": dragonCentralPlan,
  },
  grunfeld: {
    "grunfeld-exchange-classical": {
      title: "Increase pressure before opening the centre",
      plans: [
        "Add ...Nc6 and ...Rfd8 so every piece attacks d4.",
        "If White plays h3, exchange ...Bxf3 when it weakens the e4-d4 chain.",
        "Use ...cxd4 only when the resulting open files favour the active pieces.",
      ],
    },
    "grunfeld-exchange-gm": {
      title: "Open d4 before White consolidates",
      plans: [
        "Calculate ...cxd4 immediately; after Nxd4, ...Qxa2 can punish the loose queenside.",
        "Castle as soon as the concrete central sequence is resolved.",
        "Keep the queen and rook active against c3 and the c-file.",
      ],
    },
    "grunfeld-exchange-exact": {
      title: "Finish the pressure against d4",
      plans: [
        "Develop ...Bb7 and ...Qc7 to add pressure from both diagonals.",
        "Meet d5 with ...e6 or ...Rd8 and blockade the passed pawn.",
        "Use ...cxd4 when White cannot answer with a central advance gaining tempo.",
      ],
    },
    "grunfeld-knight-takes": {
      title: "Calculate ...cxd4 before routine development",
      plans: [
        "Use ...cxd4 if Bc3 allows the tactical reply ...Qxa2.",
        "Keep the queen active against a2 and d4 while White untangles.",
        "If the tactic is unavailable, use ...e5 or ...b6 and connect the rooks.",
      ],
    },
    "grunfeld-no-exchange": {
      title: "Collect the material, then secure the king",
      plans: [
        "After White blocks the check with Qd2, take the a1 rook with ...Qxa1.",
        "Develop ...Nc6 and ...Be6 while keeping escape squares for the queen.",
        "Offer a queen trade and convert the material advantage without allowing a central attack.",
      ],
    },
    "grunfeld-bishop-pin": {
      title: "Damage the centre before castling",
      plans: [
        "After Bf4 or Bh4, consider ...Nxc3 to remove a defender of d4.",
        "Castle, then strike the centre with ...c5.",
        "Use ...Qa5 against c3 and d4 if White keeps the centre closed.",
      ],
    },
    "grunfeld-nf3-quiet": {
      title: "Strike with ...c5 before White builds e4",
      plans: [
        "Play ...c5 and meet d5 with ...d6 or ...e6.",
        "Develop ...Nc6 and use the open c- and d-files against White's centre.",
        "If White plays Nc3 before ...c5, keep the immediate ...d5 break available.",
      ],
    },
    "grunfeld-nf3-catalan": {
      title: "Build a solid ...d5 centre",
      plans: [
        "After Nc3 or Bg2, play ...d5 and castle.",
        "Develop ...Nbd7 and place the c8 bishop on f5 or g4.",
        "Use ...e5 or ...c5 only when development supports the central break.",
      ],
    },
  },
} satisfies Record<OpeningId, Record<string, TrainingGoal>>;

export const trainingGoalFor = (openingId: OpeningId, lineId: string): TrainingGoal => {
  const goal = (trainingGoals[openingId] as Record<string, TrainingGoal>)[lineId];
  if (!goal) throw new Error(`Missing training goal for ${openingId}/${lineId}`);
  return goal;
};
