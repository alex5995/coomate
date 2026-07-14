# Caro Lab

Mini trainer in italiano per allenare la difesa Caro-Kann giocando sempre con il Nero.

## Avvio

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Controlli

- Muovi i pezzi trascinandoli oppure selezionando casella di partenza e arrivo.
- Prima di ogni esercizio scegli una linea del Bianco esplicita. L’Advance distingue `dxc5`, `c3`, `Nf3`, `Nc3` e `h4`; sono presenti anche Classica `Nc3/Nd2`, Exchange `Bd3/Nf3`, Panov, Fantasy e Due Cavalli.
- All’interno della linea bianca selezionata, le risposte teoriche del Nero restano alternative liberamente giocabili.
- Le schede sono ordinate per frequenza orientativa; “Variante casuale” sceglie invece uniformemente fra tutte le schede.
- Su desktop la scacchiera si ridimensiona sull’altezza disponibile e il menu usa uno scorrimento interno, senza far scorrere l’intera pagina.
- Una mossa legale fuori repertorio viene annullata: al primo errore ricevi un indizio, al secondo le continuazioni vengono mostrate sulla scacchiera.
- Quando esistono più risposte teoriche, puoi tornare alla posizione precedente e provare un’alternativa.
- Dopo una mossa corretta, un unico feedback mostra esito, alternative teoriche e risposta automatica del Bianco.
- I progressi sono salvati esclusivamente nel `localStorage` del browser.

## Verifica

```bash
npm test
npm run lint
npm run typecheck
npm run build
```
