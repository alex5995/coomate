import { describe, expect, it } from "vitest";
import { emptyStats, LEGACY_STORAGE_KEY, loadStats, saveStats, STORAGE_KEY } from "./storage";

describe("statistiche locali", () => {
  it("usa valori iniziali con dati mancanti o corrotti", () => {
    expect(loadStats({ getItem: () => null })).toEqual(emptyStats());
    expect(loadStats({ getItem: () => "non-json" })).toEqual(emptyStats());
    expect(loadStats({ getItem: () => JSON.stringify({ version: 99 }) })).toEqual(emptyStats());
  });

  it("completa in sicurezza uno schema v1 parziale", () => {
    const loaded = loadStats({ getItem: () => JSON.stringify({ version: 1, completed: 4 }) });
    expect(loaded.completed).toBe(4);
    expect(loaded.errors).toBe(0);
    expect(loaded.linesSeen).toEqual({});
  });

  it("migra in lettura le statistiche del precedente Caro Lab", () => {
    const loaded = loadStats({ getItem: (key) => key === LEGACY_STORAGE_KEY ? JSON.stringify({ version: 1, completed: 7 }) : null });
    expect(loaded.completed).toBe(7);
  });

  it("salva lo schema versionato", () => {
    const values = new Map<string, string>();
    saveStats({ ...emptyStats(), completed: 2 }, { setItem: (key, value) => values.set(key, value) });
    expect(JSON.parse(values.get(STORAGE_KEY) ?? "{}").completed).toBe(2);
  });
});
