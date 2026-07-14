import type { TrainerStats } from "@/lib/types";

export const STORAGE_KEY = "opening-lab:stats";
export const LEGACY_STORAGE_KEY = "caro-lab:stats";

export const emptyStats = (): TrainerStats => ({
  version: 1,
  sessions: 0,
  completed: 0,
  positionsSeen: 0,
  correctMoves: 0,
  errors: 0,
  linesSeen: {},
});

export const loadStats = (storage?: Pick<Storage, "getItem">): TrainerStats => {
  if (!storage) return emptyStats();
  try {
    const raw = storage.getItem(STORAGE_KEY) ?? storage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return emptyStats();
    const parsed = JSON.parse(raw) as Partial<TrainerStats>;
    if (parsed.version !== 1) return emptyStats();
    return { ...emptyStats(), ...parsed, linesSeen: parsed.linesSeen ?? {} };
  } catch {
    return emptyStats();
  }
};

export const saveStats = (stats: TrainerStats, storage?: Pick<Storage, "setItem">) => {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // The trainer remains usable when storage is unavailable.
  }
};
