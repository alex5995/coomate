"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chessboard } from "react-chessboard";
import type { Square } from "chess.js";
import { openingById, openings, pickUniformVariant } from "@/data/openings";
import { candidatesFor, chessFromHistory, choicesFor, sanFor, weightedChoice } from "@/lib/repertoire-engine";
import { emptyStats, loadStats, saveStats } from "@/lib/storage";
import type { Feedback, OpeningId, OpeningRepertoire, TakebackSnapshot, TrainerStats, UciMove } from "@/lib/types";
import { Logo } from "./Logo";

const defaultFeedback = (opening: OpeningRepertoire | null): Feedback => {
  if (opening) {
    return { kind: "info", title: opening.playerColor === "w" ? "Tocca a te" : "Preparati", message: opening.startMessage };
  }
  return { kind: "info", title: "Scegli il repertorio", message: "Decidi quale apertura vuoi allenare." };
};

const colorName = (color: "w" | "b") => color === "w" ? "Bianco" : "Nero";

export function OpeningTrainer() {
  const [history, setHistory] = useState<UciMove[]>([]);
  const [selectedOpening, setSelectedOpening] = useState<OpeningId | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(() => defaultFeedback(null));
  const [attempts, setAttempts] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [completed, setCompleted] = useState(false);
  const [takeback, setTakeback] = useState<TakebackSnapshot | null>(null);
  const [stats, setStats] = useState<TrainerStats>(emptyStats);
  const pendingSuccessRef = useRef<{ playedSan: string; explanation: string; alternativeSans: string[] } | null>(null);

  const opening = useMemo(() => openingById(selectedOpening), [selectedOpening]);
  const game = useMemo(() => chessFromHistory(history), [history]);
  const selectedVariantConfig = useMemo(
    () => opening?.variants.find((variant) => variant.id === selectedVariant) ?? null,
    [opening, selectedVariant],
  );
  const sessionLines = useMemo(() => selectedVariantConfig && opening
    ? opening.lines.filter((line) => selectedVariantConfig.lineIds?.includes(line.id) ?? line.family === selectedVariantConfig.family)
    : [], [opening, selectedVariantConfig]);
  const candidates = useMemo(() => candidatesFor(history, sessionLines), [history, sessionLines]);
  const choices = useMemo(() => choicesFor(history, sessionLines), [history, sessionLines]);
  const playerColor = opening?.playerColor ?? "w";
  const opponentColor = playerColor === "w" ? "b" : "w";
  const isUserTurn = game.turn() === playerColor;
  const thinking = Boolean(selectedVariant) && !completed && !isUserTurn;

  const persistStats = useCallback((updater: (current: TrainerStats) => TrainerStats) => {
    setStats((current) => {
      const next = updater(current);
      saveStats(next, window.localStorage);
      return next;
    });
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setStats(loadStats(window.localStorage)), 0);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!opening || !selectedVariant || completed) return;

    if (!choices.length) {
      const finalLine = opening.lines.find((line) => line.moves.length === history.length && candidates.includes(line));
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

    if (isUserTurn) return;
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
        const alternatives = success.alternativeSans.length ? ` Era teorica anche ${success.alternativeSans.join(" o ")}.` : "";
        setFeedback({
          kind: "success",
          title: `${success.playedSan} corretta · il ${colorName(opponentColor)} gioca ${san}`,
          message: `${success.explanation}${alternatives} Ora trova la continuazione del ${colorName(playerColor)}.`,
        });
        pendingSuccessRef.current = null;
      } else {
        setFeedback({ kind: "info", title: `Il ${colorName(opponentColor)} gioca ${san}`, message: `Trova una continuazione teorica per il ${colorName(playerColor)}.` });
      }
      persistStats((current) => ({ ...current, positionsSeen: current.positionsSeen + 1 }));
    }, history.length === 0 ? 420 : 650);
    return () => window.clearTimeout(timer);
  }, [candidates, choices, completed, history, isUserTurn, opening, opponentColor, persistStats, playerColor, selectedVariant]);

  const acceptedSans = useMemo(
    () => choices.map((choice) => ({ uci: choice.uci, san: sanFor(game, choice.uci) })),
    [choices, game],
  );

  const playUserMove = useCallback((from: string, to: string) => {
    if (!opening || !isUserTurn || thinking || completed) return false;
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
      const guide = opening.guidanceFor(accepted);
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
    const explanation = opening.guidanceFor([playedUci]).explanation;
    const alternativeSans = alternatives.map((move) => sanFor(game, move));
    pendingSuccessRef.current = { playedSan, explanation, alternativeSans };
    setFeedback({
      kind: "success",
      title: alternatives.length ? `${playedSan} è corretta · ci sono alternative` : `${playedSan} è corretta`,
      message: alternatives.length ? `${explanation} Era teorica anche ${alternativeSans.join(" o ")}.` : explanation,
    });
    return true;
  }, [acceptedSans, attempts, candidates, choices, completed, game, history, isUserTurn, opening, persistStats, thinking]);

  const handleSquareClick = useCallback(({ square }: { square: string }) => {
    const clicked = square as Square;
    if (!isUserTurn || thinking || completed) return;
    const piece = game.get(clicked);
    if (selectedSquare) {
      if (piece?.color === playerColor) setSelectedSquare(clicked);
      else playUserMove(selectedSquare, clicked);
      return;
    }
    if (piece?.color === playerColor) setSelectedSquare(clicked);
  }, [completed, game, isUserTurn, playUserMove, playerColor, selectedSquare, thinking]);

  const legalTargets = useMemo(() => selectedSquare
    ? game.moves({ square: selectedSquare, verbose: true }).map((move) => move.to)
    : [], [game, selectedSquare]);

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

  const resetSession = useCallback((nextFeedback = defaultFeedback(opening)) => {
    setHistory([]);
    setFeedback(nextFeedback);
    setAttempts(0);
    setReveal(false);
    setSelectedSquare(null);
    setCompleted(false);
    setTakeback(null);
    pendingSuccessRef.current = null;
  }, [opening]);

  const chooseOpening = (openingId: OpeningId) => {
    const nextOpening = openingById(openingId);
    setSelectedOpening(openingId);
    setSelectedVariant(null);
    resetSession(defaultFeedback(nextOpening));
  };

  const changeOpening = () => {
    setSelectedOpening(null);
    setSelectedVariant(null);
    resetSession(defaultFeedback(null));
  };

  const newExercise = () => {
    setSelectedVariant(null);
    resetSession();
  };

  const startVariant = (variantId: string) => {
    setSelectedVariant(variantId);
    resetSession();
    persistStats((current) => ({ ...current, sessions: current.sessions + 1 }));
  };

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

  const currentLine = candidates.length === 1 ? candidates[0] : null;
  const maxLength = Math.max(...candidates.map((line) => line.moves.length), history.length || 1);
  const progress = Math.min(100, Math.round((history.length / maxLength) * 100));
  const moveHistory = game.history();
  const accuracyBase = stats.correctMoves + stats.errors;
  const accuracy = accuracyBase ? Math.round((stats.correctMoves / accuracyBase) * 100) : 100;
  const finalGoal = completed && opening
    ? opening.lines.find((line) => line.moves.length === history.length && history.every((move, index) => line.moves[index] === move))
    : null;
  const pickerMode = !selectedOpening || !selectedVariant;

  return (
    <main className="app-shell">
      <header className="topbar">
        <Logo />
        <div className="header-note"><span className="status-dot" /> {opening ? `Repertorio ${opening.shortName}` : "Trainer di repertorio"}</div>
      </header>

      <section className="trainer-layout">
        <div className="board-column">
          <div className="player-row opponent">
            <div className={`avatar ${opponentColor === "w" ? "white-avatar" : "black-avatar"}`}>{opponentColor === "w" ? "♙" : "♟"}</div>
            <div><strong>Computer</strong><span>{colorName(opponentColor)} · repertorio teorico</span></div>
            {thinking && <span className="thinking"><i /><i /><i /></span>}
          </div>

          <div className="board-frame" aria-label={`Scacchiera orientata dal lato del ${colorName(playerColor)}`}>
            <Chessboard options={{
              id: "opening-lab-board",
              position: game.fen(),
              boardOrientation: playerColor === "w" ? "white" : "black",
              animationDurationInMs: 260,
              boardStyle: { borderRadius: "5px", overflow: "hidden", boxShadow: "0 18px 55px rgba(0,0,0,.28)" },
              darkSquareStyle: { backgroundColor: "#6f9274" },
              lightSquareStyle: { backgroundColor: "#e5e1cd" },
              squareStyles,
              allowDrawingArrows: false,
              arrows: reveal ? acceptedSans.map(({ uci }) => ({ startSquare: uci.slice(0, 2), endSquare: uci.slice(2, 4), color: "rgba(246, 190, 69, .9)" })) : [],
              canDragPiece: ({ piece }) => Boolean(selectedVariant) && isUserTurn && !thinking && !completed && piece.pieceType.startsWith(playerColor),
              onPieceDrop: ({ sourceSquare, targetSquare }) => targetSquare ? playUserMove(sourceSquare, targetSquare) : false,
              onSquareClick: handleSquareClick,
            }} />
          </div>

          <div className="player-row you">
            <div className={`avatar ${playerColor === "w" ? "white-avatar user-white-avatar" : "black-avatar"}`}>{playerColor === "w" ? "♙" : "♟"}</div>
            <div><strong>Tu</strong><span>{colorName(playerColor)}{opening ? ` · ${opening.shortName}` : ""}</span></div>
            <span className={`turn-pill ${isUserTurn && selectedVariant && !completed ? "active" : ""}`}>
              {!selectedOpening ? "Scegli il repertorio" : !selectedVariant ? "Scegli una variante" : completed ? "Linea completata" : isUserTurn ? "Tocca a te" : "In attesa"}
            </span>
          </div>
        </div>

        <aside className={`panel ${pickerMode ? "picker-panel" : ""}`}>
          <div className="panel-head">
            <div>
              <span className="eyebrow">{selectedVariant ? "ALLENAMENTO GUIDATO" : "NUOVO ALLENAMENTO"}</span>
              <h1>{!opening ? "Scegli il repertorio" : selectedVariant ? (currentLine?.name ?? selectedVariantConfig?.label) : `Scegli la variante · ${opening.shortName}`}</h1>
            </div>
            {selectedVariant && <button className="icon-button" onClick={newExercise} title="Cambia variante" aria-label="Cambia variante">↻</button>}
          </div>

          {!opening ? (
            <section className="opening-picker">
              <p>Quale repertorio vuoi allenare?</p>
              <div className="opening-list">
                {openings.map((item) => (
                  <button key={item.id} onClick={() => chooseOpening(item.id)}>
                    <span className="opening-piece" aria-hidden="true">{item.playerColor === "w" ? "♙" : "♟"}</span>
                    <span><strong>{item.name}</strong><small>{item.description}</small><b>Tu giochi sempre con il {colorName(item.playerColor)}</b></span>
                    <i>→</i>
                  </button>
                ))}
              </div>
            </section>
          ) : !selectedVariant ? (
            <section className="variant-picker">
              <div className="picker-intro"><button onClick={changeOpening}>← Cambia repertorio</button><p>Frequenze orientative; il casuale resta equidistribuito.</p></div>
              <button className="random-variant" onClick={() => startVariant(pickUniformVariant(opening.variants).id)}>
                <span aria-hidden="true">⚄</span>
                <span><strong>Variante casuale</strong><small>Ogni linea ha la stessa probabilità</small></span>
                <b>→</b>
              </button>
              <div className="variant-list">
                {opening.variants.map((variant) => (
                  <button key={variant.id} onClick={() => startVariant(variant.id)}>
                    <span className="variant-copy"><strong>{variant.label}</strong><small>{variant.description}</small></span>
                    <span className="variant-meta"><span className="variant-frequency" title="Frequenza orientativa">≈ {variant.probability}%</span><span className="variant-moves">{variant.moves}</span></span>
                    <span className="variant-arrow">→</span>
                  </button>
                ))}
              </div>
            </section>
          ) : <>
            <div className="progress-track"><span style={{ width: `${progress}%` }} /></div>
            <div className="progress-copy"><span>Verso il middlegame</span><strong>{progress}%</strong></div>

            <div className={`feedback ${feedback.kind}`} role="status">
              <span className="feedback-icon">{feedback.kind === "success" ? "✓" : feedback.kind === "hint" ? "✦" : feedback.kind === "error" ? "!" : playerColor === "w" ? "♙" : "♟"}</span>
              <div><strong>{feedback.title}</strong><p>{feedback.message}</p></div>
            </div>

            {takeback && takeback.alternatives.length > 0 && !completed && <button className="secondary-action" onClick={tryAlternative}>↶ Torna indietro e prova l’alternativa</button>}

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
                {!moveHistory.length && <p className="empty-moves">{playerColor === "w" ? "Tocca a te: gioca 1.d4." : "La partita inizierà tra un istante…"}</p>}
                {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, index) => (
                  <div className="move-row" key={index}>
                    <span className="move-number">{index + 1}.</span>
                    <span>{moveHistory[index * 2] ?? ""}</span>
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
