// Static Stockfish 18 depth-18 scores in centipawns from White's perspective.
// Line arrays include the initial position, then one score after every move.
export const grunfeldEvaluations: Record<string, number[]> = {
  "grunfeld-exchange-classical": [40, 24, 29, 35, 37, 36, 36, 37, 32, 30, 31, 32, 30, 34, 31, -9, 66, 67, 66, 60, 65],
  "grunfeld-exchange-gm": [40, 24, 29, 35, 37, 36, 36, 37, 32, 30, 31, 32, 30, 34, 31, 21, 20, -31],
  "grunfeld-exchange-exact": [40, 24, 29, 35, 37, 36, 36, 37, 32, 30, 31, 32, 30, 40, 36, 30, 29, 37, 29, 22, 23],
  "grunfeld-knight-takes": [40, 24, 29, 35, 37, 36, 36, 37, 32, -23, -21, -35, -37, -28, -26, -68, -65, -86, -89, -173, -46, -118],
  "grunfeld-no-exchange": [40, 24, 29, 35, 37, 36, 36, 32, 36, 4, 16, -15, -13, -17, 11, -36, -33, -18, -17, -37, -38],
  "grunfeld-bishop-pin": [40, 24, 29, 35, 37, 36, 36, 32, 36, 18, 15],
  "grunfeld-nf3-quiet": [40, 24, 29, 35, 37, 28, 31, 20, 20, 24],
  "grunfeld-nf3-catalan": [40, 24, 29, 35, 37, 28, 31, 28, 29],
};

// Additional safe positions created by the allowlisted adjacent Grünfeld setup move orders.
export const grunfeldPositionEvaluations: Record<string, number> = {
  "rnbqkb1r/pp2pp1p/6p1/2p5/3PP3/2P5/P4PPP/R1BQKBNR w KQkq -": 45,
  "rnbqkb1r/pp2pp1p/6p1/2p5/3PP3/2P2N2/P4PPP/R1BQKB1R b KQkq -": 35,
  "rnbq1rk1/ppp1ppbp/6p1/8/3PP3/2P2N2/P4PPP/R1BQKB1R w KQ -": 73,
  "rnbq1rk1/ppp1ppbp/6p1/8/3PP3/2P2N2/P3BPPP/R1BQK2R b KQ -": 74,
  "rnb1k2r/pp2ppbp/6p1/q1p5/3PP3/2P2N2/P3BPPP/R1BQK2R w KQkq -": 74,
  "rnb1k2r/pp2ppbp/6p1/q1p5/3PP3/2P2N2/P3BPPP/R1BQ1RK1 b kq -": 83,
  "rn1q1rk1/pp2ppbp/6p1/2p5/3PP1b1/2P2N2/P3BPPP/R1BQ1RK1 w - -": 61,
  "rn1q1rk1/pp2ppbp/6p1/2p5/3PP1b1/2P2N2/P2BBPPP/R2Q1RK1 b - -": -52,
  "rnbqkb1r/pp2pp1p/6p1/2p5/2BPP3/2P5/P4PPP/R1BQK1NR b KQkq -": 39,
  "rnbq1rk1/ppp1ppbp/6p1/8/2BPP3/2P5/P4PPP/R1BQK1NR w KQ -": 41,
  "rnbq1rk1/ppp1ppbp/6p1/8/2BPP3/2P5/P3NPPP/R1BQK2R b KQ -": 33,
  "r1bqk2r/pp2ppbp/2n3p1/2p5/2BPP3/2P5/P3NPPP/R1BQK2R w KQkq -": 31,
  "r1bqk2r/pp2ppbp/2n3p1/2p5/2BPP3/2P5/P3NPPP/R1BQ1RK1 b kq -": -27,
  "rnb1k2r/pp2ppbp/6p1/2pq4/3P4/4PN2/PP3PPP/R1BQKB1R w KQkq -": -33,
  "rnb1k2r/pp2ppbp/6p1/2pq4/3P4/4PN2/PP2BPPP/R1BQK2R b KQkq -": -88,
  "rn3rk1/pp2ppbp/6p1/2pq4/3P2b1/4PN2/PP2BPPP/R1BQ1RK1 w - -": -22,
  "rn3rk1/pp2ppbp/6p1/2pq4/3P2b1/4PN2/PP1BBPPP/R2Q1RK1 b - -": -43,
  "rnbqk2r/pp2ppbp/5np1/2pp4/2PP4/2N1PN2/PP3PPP/R1BQKB1R w KQkq -": 70,
  "rnbqk2r/pp2ppbp/5np1/2pp4/2PP4/2N1PN2/PP2BPPP/R1BQK2R b KQkq -": -9,
};
