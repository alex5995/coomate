import { describe, expect, it } from "vitest";
import { emptyStats, LEGACY_STORAGE_KEY, loadStats, saveStats, STORAGE_KEY } from "./storage";

describe("local statistics", () => {
  it("uses initial values when data is missing or corrupted", () => {
    expect(loadStats({ getItem: () => null })).toEqual(emptyStats());
    expect(loadStats({ getItem: () => "not-json" })).toEqual(emptyStats());
    expect(loadStats({ getItem: () => JSON.stringify({ version: 99 }) })).toEqual(emptyStats());
  });

  it("safely fills a partial v1 schema", () => {
    const loaded = loadStats({ getItem: () => JSON.stringify({ version: 1, completed: 4 }) });
    expect(loaded.completed).toBe(4);
    expect(loaded.errors).toBe(0);
    expect(loaded.linesSeen).toEqual({});
  });

  it("migrates statistics from the previous Caro Lab storage key", () => {
    const loaded = loadStats({ getItem: (key) => key === LEGACY_STORAGE_KEY ? JSON.stringify({ version: 1, completed: 7 }) : null });
    expect(loaded.completed).toBe(7);
  });

  it("saves the versioned schema", () => {
    const values = new Map<string, string>();
    saveStats({
      ...emptyStats(),
      completed: 2,
    }, { setItem: (key, value) => values.set(key, value) });
    const saved = JSON.parse(values.get(STORAGE_KEY) ?? "{}");
    expect(saved.version).toBe(1);
    expect(saved.completed).toBe(2);
    expect(saved).not.toHaveProperty("exams");
  });
});
