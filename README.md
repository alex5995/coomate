# CooMate

A compact chess repertoire trainer covering three fixed-role repertoires:

- **Catalan:** always play White.
- **Sicilian:** always play Black with the normal Dragon when White permits it, plus practical Alapin, Closed, Moscow, Smith-Morra and Bowdler responses.
- **Grünfeld:** always play Black against the main `3.Nc3` and `3.Nf3` systems.

The home screen lets you choose a repertoire and an explicit opponent variation. Board orientation and the controlled side update automatically.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Controls and behaviour

- Move pieces by dragging them or by selecting the source and destination squares.
- Equivalent positions share curated continuations across move-order transpositions.
- Variation cards are ordered by approximate frequency. Random selection remains uniform across all cards.
- A legal move outside the repertoire is immediately undone. The first error gives a hint; the second reveals the accepted continuations.
- After a correct move, one consolidated message shows the explanation, theoretical alternatives, the opponent's automatic reply and the next task.
- Every position shows a committed Stockfish 18 evaluation from White's perspective. Positive scores favour White and negative scores favour Black, regardless of the side being trained.
- Stockfish is not loaded at runtime. Every recorded or automatically reordered position remains within the repertoire safety threshold for the trained side.
- Progress is saved only in browser `localStorage`.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
git diff --check
```

Repertoire authors can run the offline Stockfish audit with:

```bash
node scripts/audit-repertoires.mjs /path/to/stockfish 18 --group=all --summary
```

The Stockfish binary is an authoring dependency only and is never bundled with the application.
