// Static Stockfish 18 depth-18 scores in centipawns from White's perspective.
// Line arrays include the initial position, then one score after every move.
export const sicilianEvaluations: Record<string, number[]> = {
  "sicilian-dragon-main": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 68, 64, 66, 64, 62, 65, 66, 66, 65, 63],
  "sicilian-dragon-yugoslav": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 68, 64, 66, 64, 62, 65, 49, 64, 64, 57],
  "sicilian-dragon-classical": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 30, 35, 26, 29, 28, 28, -3, 23],
  "sicilian-moscow": [38, 39, 54, 50, 28, 17, 13, 19, 32, 28, 23, 25, 35, 25, 36, 25, 20, 15, 40, 43, 44, 47, 45],
  "sicilian-smith-morra": [38, 39, 54, 21, 14, -30, -24, -22, -21, -20, -24, -23, -25, -20, -23, -46, -43, -77, -61, -159, -160, -174, -190, -187, -194, -188, -193],
  "sicilian-bowdler": [38, 39, 54, -5, -13, -22, -15, -11, -14, -12, -1, 2, 8, -36, -33, -44, -35],
  "sicilian-alapin-central": [37, 36, 33, 22, 20, 19, 19, 21, 25, 25, 26, 23, 21, 22, 18, 24, 31, 30, 21, 26, 27, 24, 21, 18, 16, 1, -3],
  "sicilian-alapin-bishop-exchange": [37, 36, 33, 22, 20, 19, 19, 21, 25, 25, 26, 23, 21, 22, 18, -12, -6, -2, 1, 7, -8, -15, -11, -15, -21],
  "sicilian-closed-f4": [37, 36, 33, 36, 36, -13, -14, -14, -16, -12, -5, -32, -32, -34, -33, -37, -33, -32, -32, -38, -38],
  "sicilian-closed-nge2": [37, 36, 33, 36, 36, -13, -14, -14, -16, -12, -5, -1, -8, -19, -15, -14, -13, -12, -18, -14, -10, -5, 0, 0, 0],
  "sicilian-closed-dragon-transposition": [37, 36, 33, 36, 36, 31, 40, 52, 48, 44, 71, 59, 59, 57, 60, 69, 67, 72, 71, 63, 70],
};

export const sicilianPositionEvaluations: Record<string, number> = {};
