import axios from 'axios'
const baseUrl = 'http://localhost:3002/persons'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const changeNumber = (personId, newPersonNumber) => {
  const request = axios.put(baseUrl + '/'+ personId, newPersonNumber)
  return request.then(response => response.data)
}

const deletePerson = person => {
  console.log(person);
  const request = axios.delete(baseUrl + '/' + person);
  return request.then(response => response.data)
}

export default { getAll, create, deletePerson, changeNumber }