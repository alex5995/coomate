// Static Stockfish 18 depth-18 scores in centipawns from White's perspective.
// Line arrays include the initial position, then one score after every move.
export const catalanEvaluations: Record<string, number[]> = {
  "catalan-indian-nf3": [43, 32, 39, 39, 41, 43, 36, 35],
  "catalan-open-modern-sharp": [
    40, 24, 37, 37, 36, 38, 40, 33, 35, 35, 34, 36, 29, 32, 26, 27, 30, 34, 31, 28, 29, 29, 29, 24, 24, 22, 21,
    23, 22, 20,
  ],
  "catalan-closed": [40, 24, 37, 37, 36, 38, 40, 33, 27, 29],
  "catalan-anti-nimzo": [40, 24, 29, 35, 36, 26, 59, 28, 26, 26],
  "catalan-marshall": [40, 24, 37, 37, 69, 62, 88, 103, 98, 31, 61, 59, 104, 85, 89, 77],
  "catalan-slav": [40, 24, 37, 37, 38, 40, 96, 52, 146, 44, 43, 31, 91, 67],
  "catalan-benoni": [40, 39, 77, 71, 89, 72, 79, 73, 78, 79, 77, 38, 34, 30, 43, 23, 40, 34],
  "catalan-budapest": [34, 34, 39, 41, 82, 79, 78, 49, 34, 35, 33, 39, 39, 41, 41, 38, 45, 43, 36, 36],
  "catalan-tarrasch": [40, 24, 37, 37, 36, 38, 40, 33, 40, 36, 46, 41, 40, 37, 38, 36, 42],
  "catalan-albin": [40, 24, 37, 37, 62, 83, 74, 70, 66, 79, 109, 111],
};

export const catalanPositionEvaluations: Record<string, number> = {};
