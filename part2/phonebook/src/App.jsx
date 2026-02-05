import { useState, useEffect } from 'react'
import Content from './Content'
import SearchFilter from './SearchFilter'
import Form from './Form'
import personService from './services/persons'

const App = () => {
    const [persons, setPersons] = useState([])

useEffect(() => {
  personService
    .getAll('http://localhost:3001/persons').then(initialPeople => {
      setPersons(initialPeople);
      console.log(persons);
    })
}, [])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setNewFilter] = useState('')
  const filtered = persons.filter(({name}) => name.toLowerCase().includes(filterName.trim().toLowerCase()));
const handleInputName = (event) => {
  setNewName(event.target.value)
}
const handleInputNumber = (event) => {
  setNewNumber(event.target.value)
}
const handleInputFilter = (event) => {
  setNewFilter(event.target.value)
}
const handleSubmitButton = (event) => {

event.preventDefault();
  if (persons.some(person => person.name === newName) === true) {
     alert(`${newName} is already added to phonebook`)
  }

  else {
      const newPerson = {
    name: newName,
    number: newNumber
  }
    personService.create(newPerson).then(returnedPerson => {
    setPersons(persons.concat(returnedPerson))
  }) 
}
}

const handleDeleteButton = (person) => {
  console.log(person);
 if (window.confirm(`Delete ${person.name}?`)) {
    personService.deletePerson(person.id).then(returnedPerson => {
    setPersons(persons.concat(returnedPerson))
  }) 
  } else {
    "okay"
  }
}
  return (
    <div>
      <h2>Phonebook</h2>
      <SearchFilter filtername={filterName} handleInputFilter={handleInputFilter} />
      <Form valueName={newName} onChangeName={handleInputName} valueNumber={newNumber} onChangeNumber={handleInputNumber} submitButton={handleSubmitButton} />
      <h2>Numbers</h2>
      <Content filterName={filterName} persons={persons} filtered={filtered} deleteButton={handleDeleteButton} />
    </div>
  )
}

export default App