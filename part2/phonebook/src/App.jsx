import { useState, useEffect } from 'react'
import Content from './Content'
import SearchFilter from './SearchFilter'
import Notification from './Notification'
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
  const [messageError, setMessageError] = useState(null)
  const [messageSuccess, setMessageSuccess] = useState(null)

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
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const existing = persons.find(p => p.name === newName);
         const newPersonNumber = {
    ...existing,
    number: newNumber
  }

    personService.changeNumber(existing.id, newPersonNumber).then((returned) => {
    setPersons(prev => prev.map(p => p.id !== returned.id ? p : returned))
    setMessageSuccess(`Added new number ${newNumber} to ${newName}`)
    setTimeout(() => {
          setMessageSuccess(null)
        }, 3000)
  }) 
    .catch(() => {
        setMessageError(
          `'${existing.name}' was already removed from server`
        )
         setTimeout(() => {
          setMessageError(null)
        }, 3000) 
      })
        
  } else {
    "Cancel"
  }
  }

  else {
      const newPerson = {
    name: newName,
    number: newNumber
  }
    personService.create(newPerson).then(returnedPerson => {
setPersons(prev => prev.concat(returnedPerson))
    setMessageSuccess(`Added ${newName}`)
   setTimeout(() => {
          setMessageSuccess(null)
        }, 3000)
  }) 
}
}

const handleDeleteButton = (person) => {
  console.log(person.id);
 if (window.confirm(`Delete ${person.name}?`)) {
    personService.deletePerson(person.id)
    .then(() => {
    setPersons(prev => prev.filter(p => p.id !== person.id))
  })
  .catch(() => {
        setMessageError(
          `'${person.name}' was already removed from server`
        )
            setTimeout(() => {
          setMessageError(null)
        }, 3000)
      }) 
     
  } else {
    "Cancel"
  }
}
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification messageSuccess={messageSuccess} messageError={messageError} />
      <SearchFilter filtername={filterName} handleInputFilter={handleInputFilter} />
      <Form valueName={newName} onChangeName={handleInputName} valueNumber={newNumber} onChangeNumber={handleInputNumber} submitButton={handleSubmitButton} />
      <h2>Numbers</h2>
      <Content filterName={filterName} persons={persons} filtered={filtered} deleteButton={handleDeleteButton} />
    </div>
  )
}

export default App