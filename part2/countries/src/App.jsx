import { useEffect, useState } from 'react'
import countriesService from './services/countries'
import SearchFilter from './components/SeachFilter'
import Content from './components/Content'

function App() {
const [countries, setCountries] = useState([])
const [filteredName, setFilteredName] = useState('')
console.log(countriesService);
useEffect(() => {
  countriesService
    .getAll().then(initialCountries => {
      setCountries(initialCountries);
    }).catch(error => {
      console.log(error);
    })
}, [])

const handleInputFilter = (e) => {
  setFilteredName(e.target.value);
}
const filtered = countries.filter(country => country.name.common.toLowerCase().includes(filteredName.trim().toLowerCase()));

  return (
    <>
    <h2>Countries</h2>
    <SearchFilter filtername={filteredName} handleInputFilter={handleInputFilter} />
    <Content filtered={filtered} />
    </>
  )
}

export default App
