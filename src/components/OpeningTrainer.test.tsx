import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChessboardOptions } from "react-chessboard";
import { openingById } from "@/data/openings";
import { createTrainingSession, sessionChoices, sessionTarget } from "@/lib/repertoire-engine";
import type { UciMove } from "@/lib/types";
import { OpeningTrainer } from "./OpeningTrainer";

const chessboardMock = vi.hoisted(() => ({ options: undefined as ChessboardOptions | undefined }));

vi.mock("react-chessboard", () => ({
  Chessboard: ({ options }: { options?: ChessboardOptions }) => {
    chessboardMock.options = options;
    return <div data-testid="chessboard" />;
  },
}));

const boardOptions = () => {
  expect(chessboardMock.options).toBeDefined();
  return chessboardMock.options as ChessboardOptions;
};

const startWhiteSession = () => {
  render(<OpeningTrainer />);
  fireEvent.click(screen.getByRole("button", { name: /London System.*You always play White/ }));
  fireEvent.click(screen.getByRole("button", { name: /Random variation/ }));
};

const chooseWhiteRepertoire = () => {
  render(<OpeningTrainer />);
  fireEvent.click(screen.getByRole("button", { name: /London System.*You always play White/ }));
};

const dragPiece = (square: string) => {
  act(() => boardOptions().onPieceDrag?.({
    isSparePiece: false,
    piece: { pieceType: "wP" },
    square,
  }));
};

const dropPiece = (sourceSquare: string, targetSquare: string | null) => {
  let accepted = false;
  act(() => {
    accepted = boardOptions().onPieceDrop?.({
      piece: { isSparePiece: false, position: sourceSquare, pieceType: "wP" },
      sourceSquare,
      targetSquare,
    }) ?? false;
  });
  return accepted;
};

describe("OpeningTrainer board interaction", () => {
  beforeEach(() => {
    chessboardMock.options = undefined;
    window.localStorage?.clear();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
      }),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    cleanup();
  });

  it("configures deliberate on-board dragging", () => {
    startWhiteSession();

    expect(boardOptions().allowDragOffBoard).toBe(false);
    expect(boardOptions().dragActivationDistance).toBe(8);
  });

  it("ignores board input until a variation is selected", () => {
    chooseWhiteRepertoire();

    act(() => boardOptions().onSquareClick?.({ piece: { pieceType: "wP" }, square: "d2" }));
    act(() => boardOptions().onSquareClick?.({ piece: null, square: "d4" }));

    expect(boardOptions().squareStyles).not.toHaveProperty("d2");
    expect(screen.queryAllByText("Not quite - try again")).toHaveLength(0);
    expect(screen.queryAllByText("Illegal move")).toHaveLength(0);
  });

  it("offers the Nimzo-Larsen System as separate White and Black repertoires", () => {
    render(<OpeningTrainer />);

    fireEvent.click(screen.getByRole("button", { name: /Nimzo.*Larsen System - White.*You always play White/ }));
    expect(screen.getByRole("heading", { name: /Choose a variation · Nimzo.*Larsen White/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Classical · …d5 and …Nc6/ })).toBeInTheDocument();
    expect(screen.getByLabelText("Chessboard oriented from White's side")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "← Change repertoire" }));
    fireEvent.click(screen.getByRole("button", { name: /Nimzo.*Larsen System - Black.*You always play Black/ }));
    expect(screen.getByRole("heading", { name: /Choose a variation · Nimzo.*Larsen Black/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /1.d4 · Queen's Gambit/ })).toBeInTheDocument();
    expect(screen.getByLabelText("Chessboard oriented from Black's side")).toBeInTheDocument();
  });

  it("starts the White Nimzo-Larsen exercise with 1.b3", () => {
    render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Nimzo.*Larsen System - White.*You always play White/ }));
    fireEvent.click(screen.getByRole("button", { name: /Classical · …d5 and …Nc6/ }));

    expect(screen.getByText("Your move: play b3.")).toBeInTheDocument();
    expect(screen.queryAllByLabelText("Static evaluation +0.37 pawns for your side").length).toBeGreaterThan(0);
    dragPiece("b2");
    expect(dropPiece("b2", "b3")).toBe(true);
    expect(screen.queryAllByText(/b3 is correct/).length).toBeGreaterThan(0);
    expect(screen.queryAllByLabelText("Static evaluation -0.23 pawns for your side").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Evaluation after b3: -0.23")).toBeInTheDocument();
  });

  it("selects and deselects a piece with successive taps", () => {
    startWhiteSession();

    act(() => boardOptions().onSquareClick?.({ piece: { pieceType: "wP" }, square: "d2" }));
    expect(boardOptions().squareStyles).toHaveProperty("d2");

    act(() => boardOptions().onSquareClick?.({ piece: { pieceType: "wP" }, square: "d2" }));
    expect(boardOptions().squareStyles).not.toHaveProperty("d2");
  });

  it("turns touch-style same-square drops into selection without an error", () => {
    startWhiteSession();

    dragPiece("d2");
    expect(dropPiece("d2", "d2")).toBe(false);
    expect(boardOptions().squareStyles).toHaveProperty("d2");
    expect(screen.queryAllByText("Illegal move")).toHaveLength(0);

    dragPiece("d2");
    expect(dropPiece("d2", "d2")).toBe(false);
    expect(boardOptions().squareStyles).not.toHaveProperty("d2");
    expect(screen.queryAllByText("Illegal move")).toHaveLength(0);
  });

  it("deselects with a stale drag-start callback retained by the board", () => {
    render(<OpeningTrainer />);
    const retainedDragStart = boardOptions().onPieceDrag;
    fireEvent.click(screen.getByRole("button", { name: /London System.*You always play White/ }));
    fireEvent.click(screen.getByRole("button", { name: /Random variation/ }));

    act(() => boardOptions().onSquareClick?.({ piece: { pieceType: "wP" }, square: "e2" }));
    act(() => retainedDragStart?.({
      isSparePiece: false,
      piece: { pieceType: "wP" },
      square: "e2",
    }));
    expect(dropPiece("e2", "e2")).toBe(false);
    act(() => boardOptions().onSquareClick?.({ piece: { pieceType: "wP" }, square: "e2" }));

    expect(boardOptions().squareStyles).not.toHaveProperty("e2");
    expect(screen.queryAllByText("Illegal move")).toHaveLength(0);
  });

  it("cancels an off-board drop without changing feedback or position", () => {
    startWhiteSession();
    const initialPosition = boardOptions().position;

    dragPiece("d2");
    expect(dropPiece("d2", null)).toBe(false);

    expect(boardOptions().position).toBe(initialPosition);
    expect(boardOptions().squareStyles).not.toHaveProperty("d2");
    expect(screen.queryAllByText("Illegal move")).toHaveLength(0);
    expect(screen.queryAllByText("Not quite - try again")).toHaveLength(0);
  });

  it("restores the pre-drag selection after a touch cancellation", () => {
    startWhiteSession();
    act(() => boardOptions().onSquareClick?.({ piece: { pieceType: "wP" }, square: "c2" }));

    dragPiece("d2");
    fireEvent.touchCancel(screen.getByLabelText("Chessboard oriented from White's side"));

    expect(boardOptions().squareStyles).toHaveProperty("c2");
    expect(boardOptions().squareStyles).not.toHaveProperty("d2");
    expect(screen.queryAllByText("Illegal move")).toHaveLength(0);
  });

  it("restores the pre-drag selection after keyboard cancellation", () => {
    startWhiteSession();
    act(() => boardOptions().onSquareClick?.({ piece: { pieceType: "wP" }, square: "c2" }));

    dragPiece("d2");
    fireEvent.keyDown(screen.getByLabelText("Chessboard oriented from White's side"), { key: "Escape" });

    expect(boardOptions().squareStyles).toHaveProperty("c2");
    expect(boardOptions().squareStyles).not.toHaveProperty("d2");
    expect(screen.queryAllByText("Illegal move")).toHaveLength(0);
  });

  it("keeps the source selected after a legal move outside the repertoire", () => {
    startWhiteSession();
    const initialPosition = boardOptions().position;

    dragPiece("e2");
    expect(dropPiece("e2", "e4")).toBe(false);
    act(() => boardOptions().onSquareClick?.({ piece: null, square: "e4" }));

    expect(boardOptions().position).toBe(initialPosition);
    expect(boardOptions().squareStyles).toHaveProperty("e2");
    expect(screen.queryAllByText("Not quite - try again").length).toBeGreaterThan(0);
    expect(screen.queryAllByText("Here are the continuations")).toHaveLength(0);
  });

  it("keeps the source selected after an illegal drop", () => {
    startWhiteSession();
    const initialPosition = boardOptions().position;

    dragPiece("e2");
    expect(dropPiece("e2", "e5")).toBe(false);

    expect(boardOptions().position).toBe(initialPosition);
    expect(boardOptions().squareStyles).toHaveProperty("e2");
    expect(screen.queryAllByText("Illegal move").length).toBeGreaterThan(0);
  });

  it("accepts a correct drag and clears the selection", () => {
    startWhiteSession();
    const initialPosition = boardOptions().position;

    dragPiece("d2");
    expect(dropPiece("d2", "d4")).toBe(true);

    expect(boardOptions().position).not.toBe(initialPosition);
    expect(boardOptions().squareStyles?.d2).toEqual({ background: "rgba(255, 178, 122, .46)" });
    expect(screen.queryAllByText(/d4 is correct/).length).toBeGreaterThan(0);
  });

  it("accepts the alternate London move order while Black follows the selected variation", () => {
    vi.useFakeTimers();
    render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /London System.*You always play White/ }));
    fireEvent.click(screen.getByRole("button", { name: /Classical · …e6 and …Bd6/ }));

    dragPiece("d2");
    expect(dropPiece("d2", "d4")).toBe(true);
    act(() => vi.advanceTimersByTime(700));
    expect(screen.queryAllByText(/Black plays d5/).length).toBeGreaterThan(0);

    dragPiece("c1");
    expect(dropPiece("c1", "f4")).toBe(true);
    act(() => vi.advanceTimersByTime(700));
    expect(screen.queryAllByText(/Black plays Nf6/).length).toBeGreaterThan(0);

    dragPiece("g1");
    expect(dropPiece("g1", "f3")).toBe(true);
    expect(screen.queryAllByText(/Nf3 is correct/).length).toBeGreaterThan(0);
  });

  it("completes a live London graph path and shows its target", () => {
    const opening = openingById("london-system");
    expect(opening).toBeDefined();
    const variant = opening?.variants.find((item) => item.id === "london-classical");
    const opponentLines = opening?.lines.filter((line) => line.family === variant?.family) ?? [];
    const session = createTrainingSession(opening?.lines ?? [], opponentLines, "w", opening?.moveOrderMoves ?? []);
    const plannedHistory: UciMove[] = [];
    while (!sessionTarget(session, plannedHistory)) {
      const choice = sessionChoices(session, plannedHistory)[0];
      expect(choice, `path stopped after ${plannedHistory.join(" ")}`).toBeDefined();
      plannedHistory.push(choice.uci);
      expect(plannedHistory.length).toBeLessThan(60);
    }

    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /London System.*You always play White/ }));
    fireEvent.click(screen.getByRole("button", { name: /Classical · …e6 and …Bd6/ }));

    plannedHistory.forEach((move, index) => {
      if (index % 2 === 0) {
        dragPiece(move.slice(0, 2));
        expect(dropPiece(move.slice(0, 2), move.slice(2, 4)), move).toBe(true);
      } else {
        act(() => vi.advanceTimersByTime(700));
      }
    });
    act(() => vi.runOnlyPendingTimers());

    expect(screen.queryAllByText("Target position reached").length).toBeGreaterThan(0);
    expect(screen.queryAllByRole("button", { name: /New exercise/ }).length).toBeGreaterThan(0);
  });
});
