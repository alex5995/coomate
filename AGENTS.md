# CooMate Agent Guide

## Maintenance rule

Treat this file as living project documentation. Update `AGENTS.md` in the same change whenever a task introduces or changes a durable product rule, architectural convention, repertoire preference, UI pattern, verification command, or repository constraint.

Keep it concise and current. Record final decisions only - do not append a chronological history, temporary debugging notes, or rejected approaches.

## Product

CooMate is an English-language chess opening trainer built with Next.js App Router, React, and TypeScript.

The app contains eight fixed-role repertoires, displayed in this order:

- Catalan Opening: the user always plays White. Curated lines come only from `https://lichess.org/study/DckpgOgd`.
- Sicilian Defence: the user always plays Black. Use the normal Dragon from `https://lichess.org/study/AvqP0tL1` whenever White permits it; use only the Alapin and Closed Sicilian lines from `https://lichess.org/study/jsSks17H` when White prevents the Dragon. Do not expose accelerated or hyperaccelerated Dragon move orders as opponent variations.
- Grünfeld Defence: the user always plays Black. Curated lines come only from `https://lichess.org/study/0AUYoSOH`.
- Caro-Kann Defence: the user always plays Black and the computer always plays White.
- London System: the user always plays White and the computer always plays Black.
- Universal Slav System: the user always plays Black against non-`1.e4` openings. White may begin with `1.d4`, `1.c4`, `1.Nf3`, `1.b3`, or `1.g3`, but never `1.e4`.
- Nimzo-Larsen System - White: the user always plays White beginning with `1.b3`, followed by `Bb2` and `e3`.
- Nimzo-Larsen System - Black: the user always plays Black with the reversed `...b6`, `...Bb7`, and `...e6` setup.

The goal is practical opening training through curated middlegame positions, not engine analysis.

## Training behavior

- Use `chess.js` as the source of truth for legal moves, FEN, SAN, history, and undo behavior.
- Use `react-chessboard` for board interaction. Support drag-and-drop, square selection, mouse, and touch.
- Keep tap-to-move and drag-to-move equivalent on pointer and touch devices. Tapping a selected piece deselects it; same-square, off-board, and cancelled drops must not show an error or count as an attempt, while rejected moves leave the source selected for an immediate retry.
- Repertoire data must remain separate from the UI. Extend the typed repertoire and variant data instead of hardcoding chess knowledge in components.
- The computer may only choose moves present in the selected curated repertoire. Do not add live Stockfish analysis, free move generation, a backend, accounts, or external runtime calls. Stockfish may be used offline during repertoire authoring to generate committed static evaluations.
- The home flow first asks which repertoire to train, then which explicit opponent variation to practise.
- Opponent variations must be visible as separate menu entries. Multiple theoretical moves for the user's side remain accepted alternatives inside a variation.
- Match repertoire continuations by the first four FEN fields so equivalent positions share theory across move-order transpositions. Build user choices from the full opening graph, restrict computer choices to the selected opponent variation, and prune any branch that cannot still reach one of that variation's curated targets.
- Accept adjacent curated setup moves in either order when both player moves are allowlisted for that opening, the opponent reply remains fixed, and `chess.js` confirms the complete reordered line is legal and reaches the same target position. Keep captures and tactical moves outside this automatic flexibility.
- Display approximate variation frequencies and order variations from most common to least common.
- Random variation selection must be uniform across the displayed variations. Do not weight random mode by the displayed frequencies.
- Computer choices inside a line may use curated weights that favor common continuations.
- A legal move outside the repertoire is immediately rejected without changing the position.
- The first theoretical mistake gives a strategic hint without revealing the move. The second consecutive mistake at the same position reveals every accepted continuation and highlights them on the board.
- Illegal moves do not count as theoretical mistakes.
- After a correct move, show one consolidated message containing the result, relevant theoretical alternatives, the computer's reply, and the next task.
- When alternatives exist, preserve enough session history for "Go back and try an alternative" to restore the exact position before the user's choice.
- Complete each line at a curated middlegame target. Show the target title, practical plans, and a clear new-exercise action.
- Persist versioned statistics in `localStorage`. Keep progress statistics and the reset control present in every application state.

## Repertoire principles

- Prefer practical, coherent plans over a theoretically best move that conflicts with the repertoire's intended style.
- Catalan, Sicilian, and Grünfeld repertoire moves must remain source-bound to their documented Lichess studies. Accept safe transpositional setup orders only when they combine moves and positions already expressed by the same source study.
- The Sicilian repertoire must prefer the normal `...d6` Dragon whenever White permits it. Accelerated and hyperaccelerated Dragon chapters are Black choices, so they must not appear in the opponent-variation menu or repertoire graph.
- In Black repertoires, do not trap the light-squared bishop behind an early `...e6`. Develop or exchange that bishop first unless a specifically curated exception is deliberately documented.
- The Caro-Kann Advance `dxc5` branch may use the documented `...e6`, `...Bxc5`, and later `...b6`/`...Bb7` exception to recover the c5 pawn without forcing an inferior bishop move.
- Caro-Kann Advance coverage must include common White choices such as `c3`, `Nf3`, `Nc3`, `h4`, and `dxc5`, including both defended-center and capture lines.
- Caro-Kann Classical coverage should retain the practical `...Nf6` knight-development and exchange proposal as well as curated bishop-development alternatives.
- London System lines must support both `Bf4` before `Nf3` and `Nf3` before `Bf4` where the position permits. Preserve the normal `d4`, `Nf3`, `Bf4`, `e3`, `c3`, `Bd3` or `Be2`, `Nbd2`, kingside castling and `Ne5` plans; use `Nc3` only in specifically curated tactical positions.
- London System lines may welcome `...Bxf4` followed by `exf4`. Treat the doubled f-pawns as a healthy thematic structure when the f4 pawn reinforces e5 and the semi-open e-file supports central play; keep the capture and recapture explicit in curated paths rather than move-order generation.
- Universal Slav Anti-Jobava coverage remains distinct from the White London System repertoire and must include practical answers to White's `f3` and `g4` expansion.
- Universal Slav lines must cover the major `1.d4`, English, Reti, and flank-opening families while preserving the light-squared-bishop rule above.
- Nimzo-Larsen White lines must begin with `1.b3` and preserve the `Bb2` and `e3` core. When available, use `Bb5` and `Bxc6` to remove a knight, then `f4`, `Nf3`, and kingside castling to control e5. If `Bb5` or `f4` is unavailable, adapt the setup without forcing the motif.
- Nimzo-Larsen Black lines must reverse the same ideas with `...b6`, `...Bb7`, and `...e6`. When available, use `...Bb4` and `...Bxc3`, then `...f5`, `...Nf6`, and kingside castling to control e4. If the standard plan is unavailable, challenge the centre with `...c5` or `...d5`.
- Every curated position in every repertoire must have a committed static Stockfish evaluation. Store centipawns from White's perspective and display them from the user's perspective, both in the current-position card and beside every White and Black move in history. Every recorded or automatically reordered position, including positions after the opponent's move and the target, must evaluate to at least `-1.00` for the trained side. The current evaluation baseline is Stockfish 18 at depth 18. Automatically generated move-order paths that fail this threshold must be pruned.
- Any repertoire expansion must update or add legality tests so every complete path is legal and reaches a target position.

## UI and content rules

- All user-facing copy, source identifiers, and filenames must be in English or language-neutral. Do not add labels that announce that something is "English".
- Never use an em dash. Use an ASCII hyphen with surrounding spaces when it acts as punctuation.
- Do not allow established hyphenated names such as `Caro-Kann` or `Blackmar-Diemer` to wrap at the hyphen. Preserve the existing compound-word handling.
- Keep the interface inspired by the clarity of a modern chess site without copying third-party branding or assets.
- Preserve the icy-sea palette across the board and application chrome.
- Use the standard, readable chess piece set currently provided through the board component. Do not replace it with undersized custom pieces.
- The brand is CooMate: a friendly pigeon with a white king and an icy chessboard. Use `public/coomate-logo.png` for the header and `public/coomate-tab-icon.png` for browser icons.
- The header logo must blend seamlessly with the banner. Preserve real transparency and verify it in a browser. The header image is intentionally served with Next Image optimization disabled to avoid stale opaque optimizer output.
- Keep the favicon artwork close to the canvas edges so it remains legible at browser-tab size.
- Desktop should fit the board, header, and active panel within the viewport. Long repertoire menus scroll inside their panel instead of expanding the page.
- Variation-card copy, frequency and notation must stay inside the card at every width. Give notation its own wrapping row when a single-row layout would squeeze or overlap the descriptive copy.
- At single-column breakpoints, starting a variation must return the page to the board. Progress, move feedback, alternatives, and the completion summary must appear immediately below the board rather than being hidden below the full side panel.
- On mobile completion, automatically bring the target summary and new-exercise action into view. Keep move history and statistics available below.
- Preserve essential keyboard accessibility, visible status messaging, and reduced-motion behavior.

## Architecture map

- `src/components/OpeningTrainer.tsx`: session orchestration and responsive trainer UI.
- `src/data/*-repertoire.ts`: curated move trees, including the White London System repertoire.
- `src/data/*-variants.ts` and `src/data/trainer-variants.ts`: user-selectable opponent variations and displayed frequencies.
- `src/data/training-goals.ts`: target-position teaching content.
- `src/data/stockfish-evaluation.ts`: shared static-evaluation metadata.
- `src/data/*-evaluations.ts`: opening-specific committed Stockfish line arrays and additional FEN evaluations needed by allowlisted move-order paths. Recorded positions may reuse the evaluation stored in the line array.
- `src/lib/repertoire-engine.ts`: FEN-position repertoire graphs, live-path filtering, SAN helpers, and weighted computer choices.
- `src/lib/storage.ts`: versioned local statistics and migrations.
- `src/lib/types.ts`: shared domain types.
- `src/app/globals.css`: application theme and responsive layout.

## Repository hygiene

- Keep the repository safe for a public GitHub project. Never commit credentials, `.env` files, private keys, local absolute paths, IDE state, build output, caches, or user data.
- `next-env.d.ts` is generated by Next.js and intentionally ignored. Do not add it back to version control.
- Keep generated directories such as `.next`, `node_modules`, coverage output, `.idea`, logs, and `*.tsbuildinfo` untracked.
- Preserve unrelated user changes and avoid broad rewrites when a focused edit is sufficient.

## Verification

Run all of the following before handing off an implementation change:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

For UI changes, also verify the affected state in a real browser at both desktop and mobile widths. For training-flow changes, test at least one correct move, one legal move outside the repertoire, and line completion when relevant.

When any repertoire changes, also run the relevant offline audit with an official Stockfish binary. Use `--group=study` for Catalan, Sicilian, and Grünfeld, `--group=core` for Caro-Kann, London, and Universal Slav, `--group=nimzo` for both Nimzo-Larsen repertoires, or `--group=all` for every repertoire:

```bash
node scripts/audit-repertoires.mjs /path/to/stockfish 18 --group=all --summary
```

If allowlisted move-order generation changes, audit its additional positions too:

```bash
node scripts/audit-repertoires.mjs /path/to/stockfish 18 --group=all --reordered-only
```
