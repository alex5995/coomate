# CooMate Agent Guide

## Maintenance rule

Treat this file as living project documentation. Update `AGENTS.md` in the same change whenever a task introduces or changes a durable product rule, architectural convention, repertoire preference, UI pattern, verification command, or repository constraint.

Keep it concise and current. Record final decisions only.

## Product

CooMate is an English-language chess opening trainer built with Next.js App Router, React, and TypeScript.

The app contains exactly three fixed-role repertoires, displayed in this order:

- Catalan Opening: the user always plays White. Curated lines come only from `https://lichess.org/study/DckpgOgd`.
- Sicilian Defence: the user always plays Black. Use the normal Dragon from `https://lichess.org/study/AvqP0tL1` whenever White permits it. Alapin lines keep the `https://lichess.org/study/jsSks17H` prefix and use continuations from `https://lichess.org/study/cA3kOR92`; Closed lines keep the `https://lichess.org/study/jsSks17H` `2.Nc3 d6` prefix and use Dragon-style continuations from `https://lichess.org/study/72rdAVHd`. Moscow and Smith-Morra lines come from `https://lichess.org/study/AsIsKPrX`; Bowdler lines come from `https://lichess.org/study/ulZswGf8`.
- Grünfeld Defence: the user always plays Black. Curated lines come only from `https://lichess.org/study/0AUYoSOH`.

The goal is practical opening training through curated middlegame positions, not engine analysis.

## Training behavior

- Use `chess.js` as the source of truth for legal moves, FEN, SAN, history, and undo behavior.
- Use `react-chessboard` for drag-and-drop, square selection, mouse, and touch.
- Tapping a selected piece deselects it. Same-square, off-board, and cancelled drops do not show an error or count as an attempt. Rejected moves leave the source selected.
- Keep repertoire data separate from the UI.
- The computer may choose only moves present in the selected curated repertoire. Do not add live Stockfish, free move generation, a backend, accounts, or external runtime calls.
- Ask for the repertoire first, then an explicit opponent variation.
- Opponent variations are separate menu entries. Multiple theoretical moves for the user's side remain accepted alternatives inside a variation.
- Match continuations by the first four FEN fields so equivalent positions share theory across transpositions.
- Accept adjacent curated setup moves in either order only when both player moves are allowlisted, the opponent reply remains fixed, and the reordered line is legal and reaches the same target. Do not reorder captures or tactical moves automatically.
- Display approximate variation frequencies from most common to least common. Random selection is uniform across displayed variations.
- A legal move outside the repertoire is rejected without changing the position.
- The first theoretical mistake gives a strategic hint. The second consecutive mistake at the same position reveals every accepted continuation.
- Illegal moves do not count as theoretical mistakes.
- Treat a correct user move and the computer reply as one atomic panel update. Move the board immediately, but keep the previous feedback, progress, static evaluation, move history, and alternative action unchanged while the computer is thinking. Publish the combined title, explanation, next task, progress, evaluation, history, and alternative action together when the computer replies.
- When a Black repertoire starts, apply White's automatic first move in the same interaction that selects the variation and show one complete feedback message. Do not render an intermediate waiting or introductory message that changes without user interaction.
- Preserve enough history for "Go back and try an alternative" to restore the exact position before the user's choice.
- Complete each line at a curated middlegame target with a new-exercise action and three brief, position-specific plans for what the trained side should do next. Do not use the target summary to recap moves that have already been played.
- Every published move-history cell links to the exact position in the Lichess board editor, preserving the full FEN and using the trained side as the board orientation.
- Persist versioned statistics in `localStorage`. Keep progress statistics and the reset control present in every state.

## Repertoire and evaluation rules

- Prefer practical, coherent plans over a theoretically best move that conflicts with the repertoire's intended style.
- Catalan, Sicilian, and Grünfeld moves remain source-bound to the internal source studies. User-facing descriptions, hints, explanations, goals, and messages must stand on their own and must never mention a study, Lichess, a source line, or source documentation.
- The Sicilian repertoire prefers the normal `...d6` Dragon whenever White permits it. Do not expose accelerated or hyperaccelerated Dragon move orders as opponent variations.
- Store every Stockfish score in centipawns from White's perspective. Display that same sign everywhere: positive favours White and negative favours Black, regardless of the trained side.
- Every curated position has a committed Stockfish 18 depth-18 evaluation. Current-position and move-history scores use the same White-perspective convention.
- Every recorded or automatically reordered position must evaluate to at least `-1.00` for the trained side. Prune automatically generated paths that fail this threshold.
- Any repertoire expansion must update legality tests so every complete path is legal and reaches a target.

## UI and content rules

- All user-facing copy, source identifiers, and filenames are English or language-neutral.
- Never use an em dash. Use an ASCII hyphen with surrounding spaces for punctuation.
- Keep established hyphenated names such as `Smith-Morra` from wrapping at the hyphen.
- Preserve the icy-sea palette and the standard readable chess pieces.
- Use `public/coomate-logo.png` in the header and `public/coomate-tab-icon.png` for browser icons.
- Preserve real header-logo transparency and keep Next Image optimization disabled for it.
- Desktop fits the board, header, and active panel in the viewport. Long menus scroll inside the panel.
- Variation-card copy, frequency, and notation stay inside the card at every width.
- At single-column breakpoints, starting a variation returns the page to the board. Feedback and completion appear immediately below it.
- On mobile completion, bring the target summary and new-exercise action into view.
- Preserve keyboard accessibility, visible status messaging, and reduced-motion behavior.

## Architecture map

- `src/components/OpeningTrainer.tsx`: session orchestration and responsive trainer UI.
- `src/data/*-repertoire.ts`: the three curated move trees.
- `src/data/*-variants.ts`: opponent variations and displayed frequencies.
- `src/data/training-goals.ts`: target-position teaching content.
- `src/data/stockfish-evaluation.ts`: shared static-evaluation metadata.
- `src/data/*-evaluations.ts`: opening-specific committed Stockfish scores.
- `src/lib/repertoire-engine.ts`: repertoire graphs, path filtering, SAN helpers, and weighted choices.
- `src/lib/storage.ts`: versioned local statistics and migrations.
- `src/lib/types.ts`: shared domain types.
- `src/app/globals.css`: application theme and responsive layout.

## Repository hygiene

- Never commit credentials, `.env` files, private keys, local absolute paths, IDE state, build output, caches, or user data.
- `next-env.d.ts` is generated and intentionally ignored.
- Keep `.next`, `node_modules`, coverage output, `.idea`, logs, and `*.tsbuildinfo` untracked.
- Preserve unrelated user changes and avoid broad rewrites when a focused edit is sufficient.

## Verification

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

For UI changes, verify the affected state in a real browser at desktop and mobile widths. For training-flow changes, test one correct move, one legal move outside the repertoire, and line completion when relevant.

When repertoire data changes, audit all three repertoires with an official Stockfish binary:

```bash
node scripts/audit-repertoires.mjs /path/to/stockfish 18 --group=all --summary
```

If allowlisted move-order generation changes, audit additional positions too:

```bash
node scripts/audit-repertoires.mjs /path/to/stockfish 18 --group=all --reordered-only
```
