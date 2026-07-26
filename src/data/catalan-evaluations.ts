// Static Stockfish 18 depth-18 scores in centipawns from White's perspective.
// Line arrays include the initial position, then one score after every move.
export const catalanEvaluations: Record<string, number[]> = {
  "catalan-indian-nf3": [40, 24, 29, 35, 36, 30, 37, 34],
  "catalan-indian-bg2": [40, 24, 29, 35, 36, 30, 37, 34],
  "catalan-open-modern-sharp": [
    40, 24, 37, 37, 36, 38, 40, 33, 35, 35, 34, 36, 29, 32, 26, 27, 30, 34, 31, 28, 29, 29, 29, 24, 24, 22, 21,
    23, 22, 20,
  ],
  "catalan-closed": [40, 24, 37, 37, 36, 38, 40, 33, 27, 29],
  "catalan-anti-nimzo": [40, 24, 29, 35, 36, 26, 59, 28, 26, 26],
  "catalan-marshall": [40, 24, 37, 37, 69, 62, 88, 103, 98, 31, 61, 49, 70, 39, 52, 52],
  "catalan-slav": [40, 24, 37, 37, 38, 40, 96, 52, 146, 44, 43, 31, 91, 67],
  "catalan-hungarian": [40, 24, 29, 35, 36, 30, 103, 109, 113, 79, 110, 107],
  "catalan-neo": [40, 22, 32, 23, 26, 18, 26, 29, 44, 46],
  "catalan-tarrasch": [40, 24, 37, 37, 36, 38, 40, 33, 40, 36, 46, 41, 40, 37, 38, 36, 42],
  "catalan-albin": [40, 24, 37, 37, 62, 83, 74, 70, 66, 79, 109, 111],
};

// Additional safe positions created by the allowlisted adjacent Catalan setup move orders.
export const catalanPositionEvaluations: Record<string, number> = {
  "rnbqkbnr/ppp2ppp/4p3/3p4/2PP4/6P1/PP2PP1P/RNBQKBNR b KQkq -": 20,
  "r1bqkb1r/pppp1ppp/2n1pn2/8/2PP4/6P1/PP2PP1P/RNBQKBNR w KQkq -": 35,
  "rnbqkb1r/ppp1pppp/8/3n4/3P4/6P1/PP2PP1P/RNBQKBNR b KQkq -": 35,
  "rn1qkb1r/ppp1pppp/8/3n1b2/3P4/6P1/PP2PP1P/RNBQKBNR w KQkq -": 110,
  "rn1qkb1r/ppp1pppp/8/3n1b2/3P4/5N2/PP1NPPPP/R1BQKB1R b KQkq -": 87,
  "rn1qkb1r/ppp2ppp/4p3/3n1b2/3P4/5N2/PP1NPPPP/R1BQKB1R w KQkq -": 386,
  "rn1qkb1r/ppp2ppp/4p3/3n1b2/3P4/5NP1/PP2PPBP/RNBQK2R b KQkq -": 64,
  "rn1qkb1r/ppp2ppp/4p1b1/3n4/3P4/5NP1/PP2PPBP/RNBQK2R w KQkq -": 117,
  "rnbqkb1r/pppp1ppp/8/4P3/2P3n1/6P1/PP2PPBP/RNBQK1NR b KQkq -": 94,
  "r1bqkb1r/pppp1ppp/2n5/4P3/2P3n1/6P1/PP2PPBP/RNBQK1NR w KQkq -": 107,
  "rnbqkbnr/pppp1ppp/4p3/8/2P5/6P1/PP1PPP1P/RNBQKBNR b KQkq -": 25,
  "rnbqkbnr/ppp2ppp/4p3/3p4/2P5/6P1/PP1PPP1P/RNBQKBNR w KQkq -": 25,
  "rnbqkbnr/ppp2ppp/8/4P3/2Pp4/6P1/PP2PP1P/RNBQKBNR b KQkq -": 64,
  "r1bqkbnr/ppp2ppp/2n5/4P3/2Pp4/6P1/PP2PP1P/RNBQKBNR w KQkq -": 68,
};
