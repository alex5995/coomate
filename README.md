# CooMate

A compact chess repertoire trainer covering eight fixed-role repertoires:

- **Catalan:** always play White using the curated source-study lines.
- **Sicilian:** always play Black with the normal Dragon when White permits it, plus studied Alapin, Closed, Moscow, Smith-Morra and Bowdler responses.
- **Grünfeld:** always play Black against the studied `3.Nc3` and `3.Nf3` systems.
- **Caro-Kann:** always play Black against White's main choices.
- **London System:** always play White against Black's main replies.
- **Universal Slav:** always play Black against `1.d4`, the English, the Réti and flank openings; the computer never begins with `1.e4`.
- **Nimzo-Larsen System - White:** always play White beginning with `1.b3`, followed by `Bb2` and `e3`.
- **Nimzo-Larsen System - Black:** always play Black with the reversed `...b6`, `...Bb7` and `...e6` setup.

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
- Catalan training is restricted to [The Basic Catalan Opening study](https://lichess.org/study/DckpgOgd), including Open, Closed, Slav, Tarrasch, Anti-Nimzo, Marshall, Hungarian, Albin and Neo-Catalan chapters.
- Sicilian training uses the normal Dragon from the [Sicilian Dragon study](https://lichess.org/study/AvqP0tL1). Accelerated versions are intentionally omitted. Alapin and Closed Sicilian coverage keeps the prefixes from the [secondary Sicilian study](https://lichess.org/study/jsSks17H), then uses documented continuations from the [Alapin study](https://lichess.org/study/cA3kOR92) and [Dragon anti-Sicilian study](https://lichess.org/study/72rdAVHd). Moscow and Smith-Morra use the [Anti-Sicilians study](https://lichess.org/study/AsIsKPrX), while Bowdler uses its documented [Dragon-style response study](https://lichess.org/study/ulZswGf8). The Closed menu includes `f4`, `Nge2` and a normal-Dragon transposition after `Nf3` and `d4`.
- Grünfeld training is restricted to [The Grünfeld Defense study](https://lichess.org/study/0AUYoSOH), covering the study's Exchange, no-exchange, bishop-pin and `3.Nf3` branches.
- London System training covers classical `…e6/…Bd6`, early `…c5/…Qb6`, `…g6`, `…c6`, mirrored `…Bf5`, `…b6`, `…Nc6`, `…Bg4` and `…Nh5`. White keeps a flexible d4, Nf3, Bf4 and e3 core with c3, Nbd2, natural development and kingside castling.
- The Universal Slav repertoire can begin with `1.d4`, `1.c4`, `1.Nf3`, `1.b3` or `1.g3`. It contains 38 audited lines covering the Main Slav, London, Jobava, Colle/Zukertort, Veresov, English, Réti and flank systems.
- In the Black Slav lines, `…e6` is never suggested before the light-squared bishop has developed or been exchanged.
- The Nimzo-Larsen White repertoire follows the video's `b3`, `Bb2` and `e3` core. When available, White uses `Bb5` and `Bxc6` to remove a knight, then `f4`, `Nf3` and castling to control e5. If `Bb5` or `f4` is unavailable, the setup adapts without forcing the motif.
- The Nimzo-Larsen Black repertoire reverses the same ideas with `...b6`, `...Bb7` and `...e6`. Black may use `...Bb4` and `...Bxc3`, then `...f5`, `...Nf6` and castling to control e4, or challenge the centre with `...c5` and `...d5` when the standard plan is unavailable.
- Every training position shows a committed Stockfish 18 evaluation from the user's perspective, including a score beside every White and Black move in history. The engine is not loaded at runtime. Every recorded position is kept at `-1.00` or better for the trained side at depth 18.
- Equivalent positions share curated continuations across move-order transpositions. Compatible moves for your side come from the full opening repertoire, while the computer remains inside the opponent variation you selected.
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

Repertoire authors can run the offline Stockfish audit with:

```bash
node scripts/audit-repertoires.mjs /path/to/stockfish 18 --group=all --summary
```

The Stockfish binary is an authoring dependency only and is never bundled with the application.
