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

const jobavaGoals: Record<string, TrainingGoal> = {
  bf5: {
    title: "A kingside initiative against …Bf5",
    plans: ["Use f3 to support e4 and prepare g4 with tempo.", "Gain space with g4–g5 and h4–h5 while the bishop retreats.", "Open the centre only after your pieces can join the attack."],
  },
  g6: {
    title: "Attack the fianchetto",
    plans: ["Coordinate Qd2 and Bh6 to exchange Black's key defender.", "Use h4–h5 to create entry points around the king.", "Castle long when the centre makes opposite-side attacks practical."],
  },
  c5: {
    title: "Active play against …c5",
    plans: ["Consider the thematic e4 break while development gives you momentum.", "Use Nb5 to keep pressure on c7.", "Choose the moment to open the centre with king safety in mind."],
  },
  default: {
    title: "Jobava pieces ready for action",
    plans: ["Keep the d4–Nc3–Bf4 setup coordinated.", "Look for Nb5, Ne5 and the central e4 break.", "When …Bf5 appears, keep f3–g4 available as a practical attacking plan."],
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

export const trainingGoalFor = (openingId: OpeningId, lineId: string): TrainingGoal => {
  if (openingId === "caro-kann") {
    if (lineId.startsWith("advance")) return caroGoals.advance;
    if (lineId.startsWith("classical")) return caroGoals.classical;
    if (lineId.startsWith("exchange")) return caroGoals.exchange;
    if (lineId.startsWith("panov")) return caroGoals.panov;
    if (lineId.startsWith("fantasy")) return caroGoals.fantasy;
    return caroGoals.two;
  }

  if (openingId === "jobava-london") {
    if (lineId.includes("bf5") || lineId.includes("c6-attack") || lineId.includes("nc6-f3")) return jobavaGoals.bf5;
    if (lineId.includes("g6") || lineId.includes("kid")) return jobavaGoals.g6;
    if (lineId.includes("c5")) return jobavaGoals.c5;
    return jobavaGoals.default;
  }

  if (lineId.includes("london")) return slavGoals.london;
  if (lineId.includes("jobava")) return slavGoals.jobava;
  if (lineId.includes("english") || lineId.includes("reti") || lineId.includes("larsen") || lineId.includes("grob")) return slavGoals.flank;
  return slavGoals.default;
};
