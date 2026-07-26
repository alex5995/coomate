import type { OpeningId } from "@/lib/types";

export interface TrainingGoal {
  title: string;
  plans: string[];
}

const caroGoals: Record<string, TrainingGoal> = {
  advance: {
    title: "Pressure the closed centre",
    plans: ["Challenge the base of White's pawn chain with …c5.", "Keep the light-squared bishop active before playing …e6.", "Develop toward d4 and e5, then castle when the centre is stable."],
  },
  classical: {
    title: "A sound Classical middlegame",
    plans: ["Complete development without trapping the c8 bishop.", "Use …Nf6 to challenge the e4 knight and consider the Tartakower structure.", "Prepare …c5 once your king and central pieces are coordinated."],
  },
  exchange: {
    title: "Active play in the Exchange structure",
    plans: ["Develop the c8 bishop before consolidating with …e6.", "Use the c- and e-files and look for queenside minority play.", "Meet pressure on b7 with activity and tempi against White's queen."],
  },
  panov: {
    title: "Control the isolated queen's pawn",
    plans: ["Increase pressure on d4 and blockade the isolani when possible.", "Develop …Bg4 before …e6 so every piece has an active square.", "Welcome simplifications that reduce White's attacking potential."],
  },
  fantasy: {
    title: "Counter the oversized centre",
    plans: ["Strike before White consolidates with …dxe4 or …e5.", "Develop with tempo against the advanced central pawns.", "Do not chase material at the expense of king safety."],
  },
  two: {
    title: "Development with tempo",
    plans: ["Bring the light-squared bishop out with …Bg4.", "Challenge White's central knights instead of playing passively.", "Finish development and castle before opening the centre."],
  },
};

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
    plans: ["Use the study's exact move order to create pressure.", "Complete the fianchetto and secure the king.", "Exploit development tempi instead of forcing tactics."],
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
  anti: {
    title: "A studied anti-Sicilian response",
    plans: ["Follow the secondary study when White prevents the Dragon.", "Challenge White's centre before it becomes stable.", "Keep development ahead of pawn hunting."],
  },
};

const grunfeldGoals: Record<string, TrainingGoal> = {
  exchange: {
    title: "Attack White's broad centre",
    plans: ["Exchange the c3 knight when the study calls for it.", "Use ...c5, ...Qa5, ...Bg4 and ...Nc6 against d4.", "Castle before opening more central lines."],
  },
  quiet: {
    title: "A flexible Grünfeld setup",
    plans: ["Complete the kingside fianchetto.", "Choose ...c5 or ...d5 according to White's setup.", "Keep active pressure instead of occupying the centre with pawns."],
  },
};

const londonGoals: Record<string, TrainingGoal> = {
  classical: {
    title: "The complete London setup",
    plans: ["Finish with c3, Nbd2, Bd3 and kingside castling.", "Use Ne5 as a stable outpost when Black cannot dislodge it profitably.", "After …Bxf4, exf4 is healthy: the doubled pawn controls e5 and gives White a semi-open e-file for central pressure."],
  },
  g6: {
    title: "A sound London against the fianchetto",
    plans: ["Complete development with Be2, Nbd2 and kingside castling.", "Use h3 to preserve the London bishop when …Nh5 is possible.", "Choose between Ne5 and a well-prepared c4 break."],
  },
  c5: {
    title: "Meet early queenside pressure",
    plans: ["Protect b2 against …Qb6 without abandoning the London structure.", "Support d4 with c3 or choose c4 when the position calls for active play.", "Complete development before opening the centre."],
  },
  mirror: {
    title: "A purposeful mirrored structure",
    plans: ["Challenge Black's active bishop with Bd3 and welcome a useful exchange.", "Keep c3, Nbd2 and kingside castling as the stable base.", "Use Ne5 and a later e4 break to avoid passive symmetry."],
  },
  c6: {
    title: "A flexible London against the Slav",
    plans: ["Secure d4 with c3 before committing the centre.", "Use a bishop exchange to improve queen coordination when it is offered.", "Build toward Ne5 or e4 after completing development."],
  },
  b6: {
    title: "Meet the queenside fianchetto",
    plans: ["Keep d4 firm while Black develops on the long diagonal.", "Coordinate Nbd2 and Ne5 to increase central and kingside pressure.", "Castle before deciding between c4 and e4."],
  },
  nc6: {
    title: "Exploit the committed c6 knight",
    plans: ["Reinforce d4 because Black cannot support it with the c-pawn.", "Complete development and resolve the central break without tactics on your king.", "Use c3 and Nbd2 to keep the London structure coordinated."],
  },
  bg4: {
    title: "Neutralise the bishop pin",
    plans: ["Break the pin through Be2 or Bd3 and safe castling.", "Use h3 only when it improves the bishop or knight decision.", "Occupy e5 once the f3 knight can move with purpose."],
  },
  nh5: {
    title: "Preserve the London bishop",
    plans: ["Choose Bg5, Bg3 or a sound exchange according to Black's pawn moves.", "Use an h-pawn recapture to open the rook file when Black exchanges on g3.", "Return to c3, Nbd2 and kingside castling before opening the centre."],
  },
  default: {
    title: "A flexible London middlegame",
    plans: ["Keep the d4, Nf3, Bf4 and e3 core coordinated.", "Develop with c3, Nbd2, Bd3 or Be2, then castle kingside.", "Use Ne5, c4 or e4 according to Black's setup rather than forcing an attack."],
  },
};

const slavGoals: Record<string, TrainingGoal> = {
  london: {
    title: "The London setup neutralised",
    plans: ["Develop the c8 bishop before …e6.", "Challenge d4 with …c5 and use …Qb6 when b2 is exposed.", "Exchange White's active dark-squared bishop when it improves coordination."],
  },
  jobava: {
    title: "Contain the Jobava attack",
    plans: ["Keep the c8 bishop outside the pawn chain.", "Meet f3–g4 by preserving the bishop and striking the centre.", "Use …a6 when preventing Nb5 is worth the tempo."],
  },
  flank: {
    title: "A full centre against flank play",
    plans: ["Claim central space with …d5 and support it with …c6.", "Develop …Bf5 before closing the diagonal with …e6.", "Prepare the central …e5 break after completing development."],
  },
  default: {
    title: "A healthy Slav middlegame",
    plans: ["Build the …d5–…c6 centre without trapping the light-squared bishop.", "Develop naturally and use …Nbd7 to support …e5.", "Choose between central counterplay and queenside expansion based on White's setup."],
  },
};

const nimzoLarsenWhiteGoals: Record<string, TrainingGoal> = {
  exchange: {
    title: "The e5 clamp after the bishop trade",
    plans: ["Use Bb5 and Bxc6 to remove a knight that supports e5.", "Coordinate f4 and Nf3 against the key central square.", "Castle before turning the positional bind into a kingside attack."],
  },
  attack: {
    title: "The complete Nimzo-Larsen attacking setup",
    plans: ["Keep the b2 bishop aimed at e5.", "Build with e3, f4, Nf3 and kingside castling.", "Bring the remaining pieces into the attack before advancing more pawns."],
  },
  adaptive: {
    title: "Adapt the Nimzo-Larsen setup",
    plans: ["Keep b3, Bb2 and e3 as the stable core.", "Omit Bb5 or f4 when Black's setup makes that plan unavailable.", "Complete development and challenge e5 with the pieces or a prepared central break."],
  },
};

const nimzoLarsenBlackGoals: Record<string, TrainingGoal> = {
  exchange: {
    title: "Remove White's central knight",
    plans: ["Use ...Bb4 and ...Bxc3 to remove a defender of e4.", "Play ...f5 when the pawn advance is tactically safe.", "Complete ...Nf6 and O-O before increasing the pressure."],
  },
  centre: {
    title: "Pressure White's centre from the long diagonal",
    plans: ["Develop ...b6, ...Bb7 and ...e6 in that order.", "Target e4 with ...Nf6 and choose ...f5, ...c5 or ...d5 from White's setup.", "Castle before opening the centre."],
  },
  adaptive: {
    title: "The reversed Nimzo-Larsen setup",
    plans: ["Keep ...b6, ...Bb7 and ...e6 as the stable core.", "If ...Bb4 or ...f5 is unavailable, challenge the centre with ...c5 or ...d5.", "Develop ...Nf6 and castle before expanding."],
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
    return sicilianGoals.anti;
  }

  if (openingId === "grunfeld") {
    if (lineId.includes("exchange") || lineId.includes("knight") || lineId.includes("no-exchange")) return grunfeldGoals.exchange;
    return grunfeldGoals.quiet;
  }

  if (openingId === "caro-kann") {
    if (lineId.startsWith("advance")) return caroGoals.advance;
    if (lineId.startsWith("classical")) return caroGoals.classical;
    if (lineId.startsWith("exchange")) return caroGoals.exchange;
    if (lineId.startsWith("panov")) return caroGoals.panov;
    if (lineId.startsWith("fantasy")) return caroGoals.fantasy;
    return caroGoals.two;
  }

  if (openingId === "london-system") {
    if (lineId.includes("classical") || lineId.includes("e6")) return londonGoals.classical;
    if (lineId.includes("g6")) return londonGoals.g6;
    if (lineId.includes("c5") || lineId.includes("qb6")) return londonGoals.c5;
    if (lineId.includes("bf5") || lineId.includes("mirror")) return londonGoals.mirror;
    if (lineId.includes("nc6")) return londonGoals.nc6;
    if (lineId.includes("c6")) return londonGoals.c6;
    if (lineId.includes("b6")) return londonGoals.b6;
    if (lineId.includes("bg4")) return londonGoals.bg4;
    if (lineId.includes("nh5")) return londonGoals.nh5;
    return londonGoals.default;
  }

  if (openingId === "slav-universal") {
    if (lineId.includes("london")) return slavGoals.london;
    if (lineId.includes("jobava")) return slavGoals.jobava;
    if (lineId.includes("english") || lineId.includes("reti") || lineId.includes("larsen") || lineId.includes("grob")) return slavGoals.flank;
    return slavGoals.default;
  }

  if (openingId === "nimzo-larsen-white") {
    if (lineId.includes("exchange") || lineId.includes("classical")) return nimzoLarsenWhiteGoals.exchange;
    if (lineId.includes("c6") || lineId.includes("dutch") || lineId.includes("mirror") || lineId.includes("kid")) {
      return nimzoLarsenWhiteGoals.adaptive;
    }
    return nimzoLarsenWhiteGoals.attack;
  }

  if (openingId === "nimzo-larsen-black") {
    if (lineId.includes("bb4") || lineId.includes("jobava")) return nimzoLarsenBlackGoals.exchange;
    if (lineId.includes("e4") || lineId.includes("qg") || lineId.includes("london") || lineId.includes("colle")) {
      return nimzoLarsenBlackGoals.centre;
    }
    return nimzoLarsenBlackGoals.adaptive;
  }

  return slavGoals.default;
};
