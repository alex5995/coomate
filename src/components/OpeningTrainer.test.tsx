import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { ChessboardOptions } from "react-chessboard";
import { openingById } from "@/data/openings";
import { shuffleExamVariants } from "@/lib/exam";
import { chessFromHistory, createTrainingSession, sessionChoices, sessionTarget } from "@/lib/repertoire-engine";
import { STORAGE_KEY } from "@/lib/storage";
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
  fireEvent.click(screen.getByRole("button", { name: /Catalan Opening/ }));
  fireEvent.click(screen.getByRole("button", { name: /^Closed Catalan/ }));
};

const chooseWhiteRepertoire = () => {
  render(<OpeningTrainer />);
  fireEvent.click(screen.getByRole("button", { name: /Catalan Opening/ }));
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

    expect(screen.getByRole("button", { name: /Catalan Opening/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Sicilian Defence/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Grünfeld Defence/ })).toBeInTheDocument();
    expect(screen.queryByText(/You always play/)).not.toBeInTheDocument();
  });

  it("shows no accuracy before any training attempt", () => {
    render(<OpeningTrainer />);

    const progress = screen.getByRole("heading", { name: "Your progress" }).closest("section");
    expect(progress).not.toBeNull();
    expect(within(progress!).getByText("-")).toBeInTheDocument();
    expect(within(progress!).queryByText("100%")).not.toBeInTheDocument();
  });

  it("keeps the evaluation copy concise", () => {
    startWhiteSession();

    expect(screen.getAllByText("EVALUATION").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Stockfish 18 · depth 18").length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/White's perspective|positive favors/i)).toHaveLength(0);
  });

  it("keeps the exam and random launch cards title-only", () => {
    chooseWhiteRepertoire();

    expect(screen.getByRole("button", { name: "Repertoire Exam" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Random variation" })).toBeInTheDocument();
    expect(screen.queryByText("Play every line once in a random order.")).not.toBeInTheDocument();
    expect(screen.queryByText("Every variation has the same chance")).not.toBeInTheDocument();
    expect(screen.queryByText(/completed · best/)).not.toBeInTheDocument();
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
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening/ }));
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
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening/ }));
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
    expect(screen.queryAllByText(/Find White's next move/).length).toBeGreaterThan(0);
    expect(progress()).not.toBe(progressBeforeMove);
    expect(moveRows()).toBe(1);
    expect(container.querySelector(".training-content .move-list")?.textContent).toContain("d4");
    expect(container.querySelector(".training-content .move-list")?.textContent).toContain("d5");
  });

  it("starts a Black repertoire with one complete message and no automatic follow-up", () => {
    vi.useFakeTimers();
    const { container } = render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Sicilian Defence/ }));
    fireEvent.click(screen.getByRole("button", { name: /Dragon · main line without Bc4/ }));

    const feedback = () => container.querySelector(".training-content .feedback")?.textContent;
    const progress = () => container.querySelector(".training-content .progress-copy strong")?.textContent;
    const history = () => container.querySelector(".training-content .move-list")?.textContent;
    const initialFeedback = feedback();
    const initialProgress = progress();
    const initialHistory = history();

    expect(initialFeedback).toContain("White plays e4");
    expect(initialFeedback).toContain("Find Black's next move.");
    expect(initialHistory).toContain("e4");

    act(() => vi.advanceTimersByTime(1_000));

    expect(feedback()).toBe(initialFeedback);
    expect(progress()).toBe(initialProgress);
    expect(history()).toBe(initialHistory);
  });

  it("starts an ephemeral exam with the variation and first hint hidden", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening/ }));
    fireEvent.click(screen.getByRole("button", { name: "Repertoire Exam" }));

    expect(screen.getByRole("heading", { name: "Line 1 of 10" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Your progress" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Open Catalan · Modern Sharp" })).not.toBeInTheDocument();
    expect(screen.queryAllByText(/hidden/i)).toHaveLength(0);

    dragPiece("e2");
    expect(dropPiece("e2", "e4")).toBe(false);
    expect(screen.getAllByText("Try again").length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/hint yet/i)).toHaveLength(0);
    expect(screen.queryAllByText("Need a hint?")).toHaveLength(0);

    dragPiece("e2");
    expect(dropPiece("e2", "e4")).toBe(false);
    expect(screen.getAllByText("Try this move: d4.").length).toBeGreaterThan(0);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Exit exam" }));
    expect(confirm).toHaveBeenCalledWith("Exit the exam? Your current progress will be lost.");
    expect(screen.getByRole("heading", { name: "Line 1 of 10" })).toBeInTheDocument();

    confirm.mockReturnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "Exit exam" }));
    expect(screen.getByRole("heading", { name: /Choose a variation/ })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Your progress" })).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("starts a Black repertoire exam with White's first move but no opening hint", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Sicilian Defence/ }));
    fireEvent.click(screen.getByRole("button", { name: "Repertoire Exam" }));

    expect(screen.getByRole("heading", { name: "Line 1 of 11" })).toBeInTheDocument();
    expect(screen.getAllByText("White plays e4").length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/Answer with 1\.\.\.c5/)).toHaveLength(0);
    expect(screen.queryByRole("heading", { name: /Alapin|Dragon|Smith-Morra|Closed|Moscow|Bowdler/ })).not.toBeInTheDocument();
    expect(boardOptions().boardOrientation).toBe("black");
  });

  it("runs every Catalan exam variation once, reveals completed lines, and keeps results ephemeral", () => {
    const opening = openingById("catalan");
    expect(opening).toBeDefined();
    const queue = shuffleExamVariants(opening?.variants.map((variant) => variant.id) ?? [], () => 0);

    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening/ }));
    fireEvent.click(screen.getByRole("button", { name: "Repertoire Exam" }));

    queue.forEach((variantId, queueIndex) => {
      const variant = opening?.variants.find((candidate) => candidate.id === variantId);
      expect(variant).toBeDefined();
      const opponentLines = opening?.lines.filter((line) =>
        variant?.opponentLineIds?.includes(line.id) ?? line.family === variant?.family,
      ) ?? [];
      const session = createTrainingSession(
        opening?.lines ?? [],
        opponentLines,
        "w",
        opening?.moveOrderMoves ?? [],
        opening?.positionEvaluations,
      );
      const plannedHistory: UciMove[] = [];
      while (!sessionTarget(session, plannedHistory)) {
        const choice = sessionChoices(session, plannedHistory)[0];
        expect(choice, `${variantId} stopped after ${plannedHistory.join(" ")}`).toBeDefined();
        plannedHistory.push(choice.uci);
      }

      if (queueIndex === 0) {
        dragPiece("e2");
        expect(dropPiece("e2", "e4")).toBe(false);
      }
      plannedHistory.forEach((move, moveIndex) => {
        if (moveIndex % 2 === 0) {
          dragPiece(move.slice(0, 2));
          expect(dropPiece(move.slice(0, 2), move.slice(2, 4)), move).toBe(true);
        } else {
          act(() => vi.advanceTimersByTime(700));
        }
      });
      act(() => vi.runOnlyPendingTimers());

      expect(screen.getAllByText(new RegExp(variant?.label ?? "")).length).toBeGreaterThan(0);
      if (queueIndex < queue.length - 1) {
        expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
        fireEvent.click(screen.getAllByRole("button", { name: /Next line/ })[0]);
        expect(screen.getByRole("heading", { name: `Line ${queueIndex + 2} of ${queue.length}` })).toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: variant?.label ?? "" })).not.toBeInTheDocument();
      }
    });

    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();

    fireEvent.click(screen.getAllByRole("button", { name: /See exam results/ })[0]);
    expect(screen.getAllByText("Catalan exam complete").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Practise these lines").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Perfect lines").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Accuracy").length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/First try|Correct first time/)).toHaveLength(0);

    fireEvent.click(screen.getAllByRole("button", { name: /Practise missed lines/ })[0]);
    expect(screen.getByRole("heading", { name: "Practice line 1 of 1" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Your progress" })).not.toBeInTheDocument();
    expect(screen.getAllByText("FOCUSED PRACTICE").length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/hidden/i)).toHaveLength(0);
    expect(screen.queryAllByText("REPERTOIRE EXAM")).toHaveLength(0);

    const confirm = vi.spyOn(window, "confirm").mockReturnValue(true);
    fireEvent.click(screen.getByRole("button", { name: "Stop practice" }));
    expect(confirm).toHaveBeenCalledWith("Stop this practice? Your current progress will be lost.");
  });

  it("links every published move to its exact Lichess editor position", () => {
    vi.useFakeTimers();
    const { container } = render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening/ }));
    fireEvent.click(screen.getByRole("button", { name: /^Closed Catalan/ }));

    dragPiece("d2");
    expect(dropPiece("d2", "d4")).toBe(true);
    act(() => vi.advanceTimersByTime(700));

    expect(screen.queryAllByText(/^\d+ moves?$/)).toHaveLength(0);

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
    fireEvent.click(screen.getByRole("button", { name: /Sicilian Defence/ }));
    fireEvent.click(screen.getByRole("button", { name: /Dragon · main line without Bc4/ }));

    expect(screen.getByRole("link", { name: "Open the position after e4 in the Lichess board editor" })).toHaveAttribute(
      "href",
      "https://lichess.org/editor/rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR_b_KQkq_-_0_1?color=black",
    );
  });

  it("offers the intentional Alapin ending alternative and restores the exact choice position", () => {
    const opening = openingById("sicilian");
    const line = opening?.lines.find((candidate) => candidate.id === "sicilian-alapin-bishop-exchange");
    expect(line).toBeDefined();
    const beforeChoice = line?.moves.slice(0, 39) ?? [];

    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0);
    render(<OpeningTrainer />);
    fireEvent.click(screen.getByRole("button", { name: /Sicilian Defence/ }));
    fireEvent.click(screen.getByRole("button", { name: /Alapin · Bxd5 exchange/ }));

    beforeChoice.slice(1).forEach((move, index) => {
      const ply = index + 1;
      if (ply % 2 === 1) {
        dragPiece(move.slice(0, 2));
        expect(dropPiece(move.slice(0, 2), move.slice(2, 4)), move).toBe(true);
      } else {
        act(() => vi.advanceTimersByTime(700));
      }
    });

    const choicePosition = boardOptions().position;
    dragPiece("d6");
    expect(dropPiece("d6", "c7")).toBe(true);
    act(() => vi.advanceTimersByTime(700));
    expect(screen.queryAllByRole("button", { name: /Go back and try an alternative/ }).length).toBeGreaterThan(0);

    fireEvent.click(screen.getAllByRole("button", { name: /Go back and try an alternative/ })[0]);
    expect(boardOptions().position).toBe(choicePosition);

    dragPiece("d6");
    expect(dropPiece("d6", "a3")).toBe(true);
    act(() => vi.advanceTimersByTime(700));
    expect(screen.queryAllByRole("button", { name: /Go back and try an alternative/ }).length).toBeGreaterThan(0);
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
    fireEvent.click(screen.getByRole("button", { name: /Catalan Opening/ }));
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
