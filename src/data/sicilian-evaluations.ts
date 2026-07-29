// Static Stockfish 18 depth-18 scores in centipawns from White's perspective.
// Line arrays include the initial position, then one score after every move.
export const sicilianEvaluations: Record<string, number[]> = {
  "sicilian-dragon-main": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 68, 64, 66, 64, 62, 65, 66, 66, 65, 63],
  "sicilian-dragon-yugoslav": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 68, 64, 66, 64, 62, 65, 49, 64, 64, 57],
  "sicilian-dragon-classical": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 30, 35, 26, 29, 28, 28, -3, 23],
  "sicilian-moscow": [38, 39, 54, 50, 28, 17, 13, 19, 32, 28, 23, 25, 35, 25, 36, 25, 20, 15, 40, 43, 44, 47, 45],
  "sicilian-smith-morra": [35, 35, 42, 24, 16, -30, 17, 18, 23, 23, 15, 18, 19, 7, 22, 31, 27, 23, 28, 24, 23, 21, 19, 7, 11, 0, 0],
  "sicilian-bowdler": [31, 39, 39, -10, 16, 14, 13, 2, 12, 9, 7, 11, 10, 2, -3],
  "sicilian-alapin-central": [37, 36, 33, 22, 20, 19, 19, 21, 25, 25, 26, 23, 21, 22, 18, 24, 31, 30, 21, 26, 27, 24, 21, 18, 16, 1, -3],
  "sicilian-alapin-bishop-exchange": [40, 42, 41, 24, 21, 24, 25, 24, 21, 24, 13, 13, 10, 17, 25, 6, 0, 0, -1, -4, -6, -3, -7, -11, -10, -6, -7, -7, -7, -16, -16, -13, -15, -14, -8, -1, -1, -18, -19, -15, 21, 10, 11],
  "sicilian-closed-f4": [35, 36, 39, 34, 45, -6, 20, 5, 15, -6, -5, -9, -10, -8, -10, -14, -8, 0, 0, 0, 1, -2, -4, -1, -4],
  "sicilian-closed-nge2": [35, 36, 39, 34, 45, -6, 20, 5, 15, 13, 27, 8, 10, 4, 18, 16, 23, 21, 14, 15, 10, 11, 16],
  "sicilian-closed-dragon-transposition": [37, 36, 33, 36, 36, 31, 40, 52, 48, 44, 71, 59, 59, 57, 60, 69, 67, 72, 71, 63, 70],
};

export const sicilianPositionEvaluations: Record<string, number> = {
  "rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPP3PP/R2QKB1R w KQ -": 70,
  "rnbq1rk1/pp2ppbp/3p1np1/8/3NP3/2N1BP2/PPPQ2PP/R3KB1R b KQ -": 70,
  "rnbq1rk1/pp2ppbp/3p1np1/2pN4/4P3/6P1/PPPPNPBP/R1BQK2R w KQ -": 12,
  "rnbq1rk1/pp2ppbp/3p1np1/2pN4/4P3/6P1/PPPPNPBP/R1BQ1RK1 b - -": 14,
  "r1bqk2r/pp2ppbp/2np1np1/8/3NP3/2N5/PPP1BPPP/R1BQ1RK1 w kq -": 27,
  "r1bqk2r/pp2ppbp/2np1np1/8/3NP3/2N1B3/PPP1BPPP/R2Q1RK1 b kq -": 25,
};
