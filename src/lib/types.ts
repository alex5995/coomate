export type UciMove = `${string}${string}`;
export type PlayerColor = "w" | "b";
export type OpeningId = "caro-kann" | "jobava-london";

export interface RepertoireLine {
  id: string;
  name: string;
  family: string;
  weight: number;
  moves: UciMove[];
  goal: {
    title: string;
    plans: string[];
  };
}

export interface TrainerVariant {
  id: string;
  family: string;
  lineIds?: string[];
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
  playerColor: PlayerColor;
  lines: RepertoireLine[];
  variants: TrainerVariant[];
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
  candidateIds: string[];
  alternatives: UciMove[];
}
