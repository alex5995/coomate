import type { OpeningId } from "@/lib/types";

export interface TrainingGoal {
  title: string;
  plans: string[];
}

const catalanGoals: Record<string, TrainingGoal> = {
  open: {
    title: "Pressure after ...dxc4",
    plans: ["Recover the c4 pawn through development rather than haste.", "Use the g2 bishop and queen on the long diagonal.", "Castle before opening queenside files."],
  },
  closed: {
    title: "Long-term Catalan pressure",
    plans: ["Keep the g2 bishop active against d5.", "Complete development before choosing a central break.", "Improve the pieces patiently while Black remains compact."],
  },
  active: {
    title: "Active Catalan development",
    plans: ["Develop with tempo to create immediate pressure.", "Complete the fianchetto and secure the king.", "Exploit development tempi instead of forcing tactics."],
  },
};

const sicilianGoals: Record<string, TrainingGoal> = {
  yugoslav: {
    title: "Meet the Yugoslav Attack",
    plans: ["Develop ...Bd7 and use the c-file.", "Create queenside counterplay before White's pawn storm arrives.", "Keep the g7 bishop active on the long diagonal."],
  },
  dragon: {
    title: "A complete Sicilian Dragon",
    plans: ["Fianchetto with ...g6 and ...Bg7 only after the normal ...d6 move order.", "Castle before central or queenside counterplay.", "Use ...d5 when White has not prevented the break with Bc4."],
  },
  alapin: {
    title: "Challenge the Alapin centre",
    plans: ["Use ...Nf6, ...d6 and ...Nc6 to pressure White's advanced pawns.", "Clarify e5 only after development supports the exchange.", "Activate the queen or complete the kingside fianchetto according to the position."],
  },
  closed: {
    title: "A Dragon-style Closed Sicilian",
    plans: ["Keep ...d6 first, then fianchetto with ...g6 and ...Bg7.", "Use ...e6 and ...Nge7 against White's f4 or Nge2 setup.", "Create queenside counterplay before White's kingside expansion arrives."],
  },
  moscow: {
    title: "Neutralise the Moscow check",
    plans: ["Meet Bb5+ with ...Bd7 and develop through the exchange.", "Use a Dragon-style fianchetto against White's c4 structure.", "Create queenside play with ...a6 and ...Rc8."],
  },
  morra: {
    title: "Contain the Smith-Morra initiative",
    plans: ["Accept the gambit and develop rapidly.", "Bring the c8 bishop out before ...e6.", "Use ...Ne5 and ...Bxf3 to reduce White's attacking force."],
  },
  bowdler: {
    title: "Challenge the Bowdler bishop",
    plans: ["Develop with ...Nf6 and strike immediately with ...d5.", "Recapture centrally with the knight.", "Finish with a kingside fianchetto and castling."],
  },
};

const grunfeldGoals: Record<string, TrainingGoal> = {
  exchange: {
    title: "Attack White's broad centre",
    plans: ["Exchange the c3 knight when it weakens White's central control.", "Use ...c5, ...Qa5, ...Bg4 and ...Nc6 against d4.", "Castle before opening more central lines."],
  },
  quiet: {
    title: "A flexible Grünfeld setup",
    plans: ["Complete the kingside fianchetto.", "Choose ...c5 or ...d5 according to White's setup.", "Keep active pressure instead of occupying the centre with pawns."],
  },
};

export const trainingGoalFor = (openingId: OpeningId, lineId: string): TrainingGoal => {
  if (openingId === "catalan") {
    if (lineId.includes("open")) return catalanGoals.open;
    if (lineId.includes("closed")) return catalanGoals.closed;
    return catalanGoals.active;
  }

  if (openingId === "sicilian") {
    if (lineId.includes("yugoslav")) return sicilianGoals.yugoslav;
    if (lineId.includes("dragon")) return sicilianGoals.dragon;
    if (lineId.includes("alapin")) return sicilianGoals.alapin;
    if (lineId.includes("moscow")) return sicilianGoals.moscow;
    if (lineId.includes("morra")) return sicilianGoals.morra;
    if (lineId.includes("bowdler")) return sicilianGoals.bowdler;
    return sicilianGoals.closed;
  }

  if (lineId.includes("exchange") || lineId.includes("knight") || lineId.includes("no-exchange")) {
    return grunfeldGoals.exchange;
  }
  return grunfeldGoals.quiet;
};
