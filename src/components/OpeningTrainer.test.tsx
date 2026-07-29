import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChessboardOptions } from "react-chessboard";
import { openingById } from "@/data/openings";
import { chessFromHistory, createTrainingSession, sessionChoices, sessionTarget } from "@/lib/repertoire-engine";
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
  fireEvent.click(screen.getByRole("button", { name: /Catalan Opening.*You always play White/ }));
  fireEvent.click(screen.getByRole("button", { name: /^Closed Catalan/ }));
};

const chooseWhiteRepertoire = () => {
  render(<OpeningTrainer />);
  fireEvent.click(screen.getByRole("button", { name: /Catalan Opening.*You always play White/ }));
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

  it("offers exactly the Catalan, Sicilian and Grünfeld repertoires", () => {
    render(<OpeningTrainer />);

    expect(screen.getAllByRole("button").filter((button) => /You always play/.test(button.textContent ?? ""))).toHaveLength(3);
    expect(screen.getByRole("button", { name: /Catalan Opening.*You always play White/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sicilian Defence.*You always play Black/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Grünfeld Defence.*You always play Black/ })).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening.*You always play White/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Closed Catalan/ }));

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
    expect(screen.queryAllByText(/d4 is correct/)).toHaveLength(0);
    expect(screen.queryAllByText("Waiting").length).toBeGreaterThan(0);
  });

  it("publishes feedback, progress, evaluation and history once for the complete move pair", () => {
    vi.useFakeTimers();
    const { container } = render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening.*You always play White/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Closed Catalan/ }));

    const feedback = () => container.querySelector(".training-content .feedback")?.textContent;
    const progress = () => container.querySelector(".training-content .progress-copy strong")?.textContent;
    const evaluation = () => container.querySelector(".training-content .static-evaluation strong")?.textContent;
    const moveRows = () => container.querySelectorAll(".training-content .move-row").length;
    const feedbackBeforeMove = feedback();
    const progressBeforeMove = progress();
    const evaluationBeforeMove = evaluation();

    dragPiece("d2");
    expect(dropPiece("d2", "d4")).toBe(true);

    expect(feedback()).toBe(feedbackBeforeMove);
    expect(progress()).toBe(progressBeforeMove);
    expect(evaluation()).toBe(evaluationBeforeMove);
    expect(moveRows()).toBe(0);

    act(() => vi.advanceTimersByTime(700));

    expect(screen.queryAllByText(/Black plays d5/).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Find White's continuation/).length).toBeGreaterThan(0);
    expect(progress()).not.toBe(progressBeforeMove);
    expect(moveRows()).toBe(1);
    expect(container.querySelector(".training-content .move-list")?.textContent).toContain("d4");
    expect(container.querySelector(".training-content .move-list")?.textContent).toContain("d5");
  });

  it("starts a Black repertoire with one complete message and no automatic follow-up", () => {
    vi.useFakeTimers();
    const { container } = render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Sicilian Defence.*You always play Black/ }));
    fireEvent.click(screen.getByRole("button", { name: /Dragon · main line without Bc4/ }));

    const feedback = () => container.querySelector(".training-content .feedback")?.textContent;
    const progress = () => container.querySelector(".training-content .progress-copy strong")?.textContent;
    const history = () => container.querySelector(".training-content .move-list")?.textContent;
    const initialFeedback = feedback();
    const initialProgress = progress();
    const initialHistory = history();

    expect(initialFeedback).toContain("White plays e4");
    expect(initialFeedback).toContain("Find a theoretical continuation for Black.");
    expect(initialHistory).toContain("e4");

    act(() => vi.advanceTimersByTime(1_000));

    expect(feedback()).toBe(initialFeedback);
    expect(progress()).toBe(initialProgress);
    expect(history()).toBe(initialHistory);
  });

  it("links every published move to its exact Lichess editor position", () => {
    vi.useFakeTimers();
    const { container } = render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening.*You always play White/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Closed Catalan/ }));

    dragPiece("d2");
    expect(dropPiece("d2", "d4")).toBe(true);
    act(() => vi.advanceTimersByTime(700));

    const links = Array.from(container.querySelectorAll<HTMLAnchorElement>(".training-content .move-cell"));
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute(
      "href",
      "https://lichess.org/editor/rnbqkbnr/pppppppp/8/8/3P4/8/PPP1PPPP/RNBQKBNR_b_KQkq_-_0_1?color=white",
    );
    expect(links[1]).toHaveAttribute(
      "href",
      "https://lichess.org/editor/rnbqkbnr/ppp1pppp/8/3p4/3P4/8/PPP1PPPP/RNBQKBNR_w_KQkq_-_0_2?color=white",
    );
    expect(links.every((link) => link.target === "_blank" && link.rel === "noreferrer")).toBe(true);
  });

  it("orients Lichess history positions from the trained Black side", () => {
    render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Sicilian Defence.*You always play Black/ }));
    fireEvent.click(screen.getByRole("button", { name: /Dragon · main line without Bc4/ }));

    expect(screen.getByRole("link", { name: "Open the position after e4 in the Lichess board editor" })).toHaveAttribute(
      "href",
      "https://lichess.org/editor/rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR_b_KQkq_-_0_1?color=black",
    );
  });

  it("completes a live Catalan graph path and exports its PGN to Lichess", async () => {
    const opening = openingById("catalan");
    expect(opening).toBeDefined();
    const variant = opening?.variants.find((item) => item.id === "catalan-closed");
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
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening.*You always play White/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Closed Catalan/ }));

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

    const analysisLinks = screen.getAllByRole("link", { name: "Open in Lichess Analysis Board ↗" });
    const href = analysisLinks[0].getAttribute("href") ?? "";
    const encodedPgn = href
      .replace("https://lichess.org/analysis/pgn/", "")
      .replace(/\?color=white$/, "");
    const pgn = decodeURIComponent(encodedPgn);
    expect(pgn).toContain('[Event "CooMate opening training"]');
    expect(pgn).toContain('[Opening "Catalan Opening"]');
    expect(pgn).toContain('[Variation "Closed Catalan"]');
    const moveText = chessFromHistory(plannedHistory).pgn().split("\n\n").at(-1);
    expect(moveText).toBeDefined();
    expect(pgn.endsWith(moveText ?? "")).toBe(true);
    expect(analysisLinks[0]).toHaveAttribute(
      "href",
      `https://lichess.org/analysis/pgn/${encodeURIComponent(pgn)}?color=white`,
    );
    expect(analysisLinks[0]).toHaveAttribute("target", "_blank");
    expect(analysisLinks[0]).toHaveAttribute("rel", "noopener noreferrer");
  });
});
