# myPantry

**Autore:** Marco Dal Pian  
**Email:** [marco.dalpian@studio.unibo.it](mailto:marco.dalpian@studio.unibo.it)  
**Matricola:** 0000892947  

---

## Indice
- [Descrizione](#descrizione)
- [Funzionalità principali](#funzionalità-principali)
  - [Autenticazione](#autenticazione)
  - [Dispensa Personale](#dispensa-personale)
  - [Database Pubblico](#database-pubblico)
  - [Scanner codice a barre](#scanner-codice-a-barre)
  - [Ricerca nella dispensa](#ricerca-nella-dispensa)
  - [Gestione rete](#gestione-rete)
  - [Refresh delle schermate](#refresh-delle-schermate)
- [Struttura Tecnica](#struttura-tecnica)
- [Requisiti](#requisiti)
- [Installazione](#installazione)
- [Licenza](#licenza)

---

## Descrizione
**myPantry** è un’applicazione mobile che permette agli utenti di:
- Salvare i prodotti acquistati nella propria **Dispensa Personale**.
- Contribuire alla costruzione di un **Database Pubblico** basato sui codici a barre.

L’app è stata sviluppata con **Expo** (framework React Native) usando **JavaScript**.

---

## Funzionalità principali

### Autenticazione
- **Login:** email + password  
- **Registrazione:** username + email + password  
- **Salvataggio credenziali** (opzionale) in SQLite

**Schermate:**  
![Login](./screenshots/login.png)  
![Registrazione](./screenshots/registrazione.png)

### Dispensa Personale
- Visualizzazione dei prodotti salvati  
- Rimozione dei prodotti con conferma  
- Ricerca locale tramite barra di ricerca  

**Schermata:**  
![Dispensa](./screenshots/dispensa.png)

### Database Pubblico
- Ricerca prodotti tramite **codice a barre**  
- Votazione positiva/negativa  
- Aggiunta di nuovi prodotti non presenti

**Schermata Ricerca:**  
![Ricerca](./screenshots/ricerca.png)

**Esempio chiamata API:**  
```javascript
fetch('https://lam21.iot-prism-lab.cs.unibo.it/products?barcode=' + barcode, {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + contesto.token },
});
```

**Esempio salvataggio locale SQLite:**  
```javascript
const Aggiungi = async (nome, descrizione) => {
    try {
        await db.transaction(async(tx) => {
            await tx.executeSql(
                'INSERT INTO products (nome, descrizione, email) VALUES (?,?,?)',
                [nome, descrizione, contesto.email],
                (txObj, resultSet) => {
                    console.log(resultSet + "\n   ^\n   |\nAggiunto alla dispensa privata.");
                    setModalVisible2("Prodotto aggiunto alla tua dispensa.", false);
                }
            );
        });
    } catch (error) {
        console.log(error);
    }
};
```

### Scanner codice a barre
- Uso della libreria `expo-barcode-scanner`
- Richiesta permessi fotocamera

**Codice esempio:**  
```javascript
import { BarCodeScanner } from 'expo-barcode-scanner';

<BarCodeScanner
    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
    style={StyleSheet.absoluteFillObject}
/>
```

### Ricerca nella dispensa
**Filtro prodotti:**  
```javascript
function Filter(search) {
    if (search !== '') {
        let filtroD = [];
        let resultsD = [];
        const results = nomi.filter((nome) => {
            filtroD.push(nome.toLowerCase().includes(search.toLowerCase()));
            return nome.toLowerCase().includes(search.toLowerCase());
        });
        for (let i = 0; i < filtroD.length; i++) {
            if (filtroD[i] === true) {
                resultsD.push(descrizioni[i]);
            }
        }
        setFiltered(results);
        setFilteredD(resultsD);
    } else {
        setFiltered(nomi);
        setFilteredD(descrizioni);
    }
}
```

### Gestione rete
**Controllo connessione internet:**  
```javascript
import * as Network from 'expo-network';

const logout0 = async () => {
    const rete = await Network.getNetworkStateAsync();
    if (rete["isInternetReachable"] === true) {
        contesto.logout();
    } else {
        setModalVisible(!modalVisible);
    }
};
```

### Refresh delle schermate
- Pull-to-refresh in **Dispensa** e **Profilo**
- Aggiornamento dinamico prodotti e conteggio elementi

---

## Struttura Tecnica
- **Frontend:** React Native + Expo
- **Database locale:** SQLite
- **Gestione stato globale:** Context API (token, email, logout)

---

## Requisiti
- **Node.js** + **npm/yarn**
- **Expo CLI**
- Dispositivo o emulatore con **Android** o **iOS**

---

## Installazione
```bash
git clone <repository-url>
cd myPantry
npm install
expo start
```

---

## Licenza
Progetto sviluppato a scopo didattico.
