# EventOra
Web app che permette di creare e prenotare eventi creati dagli utenti stessi.
Per la parte server è stato utilizzato **NodeJs**
Per il Database è stato utiliizato **Mysql**

## ==Avvio progetto==

Scaricare il progetto 

Installare NodeJs - https://nodejs.org/en
Installare Mysql - https://dev.mysql.com/downloads/mysql/

Andare alla cartella del progetto da termianle ed installare le dipendenze con il comando:
```
npm install
```

Nella cartella del progetto creare un file `.env` con le seguenti variabili e rispettivi valori. Es:
```
DB_HOST = '127.0.0.1'
DB_PSW = 'passwordDelDatabaseMysql'
DB_NAME = 'nomeDelDatabseMysql' 

SESSION_SECRET = 'strigaPerCodificaSessione'

SERVER_PORT = 3001
```

Andare alla cartella del progetto da termianle ed avviare il server con il comando:
```
npm run dev
```

Nella cartella `db` del progetto è presente il file `schema.sql` contenente il codice che genera il Database

## ==Descrizione==

il layout di ogni pagina è composto da 3 parti principali: 
- Header
- Sezione con contenuti
- Footer

La **HomePage** del sito presenta una sezione iniziale di presentazione del sito, per poi passare ad uno slider contenente gli eventi creati dagli utenti, presentati in ordine di creazione.
Nel caso di utente loggato, si aggiunge un'ulteriore sezione contenente gli eventi creati dall'utente stesso.

La pagina del **Profilo** dell'utente (raggiungibile una volta loggato tramite il link nell'header) presenta il resoconto di informazioni ed attività dell'utente:
- Eventi a cui è iscritto
- Eventi che ha creato

Sono presenti due tipologie di pagine di un **Evento**.
- Una pagina pubblica, che viene presentata quando o un utente non registrato vuole visualizzare un evento oppure quando un utente loggato visualizza un evento creato da qualcun'altro. In questa pagina è possibile registrarsi all'evento
- Una pagina privata, che viene presentata quando un utente loggato visualizza un suo evento. Oltre alle fornire informazioni sull'evento, questa pagina ne permette la cancellazione.

L' **Header** presenta a sinistra il nome del sito che porta alla HomePage, mentre a desta una sezione che cambia a seconda se l'utente è loggato o meno

Il **Footer** presenta link figurativi di vario genere.
