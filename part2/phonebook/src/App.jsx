import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')
const handleInputChange = (event) => {
  console.log(event.target.value)
  setNewName(event.target.value)
}

const handleSubmitButton = (event) => {
event.preventDefault();
  setPersons([...persons, {name: newName}]);

}
  console.log(persons, "here");
  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={handleInputChange} />
        </div>
        <div>
          <button type="submit" onClick={handleSubmitButton}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
        {persons.map((person, index) => <li key={index}>{person.name}</li>)}
    </div>
  )
}

export default App