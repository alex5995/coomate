"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";
import { guidanceFor, repertoire } from "@/data/repertoire";
import { pickRandomVariant, trainerVariants } from "@/data/trainer-variants";
import {
  candidatesFor,
  chessFromHistory,
  choicesFor,
  sanFor,
  weightedChoice,
} from "@/lib/repertoire-engine";
import { emptyStats, loadStats, saveStats } from "@/lib/storage";
import type { Feedback, TakebackSnapshot, TrainerStats, UciMove } from "@/lib/types";
import { Logo } from "./Logo";

const DEFAULT_FEEDBACK: Feedback = {
  kind: "info",
  title: "Tocca a te",
  message: "Il Bianco giocherà 1.e4. Rispondi costruendo la tua Caro-Kann.",
};

const moveLabel = (moveNumber: number, san: string, isWhite: boolean) =>
  isWhite ? `${moveNumber}. ${san}` : san;

export function CaroTrainer() {
  const [history, setHistory] = useState<UciMove[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(DEFAULT_FEEDBACK);
  const [attempts, setAttempts] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [completed, setCompleted] = useState(false);
  const [takeback, setTakeback] = useState<TakebackSnapshot | null>(null);
  const [stats, setStats] = useState<TrainerStats>(emptyStats);
  const pendingSuccessRef = useRef<{
    playedSan: string;
    explanation: string;
    alternativeSans: string[];
  } | null>(null);

  const game = useMemo(() => chessFromHistory(history), [history]);
  const selectedVariantConfig = useMemo(
    () => trainerVariants.find((variant) => variant.id === selectedVariant) ?? null,
    [selectedVariant],
  );
  const sessionLines = useMemo(
    () => selectedVariantConfig
      ? repertoire.filter((line) => selectedVariantConfig.lineIds?.includes(line.id) ?? line.family === selectedVariantConfig.family)
      : [],
    [selectedVariantConfig],
  );
  const candidates = useMemo(() => candidatesFor(history, sessionLines), [history, sessionLines]);
  const choices = useMemo(() => choicesFor(history, sessionLines), [history, sessionLines]);
  const isBlackTurn = game.turn() === "b";
  const thinking = !completed && !isBlackTurn;

  const persistStats = useCallback((updater: (current: TrainerStats) => TrainerStats) => {
    setStats((current) => {
      const next = updater(current);
      saveStats(next, window.localStorage);
      return next;
    });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setStats(loadStats(window.localStorage));
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!selectedVariant || completed || isBlackTurn) return;
    if (!choices.length) {
      const finalLine = repertoire.find((line) => line.moves.length === history.length && candidates.includes(line));
      if (!finalLine) return;
      const completionTimer = window.setTimeout(() => {
        setCompleted(true);
        setFeedback({ kind: "success", title: "Posizione-obiettivo raggiunta", message: finalLine.goal.title });
        persistStats((current) => ({
          ...current,
          completed: current.completed + 1,
          linesSeen: { ...current.linesSeen, [finalLine.id]: (current.linesSeen[finalLine.id] ?? 0) + 1 },
        }));
      }, 0);
      return () => window.clearTimeout(completionTimer);
    }

    const timer = window.setTimeout(() => {
      const choice = weightedChoice(choices);
      if (!choice) return;
      const nextHistory = [...history, choice.uci];
      const nextGame = chessFromHistory(nextHistory);
      const san = nextGame.history().at(-1) ?? "";
      setHistory(nextHistory);
      setSelectedSquare(null);
      const success = pendingSuccessRef.current;
      if (success) {
        const alternatives = success.alternativeSans.length
          ? ` Era teorica anche ${success.alternativeSans.join(" o ")}.`
          : "";
        setFeedback({
          kind: "success",
          title: `${success.playedSan} corretta · il Bianco gioca ${san}`,
          message: `${success.explanation}${alternatives} Ora trova la continuazione del Nero.`,
        });
        pendingSuccessRef.current = null;
      } else {
        setFeedback({
          kind: "info",
          title: `Il Bianco gioca ${san}`,
          message: "Trova una continuazione teorica per il Nero.",
        });
      }
      persistStats((current) => ({ ...current, positionsSeen: current.positionsSeen + 1 }));
    }, history.length === 0 ? 420 : 650);

    return () => window.clearTimeout(timer);
  }, [candidates, choices, completed, history, isBlackTurn, persistStats, selectedVariant]);

  const acceptedSans = useMemo(
    () => choices.map((choice) => ({ uci: choice.uci, san: sanFor(game, choice.uci) })),
    [choices, game],
  );

  const playBlackMove = useCallback((from: string, to: string) => {
    if (!isBlackTurn || thinking || completed) return false;

    let playedUci: UciMove;
    try {
      const probe = chessFromHistory(history);
      const move = probe.move({ from, to, promotion: "q" });
      playedUci = `${move.from}${move.to}${move.promotion ?? ""}` as UciMove;
    } catch {
      setFeedback({ kind: "error", title: "Mossa non legale", message: "Quella mossa non è consentita in questa posizione." });
      return false;
    }

    const accepted = choices.map((choice) => choice.uci);
    if (!accepted.includes(playedUci)) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setReveal(nextAttempts >= 2);
      const guide = guidanceFor(accepted);
      setFeedback(nextAttempts >= 2
        ? { kind: "hint", title: "Ecco le continuazioni", message: `Prova una di queste: ${acceptedSans.map((item) => item.san).join(", ")}.` }
        : { kind: "hint", title: "Quasi, riprova", message: guide.hint });
      persistStats((current) => ({ ...current, errors: current.errors + 1 }));
      setSelectedSquare(null);
      return false;
    }

    const alternatives = accepted.filter((uci) => uci !== playedUci);
    setTakeback({ history, candidateIds: candidates.map((line) => line.id), alternatives });
    setHistory([...history, playedUci]);
    setAttempts(0);
    setReveal(false);
    setSelectedSquare(null);
    persistStats((current) => ({ ...current, correctMoves: current.correctMoves + 1 }));

    const playedSan = sanFor(game, playedUci);
    const explanation = guidanceFor([playedUci]).explanation;
    const alternativeSans = alternatives.map((move) => sanFor(game, move));
    pendingSuccessRef.current = { playedSan, explanation, alternativeSans };
    setFeedback({
      kind: "success",
      title: alternatives.length ? `${playedSan} è corretta · ci sono alternative` : `${playedSan} è corretta`,
      message: alternatives.length
        ? `${explanation} Era teorica anche ${alternativeSans.join(" o ")}.`
        : explanation,
    });
    return true;
  }, [acceptedSans, attempts, candidates, choices, completed, game, history, isBlackTurn, persistStats, thinking]);

  const handleSquareClick = useCallback(({ square }: { square: string }) => {
    const clicked = square as Square;
    if (!isBlackTurn || thinking || completed) return;
    const piece = game.get(clicked);
    if (selectedSquare) {
      if (piece?.color === "b") {
        setSelectedSquare(clicked);
      } else {
        playBlackMove(selectedSquare, clicked);
      }
      return;
    }
    if (piece?.color === "b") setSelectedSquare(clicked);
  }, [completed, game, isBlackTurn, playBlackMove, selectedSquare, thinking]);

  const legalTargets = useMemo(() => {
    if (!selectedSquare) return [];
    return game.moves({ square: selectedSquare, verbose: true }).map((move) => move.to);
  }, [game, selectedSquare]);

  const squareStyles = useMemo(() => {
    const styles: Record<string, React.CSSProperties> = {};
    const last = history.at(-1);
    if (last) {
      styles[last.slice(0, 2)] = { background: "rgba(245, 208, 87, .52)" };
      styles[last.slice(2, 4)] = { background: "rgba(245, 208, 87, .62)" };
    }
    if (selectedSquare) styles[selectedSquare] = { background: "rgba(255, 218, 95, .72)" };
    for (const target of legalTargets) {
      styles[target] = {
        ...styles[target],
        background: game.get(target as Square)
          ? "radial-gradient(transparent 58%, rgba(20, 35, 28, .42) 60%)"
          : "radial-gradient(rgba(20, 35, 28, .38) 18%, transparent 20%)",
      };
    }
    return styles;
  }, [game, history, legalTargets, selectedSquare]);

  const tryAlternative = () => {
    if (!takeback) return;
    setHistory(takeback.history);
    setCompleted(false);
    pendingSuccessRef.current = null;
    setAttempts(0);
    setReveal(false);
    setSelectedSquare(null);
    setFeedback({ kind: "info", title: "Prova un’alternativa", message: "Sei tornato alla posizione prima della tua scelta." });
    setTakeback(null);
  };

  const newExercise = () => {
    setSelectedVariant(null);
    setHistory([]);
    setFeedback(DEFAULT_FEEDBACK);
    setAttempts(0);
    setReveal(false);
    setSelectedSquare(null);
    setCompleted(false);
    setTakeback(null);
    pendingSuccessRef.current = null;
  };

  const startVariant = (variantId: string) => {
    setSelectedVariant(variantId);
    setHistory([]);
    setFeedback(DEFAULT_FEEDBACK);
    setAttempts(0);
    setReveal(false);
    setSelectedSquare(null);
    setCompleted(false);
    setTakeback(null);
    pendingSuccessRef.current = null;
    persistStats((current) => ({ ...current, sessions: current.sessions + 1 }));
  };

  const currentLine = candidates.length === 1 ? candidates[0] : null;
  const maxLength = Math.max(...candidates.map((line) => line.moves.length), history.length || 1);
  const progress = Math.min(100, Math.round((history.length / maxLength) * 100));
  const moveHistory = game.history();
  const accuracyBase = stats.correctMoves + stats.errors;
  const accuracy = accuracyBase ? Math.round((stats.correctMoves / accuracyBase) * 100) : 100;
  const finalGoal = completed ? repertoire.find((line) => line.moves.length === history.length && history.every((move, index) => line.moves[index] === move)) : null;

  return (
    <main className="app-shell">
      <header className="topbar">
        <Logo />
        <div className="header-note"><span className="status-dot" /> Repertorio Caro-Kann</div>
      </header>

      <section className="trainer-layout">
        <div className="board-column">
          <div className="player-row opponent">
            <div className="avatar white-avatar">♙</div>
            <div><strong>Computer</strong><span>Bianco · repertorio teorico</span></div>
            {selectedVariant && thinking && <span className="thinking"><i /><i /><i /></span>}
          </div>

          <div className="board-frame" aria-label="Scacchiera orientata dal lato del Nero">
            <Chessboard options={{
              id: "caro-lab-board",
              position: game.fen(),
              boardOrientation: "black",
              animationDurationInMs: 260,
              boardStyle: { borderRadius: "5px", overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.28)" },
              darkSquareStyle: { backgroundColor: "#6f9274" },
              lightSquareStyle: { backgroundColor: "#e5e1cd" },
              squareStyles,
              allowDrawingArrows: false,
              arrows: reveal ? acceptedSans.map(({ uci }) => ({ startSquare: uci.slice(0, 2), endSquare: uci.slice(2, 4), color: "rgba(246, 190, 69, .9)" })) : [],
              canDragPiece: ({ piece }) => Boolean(selectedVariant) && isBlackTurn && !thinking && !completed && piece.pieceType.startsWith("b"),
              onPieceDrop: ({ sourceSquare, targetSquare }) => targetSquare ? playBlackMove(sourceSquare, targetSquare) : false,
              onSquareClick: handleSquareClick,
            }} />
          </div>

          <div className="player-row you">
            <div className="avatar black-avatar">♟</div>
            <div><strong>Tu</strong><span>Nero · Caro-Kann</span></div>
            <span className={`turn-pill ${isBlackTurn && !thinking && !completed ? "active" : ""}`}>
              {!selectedVariant ? "Scegli una variante" : completed ? "Linea completata" : isBlackTurn && !thinking ? "Tocca a te" : "In attesa"}
            </span>
          </div>
        </div>

        <aside className={`panel ${!selectedVariant ? "picker-panel" : ""}`}>
          <div className="panel-head">
            <div>
              <span className="eyebrow">{selectedVariant ? "ALLENAMENTO GUIDATO" : "NUOVO ALLENAMENTO"}</span>
              <h1>{selectedVariant ? (currentLine?.name ?? selectedVariantConfig?.label) : "Scegli la variante"}</h1>
            </div>
            {selectedVariant && <button className="icon-button" onClick={newExercise} title="Cambia variante" aria-label="Cambia variante">↻</button>}
          </div>

          {!selectedVariant ? (
            <section className="variant-picker">
              <p>Le percentuali sono stime orientative: più sono alte, più conviene allenare la linea.</p>
              <button className="random-variant" onClick={() => startVariant(pickRandomVariant().id)}>
                <span aria-hidden="true">⚄</span>
                <span><strong>Variante casuale</strong><small>Ogni linea ha la stessa probabilità</small></span>
                <b>→</b>
              </button>
              <div className="variant-list">
                {trainerVariants.map((variant) => (
                  <button key={variant.id} onClick={() => startVariant(variant.id)}>
                    <span className="variant-copy">
                      <strong>{variant.label}</strong>
                      <small>{variant.description}</small>
                    </span>
                    <span className="variant-meta">
                      <span className="variant-frequency" title="Frequenza orientativa">≈ {variant.probability}%</span>
                      <span className="variant-moves">{variant.moves}</span>
                    </span>
                    <span className="variant-arrow">→</span>
                  </button>
                ))}
              </div>
            </section>
          ) : <>
          <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
          <div className="progress-copy"><span>Verso il middlegame</span><strong>{progress}%</strong></div>

          <div className={`feedback ${feedback.kind}`} role="status">
            <span className="feedback-icon">{feedback.kind === "success" ? "✓" : feedback.kind === "hint" ? "✦" : feedback.kind === "error" ? "!" : "♟"}</span>
            <div><strong>{feedback.title}</strong><p>{feedback.message}</p></div>
          </div>

          {takeback && takeback.alternatives.length > 0 && !completed && (
            <button className="secondary-action" onClick={tryAlternative}>↶ Torna indietro e prova l’alternativa</button>
          )}

          {completed && finalGoal && (
            <div className="goal-card">
              <span className="eyebrow">POSIZIONE-OBIETTIVO</span>
              <h2>{finalGoal.goal.title}</h2>
              <ul>{finalGoal.goal.plans.map((plan) => <li key={plan}>{plan}</li>)}</ul>
              <button className="primary-action" onClick={newExercise}>Nuovo esercizio <span>→</span></button>
            </div>
          )}

          <section className="moves-section">
            <div className="section-title"><h2>Cronologia</h2><span>{Math.ceil(history.length / 2)} mosse</span></div>
            <div className="move-list">
              {!moveHistory.length && <p className="empty-moves">La partita inizierà tra un istante…</p>}
              {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, index) => (
                <div className="move-row" key={index}>
                  <span className="move-number">{index + 1}.</span>
                  <span>{moveHistory[index * 2] ? moveLabel(index + 1, moveHistory[index * 2], true).replace(`${index + 1}. `, "") : ""}</span>
                  <span>{moveHistory[index * 2 + 1] ?? (thinking && index === Math.floor(history.length / 2) ? "…" : "")}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="stats-section">
            <div className="section-title"><h2>I tuoi progressi</h2><span>su questo dispositivo</span></div>
            <div className="stats-grid">
              <div><strong>{stats.completed}</strong><span>Linee concluse</span></div>
              <div><strong>{accuracy}%</strong><span>Precisione</span></div>
              <div><strong>{stats.errors}</strong><span>Errori teorici</span></div>
            </div>
          </section>
          </>}
        </aside>
      </section>
    </main>
  );
}
