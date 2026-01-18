# Appunti Full Stack Open (Università di Helsinki)
_Parte 0-1: HTTP, React, JavaScript basics, state ed event handling_

> Questi appunti riassumono i concetti introdotti nel corso, con qualche chiarimento dove utile.

---

## 1) HTTP: come comunica il browser con il server

Browser e server comunicano tramite il **protocollo HTTP**. Nella tab **Network** dei DevTools puoi osservare tutte le richieste fatte dal browser e le risposte del server.

### 1.1 Caricamento di una pagina: HTML, immagini, CSS e JS

Aprendo una pagina (esempio: `https://studies.cs.helsinki.fi/exampleapp/`), succede tipicamente questo:

1. Il browser fa una **HTTP GET** per ottenere il documento **HTML**.
2. Il server risponde con l’HTML.
3. Il browser legge l’HTML e scopre che servono altre risorse (immagini, CSS, JavaScript).
4. Per ogni risorsa esterna, il browser fa altre richieste **HTTP GET**.
5. Il server risponde con la risorsa richiesta.

Nota:
- Il server può anche generare l’HTML **dinamicamente** in base al codice dell’applicazione, ma il flusso richieste/risposte rimane lo stesso.

### 1.2 Caso più completo: HTML + CSS + JS + JSON

In un caso più realistico (pagina con stylesheet, script e dati):

1. **GET HTML**
2. L’HTML include CSS:
   - inline (tag `<style>...</style>`) oppure
   - esterno (link a un file `.css`), quindi il browser fa una **GET** anche per il CSS
3. L’HTML include JavaScript esterno, quindi il browser fa una **GET** anche per il file `.js`
4. Eseguendo il JavaScript, il browser può fare ulteriori richieste (ad esempio una **GET** che restituisce **JSON**)
5. Quando arrivano i dati JSON, il codice (event handler o funzioni chiamate dallo script) aggiorna la pagina, ad esempio renderizzando una lista di note

---

## 2) Invio di un form: POST e redirect (302)

Quando invii un form (esempio: “new note”), spesso in Network vedi più richieste.

### 2.1 Sequenza tipica

1. Il browser fa una **HTTP POST** all’endpoint indicato dal form (es. `/new_note`).
2. Il server risponde con **302** (redirect).
   - 302 indica un reindirizzamento: il server dice al browser di fare una nuova richiesta verso un URL diverso.
   - L’URL di destinazione è nell’header **`Location`**.
3. Il browser fa una nuova **HTTP GET** verso l’URL indicato in `Location`.
4. Ricaricando la pagina, il browser ripete le richieste per le risorse necessarie:
   - CSS
   - JavaScript
   - eventuale JSON (es. `data.json`)

### 2.2 Dove vedere i dati inviati

Aprendo la richiesta POST in Network, nel **payload** (o “Form Data”) puoi vedere i valori inviati dal form.

### 2.3 `action` e `method` del form

Nel tag `<form>`:
- `action` = l’URL a cui inviare i dati
- `method` = il metodo HTTP usato (tipicamente `POST` o `GET`)

### 2.4 Lato server (idea generale)

Il server riceve la richiesta, legge i dati dal body (ad esempio `req.body` in Express), aggiorna la struttura dati (per esempio un array `notes`) e spesso risponde con un redirect per tornare alla pagina principale.

---

## 3) JSX e React: JSX non è HTML

In React sembra che i componenti “ritornino HTML”, ma in realtà ritornano **JSX**:

- assomiglia a HTML
- è “XML-like”
- viene trasformato (compilato) in JavaScript dalla toolchain (con Vite avviene automaticamente)

Esempio in JSX:

```jsx
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

  console.log(now, a + b)

  return (
    <div>
      <p>Hello world, it is {now.toString()}</p>
      <p>
        {a} plus {b} is {a + b}
      </p>
    </div>
  )
}
```

Sotto al cofano, JSX viene trasformato in chiamate a funzioni (storicamente `React.createElement(...)`, oggi spesso tramite il “JSX runtime”). Un esempio semplificato in stile `createElement`:

```js
const App = () => {
  const now = new Date()
  const a = 10
  const b = 20

  return React.createElement(
    'div',
    null,
    React.createElement('p', null, 'Hello world, it is ', now.toString()),
    React.createElement('p', null, a, ' plus ', b, ' is ', a + b)
  )
}
```

---

## 4) Regole e dettagli pratici di JSX

### 4.1 Ogni tag deve essere chiuso

JSX richiede tag chiusi:

- In HTML alcune forme non chiuse possono “funzionare”, ma in JSX no.
- Esempio: in JSX devi scrivere `<em />` oppure `<em></em>`.

### 4.2 Un solo elemento root

Un componente deve ritornare **un singolo elemento root**:

✅ OK:

```jsx
return (
  <div>
    <h1>Title</h1>
    <p>Text</p>
  </div>
)
```

Se non vuoi aggiungere un `<div>` extra nel DOM, usa un **Fragment**:

```jsx
return (
  <>
    <h1>Title</h1>
    <p>Text</p>
  </>
)
```

### 4.3 Componenti, riuso e props

- Puoi definire componenti e usarli dentro altri componenti quante volte vuoi.
- Puoi passare dati ai componenti con le **props**.
- Il nome del componente deve iniziare con lettera **maiuscola**.

---# Appunti Full Stack Open (continuazione)
_State, rendering, gestione di oggetti e array, regole degli Hook, event handling avanzato_

---

## 1) Un cambio di stato causa re-render

Rivediamo il flusso di base di un’app React.

Quando l’applicazione viene inizializzata, il componente `App` viene **eseguito**. Dentro `App`:

- viene chiamato `useState` per creare lo stato dell’app
- il valore di stato viene mostrato a schermo tramite JSX
- vengono renderizzati componenti figli (es. `Display`, `Button`)
- ai bottoni vengono passati degli **event handler** (funzioni) che cambiano lo stato

Quando clicchi un bottone:

1. React esegue l’event handler
2. l’event handler chiama `setCounter(...)` (o un altro setter di stato)
3. React pianifica un aggiornamento di stato e fa il **re-render**
4. `App` viene rieseguito
5. i componenti figli ricevono nuove props e la UI si aggiorna

Esempio (concettuale):

- valore iniziale `counter = 0`
- clic su “plus” -> `setCounter(1)`
- `App` viene rieseguito e `Display` mostra `1`

---

## 2) Complex state: più pezzi di stato

Se la UI ha più informazioni indipendenti, puoi usare `useState` più volte.

Esempio con due contatori separati:

```jsx
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>left</button>
      <button onClick={() => setRight(right + 1)}>right</button>
      {right}
    </div>
  )
}
```

Il componente ha accesso a `setLeft` e `setRight`, che aggiornano due parti di stato diverse.

---

## 3) Salvare più valori in un singolo oggetto (e perché può complicare)

Lo stato può essere di qualunque tipo. Potresti rappresentare lo stesso scenario con un oggetto:

```js
{
  left: 0,
  right: 0
}
```

Esempio completo:

```jsx
const App = () => {
  const [clicks, setClicks] = useState({ left: 0, right: 0 })

  const handleLeftClick = () => {
    const newClicks = {
      left: clicks.left + 1,
      right: clicks.right,
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = {
      left: clicks.left,
      right: clicks.right + 1,
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}
```

Qui lo stato è “uno solo”, ma ogni update richiede di copiare anche i campi che non cambiano. È facile rendere il codice più verboso del necessario.

### 3.1 Object spread per aggiornare uno stato-oggetto

Per aggiornare “solo una proprietà” mantenendo le altre, usa lo **spread**:

```jsx
const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })
```

- `{ ...clicks }` crea un nuovo oggetto copiando tutte le proprietà
- specificando una proprietà dopo lo spread (es. `right: ...`) la sovrascrivi con il nuovo valore

Esempio:

```js
{ ...clicks, right: clicks.right + 1 }
```

crea una copia di `clicks` dove `right` è incrementato di 1.

### 3.2 Perché non mutare lo stato direttamente

Questo è sconsigliato:

```js
const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```

Anche se “sembra funzionare”, mutare direttamente lo stato può causare comportamenti strani e bug difficili da debuggare. In React, aggiorni lo stato creando un **nuovo oggetto** (o un nuovo array).

### 3.3 Nota pratica: oggetto unico vs stati separati

In questa app specifica, mettere tutto in un solo oggetto non porta vantaggi e rende il codice più complesso. Due `useState` separati hanno più senso.

---

## 4) Handling arrays: tenere traccia della storia dei click

Aggiungiamo uno stato `allClicks` che registra ogni click:

```jsx
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}

      <p>{allClicks.join(' ')}</p>
    </div>
  )
}
```

- `allClicks` parte da array vuoto: `useState([])`
- `concat` crea **un nuovo array**, non muta quello esistente
- `join(' ')` unisce gli elementi in una stringa separata da spazi

### 4.1 Perché non usare `push`

Questo è sconsigliato:

```js
const handleLeftClick = () => {
  allClicks.push('L')
  setAll(allClicks)
  setLeft(left + 1)
}
```

`push` muta l’array esistente. Anche se a prima vista sembra ok, può creare bug inaspettati.

---

## 5) Aggiornare lo stato è asincrono (e può “laggare” di 1)

Espandiamo l’app aggiungendo `total`:

```jsx
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
    setTotal(left + right)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
    setTotal(left + right)
  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}

      <p>{allClicks.join(' ')}</p>
      <p>total {total}</p>
    </div>
  )
}
```

Problema: `total` non mostra il valore atteso, spesso “rimane indietro” di 1.  
Motivo: gli aggiornamenti di stato (`setLeft`, `setRight`) non cambiano `left/right` **immediatamente** dentro la stessa esecuzione dell’handler. React applica gli update e poi fa re-render.

### 5.1 Fix: calcolare un valore aggiornato localmente

```jsx
const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  const updatedLeft = left + 1
  setLeft(updatedLeft)
  setTotal(updatedLeft + right)
}
```

E per il destro:

```jsx
const handleRightClick = () => {
  setAll(allClicks.concat('R'))
  const updatedRight = right + 1
  setRight(updatedRight)
  setTotal(left + updatedRight)
}
```

### 5.2 Nota pratica (utile in React): functional updates

Un approccio robusto è usare la forma “funzione” dei setter, che legge sempre lo stato più aggiornato:

```jsx
setLeft(prev => prev + 1)
setAll(prev => prev.concat('L'))
```

Questo aiuta quando ci sono update multipli ravvicinati.

---

## 6) Conditional rendering: componente `History`

Possiamo gestire il rendering della storia click con un componente dedicato:

```jsx
const History = (props) => {
  if (props.allClicks.length === 0) {
    return <div>the app is used by pressing the buttons</div>
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}
```

Uso dentro `App`:

```jsx
const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}

      <History allClicks={allClicks} />
    </div>
  )
}
```

Qui `History` mostra output diverso a seconda dello stato: questo è **conditional rendering**.

---

## 7) Refactor: componente `Button`

```jsx
const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)
```

Esempio completo:

```jsx
const History = (props) => {
  if (props.allClicks.length === 0) {
    return <div>the app is used by pressing the buttons</div>
  }

  return (
    <div>
      button press history: {props.allClicks.join(' ')}
    </div>
  )
}

const Button = ({ onClick, text }) => (
  <button onClick={onClick}>{text}</button>
)

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
  }

  return (
    <div>
      {left}
      <Button onClick={handleLeftClick} text="left" />
      <Button onClick={handleRightClick} text="right" />
      {right}

      <History allClicks={allClicks} />
    </div>
  )
}
```

---

## 8) Regole degli Hook

Gli Hook (come `useState`) hanno regole precise:

- chiamali **solo** nel top-level di un componente React
- non chiamarli dentro:
  - loop
  - conditionals
  - funzioni annidate
- chiamali sempre nello stesso ordine ad ogni render

In pratica: `useState` e simili devono stare nel corpo del componente, non dentro `if` o `for`.

---

## 9) Event handling revisited: l’handler deve essere una funzione

Partiamo da questa app:

```jsx
const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      {value}
      <button>reset to zero</button>
    </div>
  )
}
```

Vogliamo che il bottone resetti `value`.

### 9.1 Errori comuni

Esempio sbagliato: passi un numero (non una funzione)

```jsx
<button onClick={value + 1}>button</button>
```

Esempio sbagliato: fai un assignment (non una funzione)

```jsx
<button onClick={value = 0}>button</button>
```

Esempio ingannevole:

```jsx
<button onClick={console.log('clicked the button')}>
  button
</button>
```

Qui `console.log(...)` viene eseguito durante il render e `onClick` riceve `undefined`.

Altro errore:

```jsx
<button onClick={setValue(0)}>button</button>
```

`setValue(0)` viene chiamata durante il render e può causare un loop di render.

### 9.2 Corretto: passa una funzione (spesso una arrow)

```jsx
<button onClick={() => setValue(0)}>button</button>
```

Oppure definisci l’handler a parte:

```jsx
const App = () => {
  const [value, setValue] = useState(10)

  const handleClick = () => {
    console.log('clicked the button')
  }

  return (
    <div>
      {value}
      <button onClick={handleClick}>button</button>
    </div>
  )
}
```

---

## 10) Funzioni che ritornano funzioni

Puoi definire un event handler usando una funzione che **ritorna** una funzione.

Esempio:

```jsx
const App = () => {
  const [value, setValue] = useState(10)

  const hello = () => {
    const handler = () => console.log('hello world')
    return handler
  }

  return (
    <div>
      {value}
      <button onClick={hello()}>button</button>
    </div>
  )
}
```

Perché funziona?

- `hello()` viene eseguita durante il render
- ma `hello()` ritorna una funzione
- quella funzione diventa il vero handler di `onClick`

Di fatto React riceve qualcosa come:

```jsx
<button onClick={() => console.log('hello world')}>button</button>
```

### 10.1 Perché può essere utile: parametri

```jsx
const App = () => {
  const [value, setValue] = useState(10)

  const hello = (who) => {
    return () => {
      console.log('hello', who)
    }
  }

  return (
    <div>
      {value}
      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
    </div>
  )
}
```

Versione compatta:

```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

### 10.2 Stesso pattern per settare valori

```jsx
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => () => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={setToValue(1000)}>thousand</button>
      <button onClick={setToValue(0)}>reset</button>
      <button onClick={setToValue(value + 1)}>increment</button>
    </div>
  )
}
```

Nota: non è necessario usare questo pattern per casi semplici. Si può anche fare così:

```jsx
const setToValue = (newValue) => {
  console.log('value now', newValue)
  setValue(newValue)
}

<button onClick={() => setToValue(1000)}>thousand</button>
```

---

## 11) Passare event handlers ai componenti figli

Esempio: estraiamo un componente `Button`:

```jsx
const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)
```

Uso:

```jsx
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

---

## 12) Non definire componenti dentro altri componenti

Questo “sembra funzionare”, ma è una cattiva pratica:

```jsx
const App = () => {
  const [value, setValue] = useState(10)

  const Display = (props) => <div>{props.value}</div>

  return (
    <div>
      <Display value={value} />
    </div>
  )
}
```

Motivo (in breve):
- ad ogni render, `Display` viene ridefinito come “nuovo componente”
- questo può portare a problemi e comportamento inatteso, e rende più difficile ottimizzare e ragionare sul rendering

Meglio definire i componenti **fuori** dal componente principale:

```jsx
const Display = (props) => <div>{props.value}</div>

const App = () => {
  const [value, setValue] = useState(10)

  return (
    <div>
      <Display value={value} />
    </div>
  )
}
```

---


## 5) React: props e componenti

Esempio:

```jsx
const Hello = (props) => {
  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
    </div>
  )
}

const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <div>
      <h1>Greetings</h1>
      <Hello name="Maya" age={26 + 10} />
      <Hello name={name} age={age} />
    </div>
  )
}
```

### 5.1 Funzioni helper dentro un componente

In JavaScript è normale definire funzioni dentro altre funzioni (per esempio dentro un componente).

```jsx
const Hello = (props) => {
  const bornYear = () => {
    const yearNow = new Date().getFullYear()
    return yearNow - props.age
  }

  return (
    <div>
      <p>
        Hello {props.name}, you are {props.age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

---

## 6) Destructuring (props e array)

### 6.1 Destructuring delle props

Invece di usare sempre `props.name` e `props.age`, puoi destrutturare:

```jsx
const Hello = (props) => {
  const { name, age } = props
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

Oppure destrutturare direttamente nei parametri:

```jsx
const Hello = ({ name, age }) => {
  const bornYear = () => new Date().getFullYear() - age

  return (
    <div>
      <p>Hello {name}, you are {age} years old</p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}
```

### 6.2 Destructuring di array

```js
const t = [1, 2, 3, 4, 5]
const [first, second, ...rest] = t

console.log(first, second) // 1 2
console.log(rest)          // [3, 4, 5]
```

---

## 7) JavaScript: versioni, transpiling, `let` e `const`

### 7.1 ECMAScript e compatibilità

JavaScript evolve tramite lo standard **ECMAScript**. Un esempio recente è **ECMAScript 2024 (ES15)**.

Non tutte le funzionalità nuove sono disponibili su tutti i browser, quindi si usano strumenti che trasformano codice moderno in codice più compatibile (transpiler/toolchain, come Babel o trasformazioni integrate nei bundler).

### 7.2 `const`, `let` e `var`

- `const` impedisce la **riassegnazione** del binding.
- `let` permette la riassegnazione.
- `var` è una sintassi più vecchia (oggi si preferisce `let/const`).

```js
const x = 1
let y = 5

console.log(x, y) // 1 5
y += 10
console.log(x, y) // 1 15
y = 'sometext'
console.log(x, y) // 1 sometext
// x = 4          // errore
```

---

## 8) Array: `push`, `forEach`, `concat`, `map`

```js
const t = [1, -1, 3]

t.push(5)

console.log(t.length) // 4
console.log(t[1])     // -1

t.forEach(value => {
  console.log(value) // 1, -1, 3, 5
})
```

Nota importante:
- Anche se `t` è `const`, l’array può essere mutato (es. `push`).
- Quello che non puoi fare è riassegnare `t` a un array diverso.

### 8.1 Immutabilità con `concat`

In React si preferisce spesso creare nuovi array invece di mutare quelli esistenti:

```js
const t = [1, -1, 3]
const t2 = t.concat(5)

console.log(t)  // [1, -1, 3]
console.log(t2) // [1, -1, 3, 5]
```

### 8.2 `map`

```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1) // [2, 4, 6]

const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)
// ['<li>1</li>', '<li>2</li>', '<li>3</li>']
```

---

## 9) Oggetti: definizione e accesso alle proprietà

Object literal:

```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
}
```

Accesso alle proprietà:

```js
console.log(object1.name) // Arto Hellas

const fieldName = 'age'
console.log(object1[fieldName]) // 35
```

Aggiungere proprietà:

```js
object1.address = 'Helsinki'
object1['secret number'] = 12341
```

Le bracket notation sono utili quando la chiave non è un identificatore valido (ad esempio contiene spazi).

---

## 10) Funzioni: arrow, declaration, expression

Arrow function:

```js
const sum = (p1, p2) => {
  return p1 + p2
}
```

Se c’è un solo parametro, puoi omettere le parentesi:

```js
const square = p => p * p
```

Ottimo con `map`:

```js
const t = [1, 2, 3]
const tSquared = t.map(p => p * p) // [1, 4, 9]
```

Function declaration:

```js
function product(a, b) {
  return a * b
}

const result = product(2, 6) // 12
```

Function expression:

```js
const average = function(a, b) {
  return (a + b) / 2
}

const result = average(2, 5) // 3.5
```

---

## 11) Metodi, `this` e perdita del contesto

Esempio con metodo:

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

arto.greet() // hello, my name is Arto Hellas
```

Se salvi una reference e la chiami separatamente, `this` può cambiare:

```js
const referenceToGreet = arto.greet
referenceToGreet() // hello, my name is undefined
```

Con `setTimeout`:

```js
setTimeout(arto.greet, 1000) // this non è arto
```

Soluzione: `bind`

```js
setTimeout(arto.greet.bind(arto), 1000)
```

Nota:
- In React con componenti funzionali e Hooks, in genere si usa poco `this` (si lavora “senza classi” nella maggior parte del codice moderno).

---

## 12) Classi (sintassi ES6)

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }

  greet() {
    console.log('hello, my name is ' + this.name)
  }
}

const adam = new Person('Adam Ondra', 29)
adam.greet()

const janja = new Person('Janja Garnbret', 23)
janja.greet()
```

---

## 13) Closures (definizione + esempio)

Una **closure** è una funzione che mantiene l’accesso alle variabili dello scope esterno anche dopo che la funzione esterna è terminata.

```js
const makeCounter = () => {
  let count = 0
  return () => {
    count += 1
    return count
  }
}

const counter = makeCounter()
counter() // 1
counter() // 2
```

---

# React: state ed event handlers

## 14) Component state con `useState`

Per rendere un componente “stateful” usiamo lo hook `useState`:

```jsx
import { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  return <div>{counter}</div>
}
```

- `counter` è il valore corrente
- `setCounter` aggiorna lo stato
- ogni update dello stato causa un **re-render**

---

## 15) Re-rendering e `setTimeout` (per capire il meccanismo)

Esempio:

```jsx
setTimeout(
  () => setCounter(counter + 1),
  1000
)
```

Chiamare `setCounter(...)` causa il re-render e il componente viene rieseguito.

Nota:
- Questo esempio serve a capire cosa succede al re-render.
- In un’app reale, i timer e gli effetti si gestiscono tipicamente con strumenti dedicati (che il corso introduce più avanti).

---

## 16) Event handling: `onClick`

Un event handler è una funzione (o reference a una funzione) chiamata quando accade un evento.

```jsx
const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <div>
      <div>{counter}</div>

      <button onClick={() => setCounter(counter + 1)}>
        plus
      </button>

      <button onClick={() => setCounter(0)}>
        zero
      </button>
    </div>
  )
}
```

### 16.1 Errore comune: invocare la funzione nel render

Sbagliato:

```jsx
<button onClick={setCounter(counter + 1)}>
```

Perché in questo modo stai chiamando `setCounter(...)` durante il render.

Corretto:

```jsx
<button onClick={() => setCounter(counter + 1)}>
```

---

## 17) Passare lo stato ai componenti figlio (lift state up)

Pratica consigliata:
- mantenere lo stato nel componente “più alto” che serve a tutti i figli
- passare i valori come props
- passare gli handler come props

Esempio:

```jsx
const Display = (props) => {
  return <div>{props.counter}</div>
}

const Button = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}

const App = () => {
  const [counter, setCounter] = useState(0)

  const increaseByOne = () => setCounter(counter + 1)
  const decreaseByOne = () => setCounter(counter - 1)
  const setToZero = () => setCounter(0)

  return (
    <div>
      <Display counter={counter} />
      <Button onClick={increaseByOne} text="plus" />
      <Button onClick={setToZero} text="zero" />
      <Button onClick={decreaseByOne} text="minus" />
    </div>
  )
}
```

### 17.1 Riassunto del flusso

1. App crea lo state con `useState`.
2. App passa `counter` e gli handler ai figli.
3. Click su un bottone -> parte l’handler -> `setCounter(...)`.
4. React fa re-render di App.
5. Display riceve nuove props e mostra il valore aggiornato.

---

