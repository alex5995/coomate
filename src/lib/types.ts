export type UciMove = `${string}${string}`;

export interface RepertoireLine {
  id: string;
  name: string;
  family: "Advance" | "Classical" | "Exchange" | "Panov" | "Fantasy" | "Two Knights";
  weight: number;
  moves: UciMove[];
  goal: {
    title: string;
    plans: string[];
  };
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
