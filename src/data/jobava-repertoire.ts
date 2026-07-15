import type { RepertoireLine, UciMove } from "@/lib/types";

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
  goal: {
    title: "Middlegame setup",
    plans: ["Complete development.", "Coordinate the pieces.", "Prepare the thematic pawn break."],
  },
});

export const jobavaRepertoire: RepertoireLine[] = [
  line(
    "jobava-e6-nb5",
    "Main line …e6",
    20,
    "d2d4 d7d5 b1c3 g8f6 c1f4 e7e6 c3b5 b8a6 e2e3 c7c6 b5c3 f8d6 f4d6 d8d6 f2f4 e8g8 g1f3 c6c5",
  ),
  line(
    "jobava-e6-solid",
    "Main line …e6",
    12,
    "d2d4 d7d5 b1c3 g8f6 c1f4 e7e6 e2e3 f8d6 f4g3 e8g8 g1f3 c7c5 f1d3 b8c6 e1g1 d6g3 h2g3 c5d4",
  ),
  line(
    "jobava-bf5-f3",
    "Mirror …Bf5",
    20,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5 f2f3 e7e6 g2g4 f5g6 h2h4 h7h5 g4g5 f6d7 e2e4 c7c6 f1d3 f8e7 g1e2 e8g8",
  ),
  line(
    "jobava-bf5-f3-c5",
    "Mirror …Bf5",
    14,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5 f2f3 c7c5 g2g4 f5g6 h2h4 h7h6 h4h5 g6h7 e2e4 e7e6 d4c5 f8c5",
  ),
  line(
    "jobava-bf5-e3-f3",
    "Mirror …Bf5",
    13,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5 e2e3 e7e6 f2f3 c7c5 g2g4 f5g6 h2h4 h7h6 h4h5 g6h7 c3b5 b8a6 f1d3 h7d3 d1d3",
  ),
  line(
    "jobava-bf5-solid",
    "Mirror …Bf5",
    9,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c8f5 e2e3 e7e6 g1f3 f8d6 f4g3 e8g8 f1d3 d6g3 h2g3 c7c5",
  ),
  line(
    "jobava-c5-gambit",
    "…c5 Break",
    18,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c7c5 e2e4 d5e4 d4d5 a7a6 d1e2 c8f5 e1c1 b8d7 f2f3 e4f3 g1f3 g7g6",
  ),
  line(
    "jobava-c5-solid",
    "…c5 Break",
    10,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c7c5 e2e3 b8c6 c3b5 e7e5 d4e5 f6e4 c2c3 g7g5 f4g3 h7h5 f2f3 e4g3 h2g3 g5g4",
  ),
  line(
    "jobava-c6-solid",
    "…c6 Structure",
    17,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c7c6 e2e3 c8f5 g1f3 e7e6 f1d3 f5d3 d1d3 f8d6 f4g3 e8g8 e1g1 c6c5",
  ),
  line(
    "jobava-c6-attack",
    "…c6 Structure",
    11,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c7c6 f2f3 c8f5 g2g4 f5g6 h2h4 h7h5 g4g5 f6d7 e2e4 e7e6 f1d3 f8b4",
  ),
  line(
    "jobava-c6-e3-f3",
    "…c6 Structure",
    13,
    "d2d4 d7d5 b1c3 g8f6 c1f4 c7c6 e2e3 c8f5 f2f3 e7e6 g2g4 f5g6 h2h4 h7h6 h4h5 g6h7 f1d3 h7d3 d1d3",
  ),
  line(
    "jobava-g6-h4",
    "…g6 Fianchetto",
    18,
    "d2d4 d7d5 b1c3 g8f6 c1f4 g7g6 d1d2 f8g7 f4h6 e8g8 h2h4 c7c5 d4c5 d5d4 e1c1 b8c6 h6g7 g8g7",
  ),
  line(
    "jobava-g6-center",
    "…g6 Fianchetto",
    10,
    "d2d4 d7d5 b1c3 g8f6 c1f4 g7g6 e2e4 d5e4 d1d2 f8g7 e1c1 e8g8 f4h6 c7c5 d4d5 g7h6 d2h6 b8d7",
  ),
  line(
    "jobava-a6-attack",
    "Prophylaxis …a6",
    14,
    "d2d4 d7d5 b1c3 g8f6 c1f4 a7a6 e2e3 e7e6 g2g4 f8d6 g4g5 d6f4 e3f4 f6d7 g1f3 c7c5 d4c5 d7c5",
  ),
  line(
    "jobava-nc6-pressure",
    "Development …Nc6",
    13,
    "d2d4 d7d5 b1c3 g8f6 c1f4 b8c6 e2e3 c8f5 c3b5 a8c8 g1f3 e7e6 f3e5 c6e5 f4e5 a7a6 b5c3 f8e7",
  ),
  line(
    "jobava-nc6-f3",
    "Development …Nc6",
    10,
    "d2d4 d7d5 b1c3 g8f6 c1f4 b8c6 e2e3 c8f5 f2f3 e7e6 g2g4 f5g6 h2h4 h7h6 h4h5 g6h7 f1d3 h7d3 d1d3",
  ),
  line(
    "jobava-nbd7-nb5",
    "Development …Nbd7",
    12,
    "d2d4 d7d5 b1c3 g8f6 c1f4 b8d7 c3b5 e7e5 d4e5 f6h5 e2e3 h5f4 e3f4 c7c6 b5d4 d7c5 g1f3 f8e7",
  ),
  line(
    "jobava-kid-attack",
    "Indian Setup",
    12,
    "d2d4 g8f6 b1c3 g7g6 e2e4 d7d6 c1f4 f8g7 d1d2 e8g8 e1c1 c7c6 f2f3 b7b5 h2h4 b5b4 c3e2 b8d7",
  ),
];

const guidance: Record<string, { hint: string; explanation: string }> = {
  d2d4: { hint: "Claim the centre and prepare quick development of the b1 knight.", explanation: "d4 establishes the Jobava London centre." },
  b1c3: { hint: "Develop the knight in front of the c-pawn - the Jobava's signature move.", explanation: "Nc3 supports e4 and creates Nb5 ideas against c7." },
  c1f4: { hint: "Bring the bishop outside the pawn chain before playing e3.", explanation: "Bf4 completes the typical d4–Nc3–Bf4 triangle." },
  c3b5: { hint: "Find an advanced square that increases the pressure on c7.", explanation: "Nb5 combines knight and bishop pressure against c7." },
  e2e3: { hint: "Reinforce d4 and open the kingside bishop's diagonal.", explanation: "e3 stabilises the centre and prepares kingside development." },
  f2f3: { hint: "Prepare a major expansion in the centre and on the kingside.", explanation: "f3 supports e4 and, against …Bf5, prepares g4 with tempo." },
  e2e4: { hint: "Use your development lead to occupy - or even sacrifice - the centre.", explanation: "e4 is the thematic Jobava break, especially energetic against …c5 or …g6." },
  g2g4: { hint: "Gain space by attacking a bishop that developed early.", explanation: "g4–g5 gains tempi on Black's pieces and launches the kingside attack." },
  h2h4: { hint: "Start the pawn storm before Black secures the king.", explanation: "h4–h5 is a typical Jobava plan against a fianchetto or a bishop on g6." },
  d1d2: { hint: "Connect the queen with Bh6 and prepare queenside castling.", explanation: "Qd2 coordinates Bh6 and O-O-O in one attacking idea." },
  e1c1: { hint: "Secure your king and bring the rook straight to the d-file.", explanation: "O-O-O completes development and enables an opposite-side attack." },
  g1f3: { hint: "Develop toward the centre and prepare Ne5.", explanation: "Nf3 completes natural development and controls e5." },
};

export const jobavaGuidanceFor = (moves: UciMove[]) => {
  const known = moves.map((move) => guidance[move]).find(Boolean);
  return known ?? {
    hint: "Look for an active move that develops, supports e4 or increases pressure on c7.",
    explanation: "This continuation keeps the Jobava's main themes: fast development, e4 and a kingside attack.",
  };
};
