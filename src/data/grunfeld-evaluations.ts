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

export const grunfeldPositionEvaluations: Record<string, number> = {};
