# CooMate Agent Guide

## Maintenance rule

Treat this file as living project documentation. Update `AGENTS.md` in the same change whenever a task introduces or changes a durable product rule, architectural convention, repertoire preference, UI pattern, verification command, or repository constraint.

Keep it concise and current. Record final decisions only - do not append a chronological history, temporary debugging notes, or rejected approaches.

## Product

CooMate is an English-language chess opening trainer built with Next.js App Router, React, and TypeScript.

The app contains three fixed-role repertoires:

- Caro-Kann Defence: the user always plays Black and the computer always plays White.
- Jobava London: the user always plays White and the computer always plays Black.
- Universal Slav System: the user always plays Black against non-`1.e4` openings. White may begin with `1.d4`, `1.c4`, `1.Nf3`, `1.b3`, or `1.g3`, but never `1.e4`.

The goal is practical opening training through curated middlegame positions, not engine analysis.

## Training behavior

- Use `chess.js` as the source of truth for legal moves, FEN, SAN, history, and undo behavior.
- Use `react-chessboard` for board interaction. Support drag-and-drop, square selection, mouse, and touch.
- Repertoire data must remain separate from the UI. Extend the typed repertoire and variant data instead of hardcoding chess knowledge in components.
- The computer may only choose moves present in the selected curated repertoire. Do not add Stockfish, free move generation, a backend, accounts, or external runtime calls.
- The home flow first asks which repertoire to train, then which explicit opponent variation to practise.
- Opponent variations must be visible as separate menu entries. Multiple theoretical moves for the user's side remain accepted alternatives inside a variation.
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
- In Black repertoires, do not trap the light-squared bishop behind an early `...e6`. Develop or exchange that bishop first unless a specifically curated exception is deliberately documented.
- Caro-Kann Advance coverage must include common White choices such as `c3`, `Nf3`, `Nc3`, `h4`, and `dxc5`, including both defended-center and capture lines.
- Caro-Kann Classical coverage should retain the practical `...Nf6` knight-development and exchange proposal as well as curated bishop-development alternatives.
- Jobava lines must include its aggressive ideas. In particular, when Black develops the light-squared bishop to `f5`, relevant `f3` and `g4` pawn-expansion plans must not be rejected merely because a quieter line is also theoretical.
- Universal Slav lines must cover the major `1.d4`, English, Reti, and flank-opening families while preserving the light-squared-bishop rule above.
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
- At single-column breakpoints, starting a variation must return the page to the board. Progress, move feedback, alternatives, and the completion summary must appear immediately below the board rather than being hidden below the full side panel.
- On mobile completion, automatically bring the target summary and new-exercise action into view. Keep move history and statistics available below.
- Preserve essential keyboard accessibility, visible status messaging, and reduced-motion behavior.

## Architecture map

- `src/components/OpeningTrainer.tsx`: session orchestration and responsive trainer UI.
- `src/data/*-repertoire.ts`: curated move trees.
- `src/data/*-variants.ts` and `src/data/trainer-variants.ts`: user-selectable opponent variations and displayed frequencies.
- `src/data/training-goals.ts`: target-position teaching content.
- `src/lib/repertoire-engine.ts`: repertoire traversal, candidate selection, SAN helpers, and weighted computer choices.
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
