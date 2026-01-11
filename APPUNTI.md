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
