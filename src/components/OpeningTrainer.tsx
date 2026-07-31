"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";
import { openingById, openings, pickUniformVariant } from "@/data/openings";
import { trainingGoalFor } from "@/data/training-goals";
import { examLineStatus, revealedMovesPrompt, shuffleExamVariants, summarizeExam } from "@/lib/exam";
import { chessFromHistory, createTrainingSession, sanFor, sessionChoices, sessionTarget, staticEvaluationFor, weightedChoice } from "@/lib/repertoire-engine";
import { emptyStats, loadStats, saveStats } from "@/lib/storage";
import type { ExamLineResult, Feedback, OpeningId, OpeningRepertoire, StaticEvaluationMeta, TakebackSnapshot, TrainerStats, UciMove } from "@/lib/types";
import { Logo } from "./Logo";

interface ActiveExam {
  variantIds: string[];
  index: number;
  results: ExamLineResult[];
  currentErrors: number;
  currentCorrectMoves: number;
  currentFirstTryMoves: number;
  currentRevealed: boolean;
  resultsVisible: boolean;
  isPractice: boolean;
}

const defaultFeedback = (opening: OpeningRepertoire | null): Feedback => {
  if (opening) {
    return {
      kind: "info",
      title: opening.playerColor === "w" ? "Your move" : "Get ready",
      message: opening.startMessage,
    };
  }
  return { kind: "info", title: "Choose a repertoire", message: "Pick the opening you want to train." };
};

const colorName = (color: "w" | "b") => color === "w" ? "White" : "Black";
const keepCompoundWordsTogether = (text: string) => text.replace(/(?<=\p{L})-(?=\p{L})/gu, "\u2060-\u2060");
const formatEvaluation = (centipawns: number) => {
  const pawns = centipawns / 100;
  return `${pawns >= 0 ? "+" : ""}${pawns.toFixed(2)}`;
};

const StaticEvaluation = ({ centipawns, meta }: { centipawns: number; meta: StaticEvaluationMeta }) => {
  const formatted = formatEvaluation(centipawns);
  return (
    <div className="static-evaluation" aria-label={`Static evaluation ${formatted} pawns from White's perspective`}>
      <span>EVALUATION</span>
      <strong>{formatted}</strong>
      <small>{meta.engine} · depth {meta.depth}</small>
    </div>
  );
};

const lichessEditorUrl = (fen: string, playerColor: "w" | "b") =>
  `https://lichess.org/editor/${fen.replaceAll(" ", "_")}?color=${playerColor === "w" ? "white" : "black"}`;

const lichessPgnAnalysisUrl = (pgn: string, playerColor: "w" | "b") =>
  `https://lichess.org/analysis/pgn/${encodeURIComponent(pgn)}?color=${playerColor === "w" ? "white" : "black"}`;

const trainingPgn = (
  history: UciMove[],
  opening: OpeningRepertoire,
  variation: string,
) => {
  const exportGame = chessFromHistory(history);
  const headers = {
    Event: "CooMate opening training",
    Site: "CooMate",
    Date: new Date().toISOString().slice(0, 10).replaceAll("-", "."),
    Round: "-",
    White: opening.playerColor === "w" ? "You" : "Computer",
    Black: opening.playerColor === "b" ? "You" : "Computer",
    Result: "*",
    Opening: opening.name,
    Variation: variation,
  };
  Object.entries(headers).forEach(([key, value]) => exportGame.setHeader(key, value));
  return exportGame.pgn();
};

const CompletionActions = ({
  analysisUrl,
  onNewExercise,
  primaryLabel = "New exercise",
}: {
  analysisUrl: string;
  onNewExercise: () => void;
  primaryLabel?: string;
}) => (
  <div className="goal-actions">
    <a
      className="analysis-action"
      href={analysisUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      Open in Lichess Analysis Board <span>↗</span>
    </a>
    <button className="primary-action" onClick={onNewExercise}>{primaryLabel} <span>→</span></button>
  </div>
);

const examStatusLabel = {
  mastered: "Perfect",
  passed: "Completed",
  review: "Needs practice",
} as const;

const ExamResults = ({
  exam,
  opening,
  onRetry,
  onRestart,
  onExit,
}: {
  exam: ActiveExam;
  opening: OpeningRepertoire;
  onRetry: () => void;
  onRestart: () => void;
  onExit: () => void;
}) => {
  const summary = summarizeExam(exam.results);
  const resultsToPractise = exam.results.filter((result) => result.status !== "mastered");
  return (
    <section className="exam-results" aria-label={exam.isPractice ? "Practice results" : "Exam results"}>
      <span className="eyebrow">{exam.isPractice ? "PRACTICE COMPLETE" : "EXAM COMPLETE"}</span>
      <h2>{exam.isPractice ? "Focused practice complete" : `${opening.shortName} exam complete`}</h2>
      <div className="exam-score-grid">
        <div><strong>{summary.mastered}/{exam.results.length}</strong><span>Perfect lines</span></div>
        <div><strong>{summary.accuracy}%</strong><span>Accuracy</span></div>
        <div><strong>{summary.errors}</strong><span>Mistakes</span></div>
      </div>
      {resultsToPractise.length ? (
        <div className="exam-practice-list">
          <h3>{exam.isPractice ? "Try these again" : "Practise these lines"}</h3>
          {resultsToPractise.map((result) => {
            const label = opening.variants.find((variant) => variant.id === result.variantId)?.label ?? result.variantId;
            return (
              <div key={result.variantId}>
                <span>{keepCompoundWordsTogether(label)}</span>
                <b className={`exam-status ${result.status}`}>{examStatusLabel[result.status]}</b>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="exam-perfect">Perfect score.</div>
      )}
      <div className="exam-result-actions">
        {resultsToPractise.length > 0 && (
          <button className="primary-action" onClick={onRetry}>
            {exam.isPractice ? "Practise these again" : "Practise missed lines"} <span>→</span>
          </button>
        )}
        <button className={resultsToPractise.length ? "secondary-action" : "primary-action"} onClick={onRestart}>Start a new exam <span>↻</span></button>
        <button className="text-action" onClick={onExit}>Back to variations</button>
      </div>
    </section>
  );
};

const MoveCell = ({
  san,
  evaluation,
  fen,
  playerColor,
}: {
  san: string;
  evaluation?: number | null;
  fen?: string;
  playerColor: "w" | "b";
}) => fen ? (
  <a
    className="move-cell"
    href={lichessEditorUrl(fen, playerColor)}
    target="_blank"
    rel="noreferrer"
    aria-label={`Open the position after ${san} in the Lichess board editor`}
    title="Open this position in the Lichess board editor"
  >
    <span>{san}</span>
    {evaluation !== null && evaluation !== undefined && (
      <small aria-label={`Evaluation after ${san}: ${formatEvaluation(evaluation)}`}>
        {formatEvaluation(evaluation)}
      </small>
    )}
  </a>
) : (
  <div className="move-cell">
    <span>{san}</span>
  </div>
);

export function OpeningTrainer() {
  const [history, setHistory] = useState<UciMove[]>([]);
  const [selectedOpening, setSelectedOpening] = useState<OpeningId | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(() => defaultFeedback(null));
  const [attempts, setAttempts] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [completed, setCompleted] = useState(false);
  const [completedLineId, setCompletedLineId] = useState<string | null>(null);
  const [takeback, setTakeback] = useState<TakebackSnapshot | null>(null);
  const [publishedPlyCount, setPublishedPlyCount] = useState(0);
  const [stats, setStats] = useState<TrainerStats>(emptyStats);
  const [exam, setExam] = useState<ActiveExam | null>(null);
  const mobileSummaryRef = useRef<HTMLDivElement | null>(null);
  const selectedSquareRef = useRef<Square | null>(null);
  const draggingSourceRef = useRef<Square | null>(null);
  const dragStartSelectionRef = useRef<Square | null>(null);
  const suppressSquareClickRef = useRef(false);
  const pendingSuccessRef = useRef<{ playedSan: string; explanation: string; alternativeSans: string[] } | null>(null);

  const opening = useMemo(() => openingById(selectedOpening), [selectedOpening]);
  const game = useMemo(() => chessFromHistory(history), [history]);
  const selectedVariantConfig = useMemo(
    () => opening?.variants.find((variant) => variant.id === selectedVariant) ?? null,
    [opening, selectedVariant],
  );
  const opponentLines = useMemo(() => selectedVariantConfig && opening
    ? opening.lines.filter((line) => selectedVariantConfig.opponentLineIds?.includes(line.id) ?? line.family === selectedVariantConfig.family)
    : [], [opening, selectedVariantConfig]);
  const playerColor = opening?.playerColor ?? "w";
  const session = useMemo(() => opening && selectedVariantConfig
    ? createTrainingSession(opening.lines, opponentLines, opening.playerColor, opening.moveOrderMoves, opening.positionEvaluations)
    : null, [opening, opponentLines, selectedVariantConfig]);
  const choices = useMemo(() => session ? sessionChoices(session, history) : [], [history, session]);
  const targetLine = useMemo(() => session ? sessionTarget(session, history) : null, [history, session]);
  const opponentColor = playerColor === "w" ? "b" : "w";
  const isUserTurn = game.turn() === playerColor;
  const atTarget = Boolean(targetLine);
  const thinking = Boolean(selectedVariant) && !completed && !atTarget && !isUserTurn;
  const examFinished = Boolean(exam && exam.results.length === exam.variantIds.length);
  const panelHistoryLength = Math.min(history.length, publishedPlyCount);
  const panelHistory = useMemo(() => history.slice(0, panelHistoryLength), [history, panelHistoryLength]);
  const panelGame = useMemo(() => chessFromHistory(panelHistory), [panelHistory]);
  const positionEvaluation = useMemo(
    () => opening?.evaluation ? staticEvaluationFor(panelHistory, opening.lines, opening.positionEvaluations) : null,
    [opening, panelHistory],
  );

  const persistStats = useCallback((updater: (current: TrainerStats) => TrainerStats) => {
    setStats((current) => {
      const next = updater(current);
      saveStats(next, window.localStorage);
      return next;
    });
  }, []);

  const resetStats = useCallback(() => {
    if (!window.confirm("Reset all training statistics saved on this device?")) return;
    persistStats(() => emptyStats());
  }, [persistStats]);

  useEffect(() => {
    const timer = window.setTimeout(() => setStats(loadStats(window.localStorage)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    selectedSquareRef.current = selectedSquare;
  }, [selectedSquare]);

  useEffect(() => {
    if (!opening || !selectedVariant || !session || completed) return;

    if (targetLine) {
      const completionTimer = window.setTimeout(() => {
        setCompleted(true);
        setCompletedLineId(targetLine.id);
        setPublishedPlyCount(history.length);
        pendingSuccessRef.current = null;
        if (exam && selectedVariant) {
          const status = examLineStatus(exam.currentErrors, exam.currentRevealed);
          const result: ExamLineResult = {
            variantId: selectedVariant,
            status,
            errors: exam.currentErrors,
            correctMoves: exam.currentCorrectMoves,
            firstTryMoves: exam.currentFirstTryMoves,
          };
          const nextResults = [...exam.results, result];
          setExam({
            ...exam,
            results: nextResults,
          });
          setFeedback({
            kind: "success",
            title: "Line complete",
            message: selectedVariantConfig?.label ?? "",
          });
        } else {
          setFeedback({ kind: "success", title: "Target position reached", message: trainingGoalFor(opening.id, targetLine.id).title });
          persistStats((current) => ({
            ...current,
            completed: current.completed + 1,
            linesSeen: { ...current.linesSeen, [targetLine.id]: (current.linesSeen[targetLine.id] ?? 0) + 1 },
          }));
        }
      }, 0);
      return () => window.clearTimeout(completionTimer);
    }

    if (!choices.length) return;
    if (isUserTurn) return;
    const timer = window.setTimeout(() => {
      const choice = weightedChoice(choices);
      if (!choice) return;
      const nextHistory = [...history, choice.uci];
      const nextGame = chessFromHistory(nextHistory);
      const san = nextGame.history().at(-1) ?? "";
      setHistory(nextHistory);
      setPublishedPlyCount(nextHistory.length);
      setSelectedSquare(null);
      const success = pendingSuccessRef.current;
      if (success) {
        if (exam) {
          setFeedback({
            kind: "success",
            title: `${success.playedSan} is correct · ${colorName(opponentColor)} plays ${san}`,
            message: "",
          });
        } else {
          const alternatives = success.alternativeSans.length ? ` ${success.alternativeSans.join(" or ")} ${success.alternativeSans.length > 1 ? "also work" : "also works"} here.` : "";
          setFeedback({
            kind: "success",
            title: `${success.playedSan} is correct · ${colorName(opponentColor)} plays ${san}`,
            message: `${success.explanation}${alternatives} Find ${colorName(playerColor)}'s next move.`,
          });
        }
        pendingSuccessRef.current = null;
      } else {
        setFeedback({
          kind: "info",
          title: `${colorName(opponentColor)} plays ${san}`,
          message: exam
            ? ""
            : defaultFeedback(opening).message,
        });
      }
      if (!exam) persistStats((current) => ({ ...current, positionsSeen: current.positionsSeen + 1 }));
    }, 650);
    return () => window.clearTimeout(timer);
  }, [choices, completed, exam, history, isUserTurn, opening, opponentColor, persistStats, playerColor, selectedVariant, selectedVariantConfig, session, targetLine]);

  const acceptedSans = useMemo(
    () => choices.map((choice) => ({ uci: choice.uci, san: sanFor(game, choice.uci) })),
    [choices, game],
  );

  const playUserMove = useCallback((from: string, to: string) => {
    if (!opening || !selectedVariant || !isUserTurn || thinking || completed || atTarget) return false;
    let playedUci: UciMove;
    try {
      const probe = chessFromHistory(history);
      const move = probe.move({ from, to, promotion: "q" });
      playedUci = `${move.from}${move.to}${move.promotion ?? ""}` as UciMove;
    } catch {
      setSelectedSquare(from as Square);
      setFeedback({ kind: "error", title: "Illegal move", message: "That move is not legal in this position." });
      return false;
    }

    const accepted = choices.map((choice) => choice.uci);
    if (!accepted.includes(playedUci)) {
      const nextAttempts = attempts + 1;
      const revealedPrompt = revealedMovesPrompt(acceptedSans.map((item) => item.san));
      setAttempts(nextAttempts);
      setReveal(nextAttempts >= 2);
      if (exam) {
        setExam((current) => current ? {
          ...current,
          currentErrors: current.currentErrors + 1,
          currentRevealed: current.currentRevealed || nextAttempts >= 2,
        } : current);
        setFeedback(nextAttempts >= 2
          ? { kind: "hint", title: revealedPrompt, message: "" }
          : { kind: "hint", title: "Try again", message: "" });
      } else {
        const guide = opening.guidanceFor(accepted);
        setFeedback(nextAttempts >= 2
          ? { kind: "hint", title: revealedPrompt, message: "" }
          : { kind: "hint", title: "Not quite - try again", message: guide.hint });
        persistStats((current) => ({ ...current, errors: current.errors + 1 }));
      }
      setSelectedSquare(from as Square);
      return false;
    }

    const alternatives = accepted.filter((uci) => uci !== playedUci);
    setTakeback({
      history,
      alternatives,
      ...(exam ? { examAttempts: attempts, examFirstTry: attempts === 0 } : {}),
    });
    setHistory([...history, playedUci]);
    setAttempts(0);
    setReveal(false);
    setSelectedSquare(null);
    if (exam) {
      setExam((current) => current ? {
        ...current,
        currentCorrectMoves: current.currentCorrectMoves + 1,
        currentFirstTryMoves: current.currentFirstTryMoves + (attempts === 0 ? 1 : 0),
      } : current);
    } else {
      persistStats((current) => ({ ...current, correctMoves: current.correctMoves + 1 }));
    }
    const playedSan = sanFor(game, playedUci);
    const explanation = opening.guidanceFor([playedUci]).explanation;
    const alternativeSans = alternatives.map((move) => sanFor(game, move));
    pendingSuccessRef.current = { playedSan, explanation, alternativeSans };
    return true;
  }, [acceptedSans, atTarget, attempts, choices, completed, exam, game, history, isUserTurn, opening, persistStats, selectedVariant, thinking]);

  const handleSquareClick = useCallback(({ square }: { square: string }) => {
    if (suppressSquareClickRef.current) {
      suppressSquareClickRef.current = false;
      return;
    }
    const clicked = square as Square;
    if (!selectedVariant || !isUserTurn || thinking || completed || atTarget) return;
    const piece = game.get(clicked);
    if (selectedSquare) {
      if (clicked === selectedSquare) {
        setSelectedSquare(null);
        return;
      }
      if (piece?.color === playerColor) setSelectedSquare(clicked);
      else playUserMove(selectedSquare, clicked);
      return;
    }
    if (piece?.color === playerColor) setSelectedSquare(clicked);
  }, [atTarget, completed, game, isUserTurn, playUserMove, playerColor, selectedSquare, selectedVariant, thinking]);

  const handlePieceDrag = useCallback((square: string | null) => {
    if (!square) return;
    suppressSquareClickRef.current = true;
    draggingSourceRef.current = square as Square;
    dragStartSelectionRef.current = selectedSquareRef.current;
    setSelectedSquare(square as Square);
  }, []);

  const releaseSquareClickSuppression = useCallback(() => {
    window.setTimeout(() => {
      suppressSquareClickRef.current = false;
    }, 0);
  }, []);

  const handlePieceDrop = useCallback((sourceSquare: string, targetSquare: string | null) => {
    const source = sourceSquare as Square;
    draggingSourceRef.current = null;
    releaseSquareClickSuppression();
    if (!targetSquare) {
      setSelectedSquare(dragStartSelectionRef.current);
      dragStartSelectionRef.current = null;
      return false;
    }
    if (sourceSquare === targetSquare) {
      const wasSelectedBeforeDrag = dragStartSelectionRef.current === source;
      dragStartSelectionRef.current = null;
      setSelectedSquare(wasSelectedBeforeDrag ? null : source);
      return false;
    }

    dragStartSelectionRef.current = null;
    return playUserMove(sourceSquare, targetSquare);
  }, [playUserMove, releaseSquareClickSuppression]);

  const handlePieceDragCancel = useCallback(() => {
    if (!draggingSourceRef.current) return;
    draggingSourceRef.current = null;
    setSelectedSquare(dragStartSelectionRef.current);
    dragStartSelectionRef.current = null;
    releaseSquareClickSuppression();
  }, [releaseSquareClickSuppression]);

  const legalTargets = useMemo(() => selectedSquare
    ? game.moves({ square: selectedSquare, verbose: true }).map((move) => move.to)
    : [], [game, selectedSquare]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    const last = history.at(-1);
    if (last) {
      styles[last.slice(0, 2)] = { background: "rgba(255, 178, 122, .46)" };
      styles[last.slice(2, 4)] = { background: "rgba(255, 178, 122, .58)" };
    }
    if (selectedSquare) styles[selectedSquare] = { background: "rgba(139, 215, 235, .72)" };
    for (const target of legalTargets) {
      styles[target] = {
        ...styles[target],
        background: game.get(target as Square)
          ? "radial-gradient(transparent 58%, rgba(12, 48, 65, .48) 60%)"
          : "radial-gradient(rgba(12, 48, 65, .42) 18%, transparent 20%)",
      };
    }
    return styles;
  }, [game, history, legalTargets, selectedSquare]);

  const resetSession = useCallback((nextFeedback = defaultFeedback(opening)) => {
    setHistory([]);
    setFeedback(nextFeedback);
    setAttempts(0);
    setReveal(false);
    setSelectedSquare(null);
    setCompleted(false);
    setCompletedLineId(null);
    setTakeback(null);
    setPublishedPlyCount(0);
    draggingSourceRef.current = null;
    dragStartSelectionRef.current = null;
    suppressSquareClickRef.current = false;
    pendingSuccessRef.current = null;
  }, [opening]);

  const chooseOpening = (openingId: OpeningId) => {
    const nextOpening = openingById(openingId);
    setSelectedOpening(openingId);
    setSelectedVariant(null);
    setExam(null);
    resetSession(defaultFeedback(nextOpening));
  };

  const changeOpening = () => {
    setSelectedOpening(null);
    setSelectedVariant(null);
    setExam(null);
    resetSession(defaultFeedback(null));
  };

  const newExercise = () => {
    setSelectedVariant(null);
    setExam(null);
    resetSession();
  };

  const startCurrentVariant = (variantId: string, examMode: boolean) => {
    setSelectedVariant(variantId);
    if (opening?.playerColor === "b") {
      const variant = opening.variants.find((item) => item.id === variantId);
      const variantLines = variant
        ? opening.lines.filter((line) => variant.opponentLineIds?.includes(line.id) ?? line.family === variant.family)
        : [];
      const nextSession = createTrainingSession(
        opening.lines,
        variantLines,
        opening.playerColor,
        opening.moveOrderMoves,
        opening.positionEvaluations,
      );
      const firstChoice = weightedChoice(sessionChoices(nextSession, []));
      if (firstChoice) {
        const firstHistory = [firstChoice.uci];
        const firstSan = chessFromHistory(firstHistory).history().at(-1) ?? "";
        resetSession({
          kind: "info",
          title: `White plays ${firstSan}`,
          message: examMode
            ? ""
            : `${opening.startMessage} Find Black's next move.`,
        });
        setHistory(firstHistory);
        setPublishedPlyCount(firstHistory.length);
        if (!examMode) {
          persistStats((current) => ({
            ...current,
            sessions: current.sessions + 1,
            positionsSeen: current.positionsSeen + 1,
          }));
        }
        return;
      }
    }
    resetSession(examMode
      ? {
          kind: "info",
          title: "Your move",
          message: "",
        }
      : undefined);
    if (!examMode) persistStats((current) => ({ ...current, sessions: current.sessions + 1 }));
  };

  const startVariant = (variantId: string) => {
    setExam(null);
    startCurrentVariant(variantId, false);
  };

  const startExam = (variantIds = opening?.variants.map((variant) => variant.id) ?? [], isPractice = false) => {
    if (!opening || !variantIds.length) return;
    const shuffled = shuffleExamVariants(variantIds);
    setExam({
      variantIds: shuffled,
      index: 0,
      results: [],
      currentErrors: 0,
      currentCorrectMoves: 0,
      currentFirstTryMoves: 0,
      currentRevealed: false,
      resultsVisible: false,
      isPractice,
    });
    startCurrentVariant(shuffled[0], true);
  };

  const exitExam = () => {
    const exitMessage = exam?.isPractice
      ? "Stop this practice? Your current progress will be lost."
      : "Exit the exam? Your current progress will be lost.";
    if (exam && !examFinished && !window.confirm(exitMessage)) return;
    setExam(null);
    setSelectedVariant(null);
    resetSession();
  };

  const continueExam = () => {
    if (!exam || exam.results.length <= exam.index) return;
    if (exam.index === exam.variantIds.length - 1) {
      setExam({ ...exam, resultsVisible: true });
      return;
    }
    const nextIndex = exam.index + 1;
    setExam({
      ...exam,
      index: nextIndex,
      currentErrors: 0,
      currentCorrectMoves: 0,
      currentFirstTryMoves: 0,
      currentRevealed: false,
    });
    startCurrentVariant(exam.variantIds[nextIndex], true);
  };

  const startFocusedPractice = () => {
    if (!exam) return;
    startExam(summarizeExam(exam.results).reviewVariantIds, true);
  };

  const tryAlternative = () => {
    if (!takeback) return;
    setHistory(takeback.history);
    setPublishedPlyCount(takeback.history.length);
    setCompleted(false);
    setCompletedLineId(null);
    pendingSuccessRef.current = null;
    setAttempts(takeback.examAttempts ?? 0);
    setReveal((takeback.examAttempts ?? 0) >= 2);
    setSelectedSquare(null);
    if (exam) {
      setExam((current) => current ? {
        ...current,
        currentCorrectMoves: Math.max(0, current.currentCorrectMoves - 1),
        currentFirstTryMoves: Math.max(0, current.currentFirstTryMoves - (takeback.examFirstTry ? 1 : 0)),
      } : current);
    }
    setFeedback({ kind: "info", title: "Try an alternative", message: "You are back at the position before your previous choice." });
    setTakeback(null);
  };

  const maxLength = session?.maxTargetLength ?? Math.max(1, history.length);
  const progress = atTarget || completed ? 100 : Math.min(100, Math.round((panelHistory.length / maxLength) * 100));
  const progressLabel = exam ? "Current line" : "On the way to the middlegame";
  const moveHistory = panelGame.history();
  const moveEvaluations = opening?.evaluation
    ? panelHistory.map((_, index) => staticEvaluationFor(panelHistory.slice(0, index + 1), opening.lines, opening.positionEvaluations))
    : [];
  const moveFens = panelHistory.map((_, index) => chessFromHistory(panelHistory.slice(0, index + 1)).fen());
  const accuracyBase = stats.correctMoves + stats.errors;
  const accuracy = accuracyBase ? Math.round((stats.correctMoves / accuracyBase) * 100) : null;
  const finalGoal = completed && opening
    ? opening.lines.find((line) => line.id === completedLineId)
    : null;
  const finalGoalContent = finalGoal && opening ? trainingGoalFor(opening.id, finalGoal.id) : null;
  const currentExamResult = exam?.results[exam.index] ?? null;
  const completedPgn = useMemo(
    () => completed && opening && selectedVariantConfig
      ? trainingPgn(history, opening, selectedVariantConfig.label)
      : null,
    [completed, history, opening, selectedVariantConfig],
  );
  const completedAnalysisUrl = completedPgn
    ? lichessPgnAnalysisUrl(completedPgn, playerColor)
    : "";
  const pickerMode = !selectedOpening || !selectedVariant;

  useEffect(() => {
    if (!selectedVariant || !window.matchMedia("(max-width: 960px)").matches) return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [selectedVariant]);

  useEffect(() => {
    if (!completed || !window.matchMedia("(max-width: 960px)").matches) return;
    const frame = window.requestAnimationFrame(() => {
      mobileSummaryRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "nearest",
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [completed]);

  return (
    <main className="app-shell">
      <header className="topbar">
        <Logo />
        <div className="header-note"><span className="status-dot" /> {opening ? `${keepCompoundWordsTogether(opening.shortName)} repertoire` : "Opening repertoire trainer"}</div>
      </header>

      <section className="trainer-layout">
        <div className="board-column">
          <div className="player-row opponent">
            <div className={`avatar ${opponentColor === "w" ? "white-avatar" : "black-avatar"}`}>{opponentColor === "w" ? "♙" : "♟"}</div>
            <div><strong>Computer</strong><span>{colorName(opponentColor)}</span></div>
            {thinking && <span className="thinking"><i /><i /><i /></span>}
          </div>

          <div
            className="board-frame"
            aria-label={`Chessboard oriented from ${colorName(playerColor)}'s side`}
            onContextMenuCapture={handlePieceDragCancel}
            onKeyDownCapture={(event) => {
              if (event.key === "Escape") handlePieceDragCancel();
            }}
            onPointerCancelCapture={handlePieceDragCancel}
            onTouchCancelCapture={handlePieceDragCancel}
          >
            <Chessboard options={{
              id: "coomate-board",
              position: game.fen(),
              boardOrientation: playerColor === "w" ? "white" : "black",
              animationDurationInMs: 260,
              boardStyle: { borderRadius: "7px", overflow: "hidden", boxShadow: "0 22px 70px rgba(1, 15, 24, .5)" },
              darkSquareStyle: { backgroundColor: "#78a2b8" },
              lightSquareStyle: { backgroundColor: "#dcecf2" },
              darkSquareNotationStyle: { color: "rgba(239, 248, 251, .72)", fontWeight: 800 },
              lightSquareNotationStyle: { color: "rgba(31, 74, 96, .66)", fontWeight: 800 },
              squareStyles,
              allowDragOffBoard: false,
              allowDrawingArrows: false,
              dragActivationDistance: 8,
              arrows: reveal ? acceptedSans.map(({ uci }) => ({ startSquare: uci.slice(0, 2), endSquare: uci.slice(2, 4), color: "rgba(255, 178, 122, .92)" })) : [],
              canDragPiece: ({ piece }) => Boolean(selectedVariant) && isUserTurn && !thinking && !completed && !atTarget && piece.pieceType.startsWith(playerColor),
              onPieceDrag: ({ square }) => handlePieceDrag(square),
              onPieceDrop: ({ sourceSquare, targetSquare }) => handlePieceDrop(sourceSquare, targetSquare),
              onSquareClick: handleSquareClick,
            }} />
          </div>

          <div className="player-row you">
            <div className={`avatar ${playerColor === "w" ? "white-avatar user-white-avatar" : "black-avatar"}`}>{playerColor === "w" ? "♙" : "♟"}</div>
            <div><strong>You</strong><span>{colorName(playerColor)}{opening ? ` · ${keepCompoundWordsTogether(opening.shortName)}` : ""}</span></div>
            <span className={`turn-pill ${isUserTurn && selectedVariant && !completed && !atTarget ? "active" : ""}`}>
              {!selectedOpening
                ? "Choose repertoire"
                : !selectedVariant
                  ? "Choose variation"
                  : exam?.resultsVisible
                    ? exam.isPractice ? "Practice complete" : "Exam complete"
                    : exam
                      ? `${exam.index + 1}/${exam.variantIds.length}`
                    : completed || atTarget ? "Line complete" : isUserTurn ? "Your move" : "Waiting"}
            </span>
          </div>

          {selectedVariant && (
            <div className="mobile-session-summary" ref={mobileSummaryRef}>
              {exam?.resultsVisible && opening ? (
                <ExamResults
                  exam={exam}
                  opening={opening}
                  onRetry={startFocusedPractice}
                  onRestart={() => startExam()}
                  onExit={exitExam}
                />
              ) : (
                <>
                  <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
                  <div className="progress-copy"><span>{progressLabel}</span><strong>{progress}%</strong></div>

                  <div className={`feedback ${feedback.kind}`} role="status">
                    <span className="feedback-icon">{feedback.kind === "success" ? "✓" : feedback.kind === "hint" ? "✦" : feedback.kind === "error" ? "!" : playerColor === "w" ? "♙" : "♟"}</span>
                    <div><strong>{keepCompoundWordsTogether(feedback.title)}</strong>{feedback.message && <p>{keepCompoundWordsTogether(feedback.message)}</p>}</div>
                  </div>

                  {opening?.evaluation && positionEvaluation !== null && (
                    <StaticEvaluation centipawns={positionEvaluation} meta={opening.evaluation} />
                  )}

                  {takeback && takeback.alternatives.length > 0 && !thinking && !completed && <button className="secondary-action" onClick={tryAlternative}>↶ Go back and try an alternative</button>}

                  {completed && finalGoalContent && (
                    <div className="goal-card">
                      <span className="eyebrow">{exam && currentExamResult ? `${examStatusLabel[currentExamResult.status].toUpperCase()} · ${selectedVariantConfig?.label ?? ""}` : "TARGET POSITION"}</span>
                      <h2>{keepCompoundWordsTogether(finalGoalContent.title)}</h2>
                      <ul>{finalGoalContent.plans.map((plan) => <li key={plan}>{keepCompoundWordsTogether(plan)}</li>)}</ul>
                      <CompletionActions
                        analysisUrl={completedAnalysisUrl}
                        onNewExercise={exam ? continueExam : newExercise}
                        primaryLabel={exam
                          ? exam.index === exam.variantIds.length - 1
                            ? exam.isPractice ? "See practice results" : "See exam results"
                            : exam.isPractice ? "Next practice line" : "Next line"
                          : "New exercise"}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <aside className={`panel ${pickerMode ? "picker-panel" : ""}`}>
          <div className="panel-head">
            <div>
              <span className="eyebrow">{exam ? (exam.isPractice ? "FOCUSED PRACTICE" : "REPERTOIRE EXAM") : selectedVariant ? "GUIDED TRAINING" : "NEW TRAINING SESSION"}</span>
              <h1>
                {!opening
                  ? "Choose your repertoire"
                  : exam
                    ? exam.resultsVisible
                      ? exam.isPractice ? "Practice results" : "Exam results"
                      : `${exam.isPractice ? "Practice line " : "Line "}${exam.index + 1} of ${exam.variantIds.length}`
                    : selectedVariant
                      ? keepCompoundWordsTogether(selectedVariantConfig?.label ?? "")
                      : `Choose a variation · ${keepCompoundWordsTogether(opening.shortName)}`}
              </h1>
            </div>
            {selectedVariant && (
              <button
                className="icon-button"
                onClick={exam ? exitExam : newExercise}
                title={exam ? (exam.isPractice ? "Stop practice" : "Exit exam") : "Change variation"}
                aria-label={exam ? (exam.isPractice ? "Stop practice" : "Exit exam") : "Change variation"}
              >
                {exam ? "×" : "↻"}
              </button>
            )}
          </div>

          {!opening ? (
            <section className="opening-picker">
              <p>Which repertoire would you like to train?</p>
              <div className="opening-list">
                {openings.map((item) => (
                  <button key={item.id} onClick={() => chooseOpening(item.id)}>
                    <span className="opening-piece" aria-hidden="true">{item.playerColor === "w" ? "♙" : "♟"}</span>
                    <span><strong>{keepCompoundWordsTogether(item.name)}</strong><small>{keepCompoundWordsTogether(item.description)}</small></span>
                    <i>→</i>
                  </button>
                ))}
              </div>
            </section>
          ) : !selectedVariant ? (
            <section className="variant-picker">
              <div className="picker-intro"><button onClick={changeOpening}>← Change repertoire</button></div>
              <button className="exam-launch" aria-label="Repertoire Exam" onClick={() => startExam()}>
                <span aria-hidden="true">✓</span>
                <span>
                  <strong>Repertoire Exam</strong>
                </span>
                <i>→</i>
              </button>
              <button className="random-variant" aria-label="Random variation" onClick={() => startVariant(pickUniformVariant(opening.variants).id)}>
                <span aria-hidden="true">⚄</span>
                <span><strong>Random variation</strong></span>
                <b>→</b>
              </button>
              <div className="variant-list">
                {opening.variants.map((variant) => (
                  <button key={variant.id} onClick={() => startVariant(variant.id)}>
                    <span className="variant-copy"><strong>{keepCompoundWordsTogether(variant.label)}</strong><small>{keepCompoundWordsTogether(variant.description)}</small></span>
                    <span className="variant-meta"><span className="variant-frequency" title="Approximate frequency">≈ {variant.probability}%</span><span className="variant-moves">{variant.moves}</span></span>
                    <span className="variant-arrow">→</span>
                  </button>
                ))}
              </div>
            </section>
          ) : <div className="training-content">
            {exam?.resultsVisible ? (
              <ExamResults
                exam={exam}
                opening={opening}
                onRetry={startFocusedPractice}
                onRestart={() => startExam()}
                onExit={exitExam}
              />
            ) : (
              <>
                <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
                <div className="progress-copy"><span>{progressLabel}</span><strong>{progress}%</strong></div>

                <div className={`feedback ${feedback.kind}`} role="status">
                  <span className="feedback-icon">{feedback.kind === "success" ? "✓" : feedback.kind === "hint" ? "✦" : feedback.kind === "error" ? "!" : playerColor === "w" ? "♙" : "♟"}</span>
                  <div><strong>{keepCompoundWordsTogether(feedback.title)}</strong>{feedback.message && <p>{keepCompoundWordsTogether(feedback.message)}</p>}</div>
                </div>

                {opening.evaluation && positionEvaluation !== null && (
                  <StaticEvaluation centipawns={positionEvaluation} meta={opening.evaluation} />
                )}

                {takeback && takeback.alternatives.length > 0 && !thinking && !completed && <button className="secondary-action" onClick={tryAlternative}>↶ Go back and try an alternative</button>}

                {completed && finalGoalContent && (
                  <div className="goal-card">
                    <span className="eyebrow">{exam && currentExamResult ? `${examStatusLabel[currentExamResult.status].toUpperCase()} · ${selectedVariantConfig?.label ?? ""}` : "TARGET POSITION"}</span>
                    <h2>{keepCompoundWordsTogether(finalGoalContent.title)}</h2>
                    <ul>{finalGoalContent.plans.map((plan) => <li key={plan}>{keepCompoundWordsTogether(plan)}</li>)}</ul>
                    <CompletionActions
                      analysisUrl={completedAnalysisUrl}
                      onNewExercise={exam ? continueExam : newExercise}
                      primaryLabel={exam
                        ? exam.index === exam.variantIds.length - 1
                          ? exam.isPractice ? "See practice results" : "See exam results"
                          : exam.isPractice ? "Next practice line" : "Next line"
                        : "New exercise"}
                    />
                  </div>
                )}
              </>
            )}

            {!exam?.resultsVisible && (!exam || moveHistory.length > 0) && <section className="moves-section">
              <div className="section-title"><h2>Move history</h2></div>
              <div className="move-list">
                {!moveHistory.length && <p className="empty-moves">{playerColor === "w" ? `Your move: play ${acceptedSans[0]?.san ?? "the opening move"}.` : "The game will begin in a moment…"}</p>}
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, index) => (
                  <div className="move-row" key={index}>
                    <span className="move-number">{index + 1}.</span>
                    <MoveCell
                      san={moveHistory[index * 2] ?? ""}
                      evaluation={moveEvaluations[index * 2]}
                      fen={moveFens[index * 2]}
                      playerColor={playerColor}
                    />
                    <MoveCell
                      san={moveHistory[index * 2 + 1] ?? (thinking && index === Math.floor(history.length / 2) ? "…" : "")}
                      evaluation={moveEvaluations[index * 2 + 1]}
                      fen={moveFens[index * 2 + 1]}
                      playerColor={playerColor}
                    />
                  </div>
                ))}
              </div>
            </section>}

          </div>}

          {!exam && <section className="stats-section">
            <div className="section-title">
              <h2>Your progress</h2>
              <div className="stats-title-actions">
                <span>on this device</span>
                <button type="button" onClick={resetStats}>Reset</button>
              </div>
            </div>
            <div className="stats-grid">
              <div><strong>{stats.completed}</strong><span>Lines completed</span></div>
              <div><strong>{accuracy === null ? "-" : `${accuracy}%`}</strong><span>Accuracy</span></div>
              <div><strong>{stats.errors}</strong><span>Mistakes</span></div>
            </div>
          </section>}
        </aside>
      </section>
    </main>
  );
}
