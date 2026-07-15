# CooMate

A compact chess repertoire trainer covering three fixed-role repertoires:

- **Caro-Kann:** always play Black against White's main choices.
- **Jobava London:** always play White against Black's main replies.
- **Universal Slav:** always play Black against `1.d4`, the English, the Réti and flank openings; the computer never begins with `1.e4`.

The home screen lets you choose a repertoire. Board orientation and the controlled side update automatically.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Controls and behaviour

- Move pieces by dragging them or by selecting the source and destination squares.
- Choose an explicit opponent variation before every exercise. Caro-Kann Advance training distinguishes `dxc5`, `c3`, `Nf3`, `Nc3` and `h4`; Classical `Nc3/Nd2`, Exchange `Bd3/Nf3`, Panov, Fantasy and Two Knights are included too.
- Jobava training covers `…e6`, `…Bf5`, `…c5`, `…c6`, `…g6`, `…a6`, `…Nc6`, `…Nbd7` and an Indian setup. White follows practical plans with `Nc3`, `Bf4`, `e3/e4`, kingside attacks or pressure on `c7` according to the position.
- The Universal Slav repertoire can begin with `1.d4`, `1.c4`, `1.Nf3`, `1.b3` or `1.g3`. It contains 30 lines covering the Main Slav, London, Jobava, Colle/Zukertort, Veresov, English, Réti and flank systems.
- In the Black Slav lines, `…e6` is never suggested before the light-squared bishop has developed or been exchanged.
- Every curated continuation for your side remains playable inside the selected opponent line.
- Variation cards are ordered by approximate frequency. Random variation selection remains uniformly distributed across all cards.
- On desktop, the board fits the available height and long menus scroll internally without moving the whole page.
- A legal move outside the repertoire is immediately undone. The first error gives a hint; the second reveals the accepted continuations on the board.
- When several theoretical replies exist, you can return to the previous position and try another one.
- After a correct move, one consolidated message shows the result, theoretical alternatives and the opponent's automatic reply.
- Progress is saved only in browser `localStorage`. Statistics from the previous Caro Lab version are migrated automatically.

## Verification

```bash
npm test
npm run lint
npm run typecheck
npm run build
```
