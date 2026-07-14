# Opening Lab

Mini trainer di repertorio in italiano per allenare due aperture con ruoli fissi:

- **Caro-Kann:** giochi sempre con il Nero contro le principali scelte del Bianco.
- **Jobava London:** giochi sempre con il Bianco contro le principali risposte del Nero.

La schermata iniziale permette di scegliere il repertorio; la scacchiera cambia automaticamente orientamento e lato controllato.

## Avvio

```bash
npm install
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

## Controlli

- Muovi i pezzi trascinandoli oppure selezionando casella di partenza e arrivo.
- Prima di ogni esercizio scegli una linea avversaria esplicita. Nella Caro-Kann l’Advance distingue `dxc5`, `c3`, `Nf3`, `Nc3` e `h4`; sono presenti anche Classica `Nc3/Nd2`, Exchange `Bd3/Nf3`, Panov, Fantasy e Due Cavalli.
- Nel Jobava puoi allenarti contro `…e6`, `…Bf5`, `…c5`, `…c6`, `…g6`, `…a6`, `…Nc6`, `…Nbd7` e l’impostazione Indiana di Re. Il Bianco segue piani pratici con `Nc3`, `Bf4`, `e3/e4`, attacco sul lato di Re o pressione su `c7` secondo la posizione.
- All’interno della linea avversaria selezionata, tutte le continuazioni curate per il tuo colore restano alternative liberamente giocabili.
- Le schede sono ordinate per frequenza orientativa; “Variante casuale” sceglie invece uniformemente fra tutte le schede.
- Su desktop la scacchiera si ridimensiona sull’altezza disponibile e il menu usa uno scorrimento interno, senza far scorrere l’intera pagina.
- Una mossa legale fuori repertorio viene annullata: al primo errore ricevi un indizio, al secondo le continuazioni vengono mostrate sulla scacchiera.
- Quando esistono più risposte teoriche, puoi tornare alla posizione precedente e provare un’alternativa.
- Dopo una mossa corretta, un unico feedback mostra esito, alternative teoriche e risposta automatica dell’avversario.
- I progressi sono salvati esclusivamente nel `localStorage` del browser; le statistiche create con la precedente versione Caro Lab vengono conservate.

## Verifica

```bash
npm test
npm run lint
npm run typecheck
npm run build
```
