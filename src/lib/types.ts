export type UciMove = `${string}${string}`;
export type PlayerColor = "w" | "b";
export type OpeningId =
  | "catalan"
  | "sicilian"
  | "grunfeld"
  | "caro-kann"
  | "london-system"
  | "slav-universal"
  | "nimzo-larsen-white"
  | "nimzo-larsen-black";

export interface RepertoireLine {
  id: string;
  name: string;
  family: string;
  weight: number;
  moves: UciMove[];
  evaluations?: number[];
  goal: {
    title: string;
    plans: string[];
  };
}

export interface StaticEvaluationMeta {
  engine: string;
  depth: number;
  threshold: number;
}

export interface TrainerVariant {
  id: string;
  family: string;
  opponentLineIds?: string[];
  label: string;
  moves: string;
  description: string;
  probability: number;
}

export interface OpeningRepertoire {
  id: OpeningId;
  name: string;
  shortName: string;
  description: string;
  startMessage: string;
  playerColor: PlayerColor;
  lines: RepertoireLine[];
  variants: TrainerVariant[];
  moveOrderMoves: UciMove[];
  evaluation?: StaticEvaluationMeta;
  positionEvaluations?: Record<string, number>;
  guidanceFor: (moves: UciMove[]) => { hint: string; explanation: string };
}

export interface MoveChoice {
  uci: UciMove;
  weight: number;
  lineIds: string[];
}

export interface TrainerStats {
  version: 1;
  sessions: number;
  completed: number;
  positionsSeen: number;
  correctMoves: number;
  errors: number;
  linesSeen: Record<string, number>;
}

export interface Feedback {
  kind: "info" | "success" | "hint" | "error";
  title: string;
  message: string;
}

export interface TakebackSnapshot {
  history: UciMove[];
  alternatives: UciMove[];
}
