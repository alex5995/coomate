import type { RepertoireLine, UciMove } from "@/lib/types";

const familyGoals: Record<string, RepertoireLine["goal"]> = {
  "Classical …e6/…Bd6": {
    title: "Classical London outpost",
    plans: [
      "Use Ne5 as the central outpost and support it before expanding.",
      "After ...Bxf4, welcome exf4 when its e5 control and semi-open e-file support active central play.",
      "Prepare e4 when the pieces are coordinated, or meet ...cxd4 with a sound recapture.",
    ],
  },
  "Early …c5/…Qb6": {
    title: "London under queenside pressure",
    plans: [
      "Protect b2 while keeping the d4 centre stable.",
      "Develop with c3 and Nbd2, then challenge Black's active queen with useful tempi.",
      "Use the e5 outpost or a timely central capture once development is complete.",
    ],
  },
  "Fianchetto …g6": {
    title: "London against a kingside fianchetto",
    plans: [
      "Build the usual e3, c3 and Nbd2 structure before committing the centre.",
      "Place a knight on e5 and watch for an e4 expansion when it is well supported.",
      "Keep the king safe and use the London bishop to contest key central squares.",
    ],
  },
  "Slav …c6": {
    title: "London against the Slav triangle",
    plans: [
      "Finish development before choosing between Ne5 and a central pawn break.",
      "Welcome a bishop exchange when it improves queen coordination or opens a useful file.",
      "Use c3 to secure d4 and keep Nbd2 available for central support.",
    ],
  },
  "Mirror …Bf5": {
    title: "London mirror structure",
    plans: [
      "Challenge Black's active bishop with Bd3 or exchange on d6 when useful.",
      "Reach c3, Nbd2 and O-O before starting central operations.",
      "Claim e5 and use the open files created by bishop exchanges.",
    ],
  },
  "Queen's Indian …b6": {
    title: "London against a queenside fianchetto",
    plans: [
      "Develop calmly while Black's bishop targets the long diagonal.",
      "Support Ne5 with Nbd2 and coordinate the queen for kingside pressure.",
      "Keep d4 firm with c3 before deciding whether to expand in the centre.",
    ],
  },
  "Chigorin …Nc6": {
    title: "London against early knight pressure",
    plans: [
      "Reinforce d4 and avoid premature tactics against the c6 knight.",
      "Develop the kingside, castle, and let Nbd2 support the centre.",
      "Meet ...e5 with a prepared exchange or use Ne5 when the square is secure.",
    ],
  },
  "Pin …Bg4": {
    title: "London against the bishop pin",
    plans: [
      "Break the pin through sound development rather than weakening the king.",
      "Use Be2 or Bd3, castle, and build the c3 and Nbd2 support chain.",
      "Occupy e5 when moving the f3 knight also improves the bishop's coordination.",
    ],
  },
  "Bishop hunt …Nh5": {
    title: "London bishop under pressure",
    plans: [
      "Preserve or exchange the f4 bishop without creating unnecessary weaknesses.",
      "If Black trades on g3, use the h-pawn recapture to open a useful rook file.",
      "Return to e3, c3, Nbd2 and O-O before taking action in the centre.",
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
  goal: familyGoals[family],
});

export const londonRepertoire: RepertoireLine[] = [
  line(
    "london-classical-main",
    "Classical …e6/…Bd6",
    24,
    "d2d4 d7d5 g1f3 g8f6 c1f4 e7e6 e2e3 f8d6 f4g3 e8g8 f1d3 c7c5 c2c3 b8c6 b1d2 d8c7 e1g1 b7b6 f3e5 c8b7 d1e2 f8e8 e3e4 d5e4 d2e4 f6e4 d3e4",
  ),
  line(
    "london-classical-be2",
    "Classical …e6/…Bd6",
    17,
    "d2d4 d7d5 c1f4 g8f6 g1f3 e7e6 e2e3 f8d6 f4g3 e8g8 f1e2 c7c5 c2c3 b8c6 b1d2 b7b6 e1g1 c8b7 f3e5 a8c8",
  ),
  line(
    "london-classical-exchange",
    "Classical …e6/…Bd6",
    14,
    "d2d4 d7d5 g1f3 g8f6 c1f4 e7e6 e2e3 f8d6 f4d6 d8d6 f1d3 e8g8 e1g1 c7c5 c2c3 b8c6 b1d2 e6e5 d4e5 c6e5 f3e5 d6e5",
  ),
  line(
    "london-classical-bxf4-c3",
    "Classical …e6/…Bd6",
    10,
    "d2d4 d7d5 c1f4 g8f6 e2e3 e7e6 g1f3 f8d6 c2c3 d6f4 e3f4 e8g8 f1d3 c7c5 e1g1 b8c6 b1d2 d8c7 f3e5 b7b6",
  ),
  line(
    "london-classical-bxf4-bd3",
    "Classical …e6/…Bd6",
    10,
    "d2d4 d7d5 c1f4 g8f6 e2e3 e7e6 g1f3 f8d6 f1d3 d6f4 e3f4 e8g8 e1g1 c7c5 c2c3 b8c6 b1d2 d8c7 f3e5 b7b6",
  ),

  line(
    "london-c5-qc1",
    "Early …c5/…Qb6",
    22,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c7c5 e2e3 d8b6 d1c1 b8c6 c2c3 c8f5 b1d2 e7e6 f1e2 f8e7 e1g1 e8g8 f3e5 a8c8",
  ),
  line(
    "london-c5-nc3-tactical",
    "Early …c5/…Qb6",
    12,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c7c5 e2e3 d8b6 b1c3 b8c6 f1e2 c5d4 e3d4 c8f5 e1g1 e7e6 c3b5 a8c8 c2c3 f8e7 f3e5 e8g8",
  ),
  line(
    "london-c5-queen-trade",
    "Early …c5/…Qb6",
    18,
    "d2d4 d7d5 c1f4 c7c5 e2e3 b8c6 c2c3 g8f6 b1d2 d8b6 d1b3 b6b3 a2b3 c5d4 e3d4 c8f5 g1f3 e7e6 f1e2 f8e7 e1g1 e8g8 f3e5 h7h6",
  ),

  line(
    "london-g6-be2",
    "Fianchetto …g6",
    21,
    "d2d4 g8f6 g1f3 g7g6 c1f4 f8g7 e2e3 e8g8 f1e2 d7d5 e1g1 c7c5 c2c3 b8c6 b1d2 b7b6 h2h3 c8b7 f3e5 f6d7",
  ),
  line(
    "london-g6-bd3",
    "Fianchetto …g6",
    16,
    "d2d4 g8f6 c1f4 g7g6 g1f3 f8g7 e2e3 e8g8 f1d3 d7d5 e1g1 c7c5 c2c3 b8c6 b1d2 b7b6 h2h3 c8b7 f3e5 c5c4 d3c2",
  ),
  line(
    "london-g6-kings-indian",
    "Fianchetto …g6",
    18,
    "d2d4 g8f6 c1f4 g7g6 g1f3 f8g7 e2e3 e8g8 f1e2 d7d6 e1g1 b8d7 h2h3 d8e8 c2c3 e7e5 f4h2 b7b6 b1d2 c8b7",
  ),

  line(
    "london-c6-bishop-trade",
    "Slav …c6",
    21,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c7c6 e2e3 c8f5 f1d3 f5d3 d1d3 e7e6 b1d2 f8d6 e1g1 e8g8 c2c3 d8c7 f3e5 b8d7",
  ),
  line(
    "london-c6-be2",
    "Slav …c6",
    16,
    "d2d4 d7d5 c1f4 c7c6 g1f3 g8f6 e2e3 c8f5 f1e2 e7e6 e1g1 f8d6 f4d6 d8d6 c2c3 b8d7 b1d2 e8g8 f3e5 f8e8",
  ),
  line(
    "london-c6-bxf4",
    "Slav …c6",
    10,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c7c6 e2e3 c8f5 f1d3 f5d3 d1d3 e7e6 b1d2 f8d6 e1g1 d6f4 e3f4 e8g8 c2c3 d8c7 f3e5 b8d7",
  ),

  line(
    "london-mirror-bd3",
    "Mirror …Bf5",
    22,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c8f5 e2e3 e7e6 f1d3 f5d3 d1d3 f8d6 b1d2 e8g8 e1g1 c7c5 c2c3 b8c6 f3e5 d8c7",
  ),
  line(
    "london-mirror-double-exchange",
    "Mirror …Bf5",
    14,
    "d2d4 d7d5 c1f4 g8f6 g1f3 c8f5 e2e3 e7e6 c2c3 f8d6 f4g3 e8g8 f1d3 f5d3 d1d3 d6g3 h2g3 c7c5 b1d2 b8c6 e1g1 d8c7",
  ),
  line(
    "london-mirror-be2",
    "Mirror …Bf5",
    17,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c8f5 e2e3 e7e6 f1e2 f8d6 f4d6 d8d6 e1g1 b8d7 c2c3 e8g8 b1d2 c7c5 f3e5 f8e8",
  ),
  line(
    "london-mirror-bxf4",
    "Mirror …Bf5",
    10,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c8f5 e2e3 e7e6 f1d3 f5d3 d1d3 f8d6 b1d2 d6f4 e3f4 e8g8 e1g1 c7c5 c2c3 b8c6 f3e5 d8c7",
  ),

  line(
    "london-b6-bd3",
    "Queen's Indian …b6",
    19,
    "d2d4 g8f6 g1f3 e7e6 c1f4 b7b6 e2e3 c8b7 f1d3 f8e7 e1g1 e8g8 c2c3 d7d5 b1d2 c7c5 f3e5 b8d7 d1f3 f8e8",
  ),
  line(
    "london-b6-be2",
    "Queen's Indian …b6",
    14,
    "d2d4 g8f6 c1f4 e7e6 g1f3 b7b6 e2e3 c8b7 f1e2 f8e7 e1g1 e8g8 c2c3 d7d5 b1d2 c7c5 f3e5 b8c6 h2h3 a8c8",
  ),

  line(
    "london-nc6-classical",
    "Chigorin …Nc6",
    18,
    "d2d4 d7d5 g1f3 b8c6 c1f4 c8f5 e2e3 e7e6 c2c3 f8d6 f4g3 g8f6 f1d3 d6g3 h2g3 e8g8 b1d2 f8e8 e1g1 e6e5 d4e5 c6e5 f3e5 e8e5",
  ),
  line(
    "london-nc6-pin",
    "Chigorin …Nc6",
    13,
    "d2d4 d7d5 c1f4 b8c6 g1f3 c8g4 e2e3 e7e6 f1e2 f8d6 f4g3 g8e7 b1d2 e8g8 e1g1 d6g3 h2g3 e7f5 c2c3 d8d6",
  ),
  line(
    "london-nc6-bxf4",
    "Chigorin …Nc6",
    9,
    "d2d4 d7d5 g1f3 b8c6 c1f4 c8f5 e2e3 e7e6 c2c3 f8d6 f1e2 d6f4 e3f4 g8f6 e1g1 e8g8 b1d2 f8e8 f3e5 d8d6",
  ),

  line(
    "london-bg4-be2",
    "Pin …Bg4",
    18,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c8g4 e2e3 e7e6 f1e2 f8d6 f4g3 e8g8 e1g1 d6g3 h2g3 b8d7 c2c3 c7c5 b1d2 d8c7 f3e5 g4e2 d1e2 d7e5 d4e5 f6d7",
  ),
  line(
    "london-bg4-bd3",
    "Pin …Bg4",
    14,
    "d2d4 d7d5 c1f4 g8f6 g1f3 c8g4 e2e3 e7e6 f1d3 c7c5 c2c3 b8c6 b1d2 f8d6 f4g3 e8g8 e1g1 d6g3 h2g3 e6e5 d4e5 f6e4 d1c2 d8e7",
  ),
  line(
    "london-bg4-bxf4",
    "Pin …Bg4",
    9,
    "d2d4 d7d5 g1f3 g8f6 c1f4 c8g4 e2e3 e7e6 f1e2 f8d6 c2c3 d6f4 e3f4 e8g8 e1g1 b8d7 b1d2 c7c5 f3e5 g4e2 d1e2 d8c7",
  ),

  line(
    "london-nh5-bishop-hunt",
    "Bishop hunt …Nh5",
    17,
    "d2d4 d7d5 g1f3 g8f6 c1f4 f6h5 f4g5 h7h6 g5h4 g7g5 h4g3 h5g3 h2g3 f8g7 e2e3 c7c5 c2c3 b8c6 b1d2 e7e5 d4e5 c6e5 f3e5 g7e5 f1d3 e8g8 e1g1",
  ),
  line(
    "london-nh5-simple-exchange",
    "Bishop hunt …Nh5",
    14,
    "d2d4 d7d5 c1f4 g8f6 g1f3 f6h5 f4g3 h5g3 h2g3 c7c5 e2e3 b8c6 c2c3 e7e6 f1d3 f8d6 b1d2 h7h6 e1g1 e8g8 f3e5 d8c7",
  ),
];

const guidance: Record<string, { hint: string; explanation: string }> = {
  d2d4: {
    hint: "Claim the centre with the pawn that anchors the whole setup.",
    explanation: "d4 gives the London its stable centre and opens the c1 bishop's route to f4.",
  },
  g1f3: {
    hint: "Develop the kingside knight and take control of e5.",
    explanation: "Nf3 supports d4, prepares castling and makes Ne5 available later.",
  },
  c1f4: {
    hint: "Develop the light-squared bishop before closing its diagonal.",
    explanation: "Bf4 is the London System's defining development and keeps the bishop outside the e3 pawn chain.",
  },
  e2e3: {
    hint: "Secure d4 and open a path for the kingside bishop.",
    explanation: "e3 makes the centre dependable while preparing Bd3 or Be2.",
  },
  c2c3: {
    hint: "Build the London triangle and take control of d4.",
    explanation: "c3 reinforces the centre and leaves the b1 knight free to develop through d2.",
  },
  f1d3: {
    hint: "Point the kingside bishop toward Black's king and prepare to castle.",
    explanation: "Bd3 is active when an exchange on d3 does not damage White's coordination.",
  },
  f1e2: {
    hint: "Choose a secure developing square that prepares castling.",
    explanation: "Be2 avoids unnecessary exchanges and completes calm London development.",
  },
  b1d2: {
    hint: "Develop behind the c-pawn and add another defender to e4 and e5.",
    explanation: "Nbd2 preserves the c-pawn structure and supports the thematic central breaks.",
  },
  e1g1: {
    hint: "Secure the king before beginning central or kingside play.",
    explanation: "O-O completes the core London development and connects the rooks.",
  },
  f3e5: {
    hint: "Occupy the central outpost with a piece that cannot be chased by a pawn easily.",
    explanation: "Ne5 is a central London idea, increasing kingside pressure and supporting active play.",
  },
  f4g3: {
    hint: "Keep the bishop on its useful diagonal while avoiding an exchange on d6.",
    explanation: "Bg3 preserves the London bishop and maintains influence over the centre and kingside.",
  },
  f4d6: {
    hint: "Consider exchanging the bishop when it disrupts Black's coordination.",
    explanation: "Bxd6 can draw the queen away from its ideal square and gives White easy development.",
  },
  e3f4: {
    hint: "Recapture toward the centre and use the new pawn to control e5.",
    explanation: "exf4 accepts doubled f-pawns, but the f4 pawn controls e5 and gives White a semi-open e-file for active central play.",
  },
  d1c1: {
    hint: "Answer the pressure on b2 without weakening the queenside.",
    explanation: "Qc1 calmly protects b2 against an early ...Qb6 and keeps the structure intact.",
  },
  d1b3: {
    hint: "Offer a queen trade once the c-pawn has cleared the diagonal.",
    explanation: "Qb3 neutralises Black's active queen and can lead to a comfortable, structure-led middlegame.",
  },
  b1c3: {
    hint: "Use active development to create a concrete threat against c7.",
    explanation: "Nc3 is justified here by the tactical Nb5 idea against Black's exposed queenside.",
  },
  h2g3: {
    hint: "Recapture toward the centre and open a file for the rook.",
    explanation: "hxg3 restores material after a bishop or knight exchange and leaves useful kingside activity.",
  },
  h2h3: {
    hint: "Give the king luft and ask a pinning bishop to clarify its intentions.",
    explanation: "h3 is a useful waiting move once the essential London development is under way.",
  },
  d4e5: {
    hint: "Recapture in the centre and gain space when the resulting pawn is adequately supported.",
    explanation: "dxe5 resolves central tension and can leave White with an active, well-coordinated position.",
  },
};

export const londonGuidanceFor = (moves: UciMove[]) => {
  const known = moves.map((move) => guidance[move]).find(Boolean);
  return known ?? {
    hint: "Complete the London setup, then preserve or exchange the f4 bishop according to the resulting structure.",
    explanation: "This continuation keeps the London System's core ideas: safe development, a firm d4 centre and control of e5.",
  };
};
