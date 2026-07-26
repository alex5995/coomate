// Static Stockfish 18 depth-18 scores in centipawns from White's perspective.
// Line arrays include the initial position, then one score after every move.
export const sicilianEvaluations: Record<string, number[]> = {
  "sicilian-dragon-main": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 68, 64, 66, 64, 62, 65, 66, 66, 65, 63],
  "sicilian-dragon-yugoslav": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 68, 64, 66, 64, 62, 65, 49, 64, 64, 57],
  "sicilian-dragon-classical": [40, 36, 40, 41, 33, 41, 45, 45, 33, 35, 66, 30, 35, 26, 29, 28, 28, -3, 23],
  "sicilian-alapin": [40, 36, 40, 20, 18, 15, 19, 17, 19, 25, 18],
  "sicilian-closed": [40, 36, 40, 31, 36],
};

export const sicilianPositionEvaluations: Record<string, number> = {};
