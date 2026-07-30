// Static Stockfish 18 depth-18 scores in centipawns from White's perspective.
// Line arrays include the initial position, then one score after every move.
export const sicilianEvaluations: Record<string, number[]> = {
  "sicilian-dragon-main": [43, 31, 42, 36, 32, 27, 39, 29, 33, 40, 73, 70, 64, 67, 64, 54, 61, 66, 69, 67, 66],
  "sicilian-dragon-yugoslav": [43, 31, 42, 36, 32, 27, 39, 29, 33, 40, 73, 70, 64, 67, 64, 54, 61, 43, 65, 56, 48],
  "sicilian-dragon-classical": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 30, 35, 26, 29, 28, 28, -3, 23],
  "sicilian-moscow": [38, 39, 54, 50, 28, 17, 13, 19, 32, 28, 23, 25, 35, 25, 36, 25, 20, 15, 40, 43, 44, 47, 45],
  "sicilian-smith-morra": [35, 35, 42, 24, 16, -30, 17, 18, 23, 23, 15, 18, 19, 7, 22, 31, 27, 23, 28, 24, 23, 21, 19, 7, 11, 0, 0],
  "sicilian-bowdler": [31, 39, 39, -10, 16, 14, 13, 2, 12, 9, 7, 11, 10, 2, -3],
  "sicilian-alapin-central": [37, 36, 33, 22, 20, 19, 19, 21, 25, 25, 26, 23, 21, 22, 18, 24, 31, 30, 21, 26, 27, 24, 21, 18, 16, 1, -3],
  "sicilian-alapin-bishop-exchange": [40, 42, 41, 24, 21, 24, 25, 24, 21, 24, 13, 13, 10, 17, 25, 6, 0, 0, -1, -4, -6, -3, -7, -11, -10, -6, -7, -7, -7, -16, -16, -13, -15, -14, -8, -1, -1, -18, -19, -15, 21, 10, 11],
  "sicilian-alapin-bishop-exchange-queens": [43, 31, 42, 25, 13, 12, 16, 12, 13, 24, 15, 24, 16, 11, 29, 3, -1, -3, 5, 0, -4, -3, -2, -4, -5, -13, -11, -9, -12, -9, -14, -5, -12, -6, 0, -10, 0, -18, -8, -10, -15, -11, -8],
  "sicilian-closed-f4": [35, 36, 39, 34, 45, -6, 20, 5, 15, -6, -5, -9, -10, -8, -10, -14, -8, 0, 0, 0, 1, -2, -4, -1, -4],
  "sicilian-closed-nge2": [43, 31, 42, 38, 41, 5, 28, 17, 21, 22, 21, -13, -8, -11, 13, 8, 15, 11, 14, 12, 14, 14, 19],
  "sicilian-closed-dragon-transposition": [43, 31, 42, 38, 41, 36, 36, 41, 37, 42, 73, 70, 64, 67, 64, 54, 61, 66, 69, 67, 66],
};

export const sicilianPositionEvaluations: Record<string, number> = {};
