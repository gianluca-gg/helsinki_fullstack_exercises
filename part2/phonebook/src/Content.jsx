const Content = (props) => {
  return (
    <div>
    {props.filterName === '' ? props.persons.map((person, index) => <li key={index}>{person.name} {person.number}<button onClick={() => props.deleteButton(person)}>Delete</button></li>) : props.filtered.map((person) => <li key={person.id}>{person.name} {person.number} <button onClick={() => props.deleteButton(person)}>Delete</button></li>)}
    </div>
  )
}

export default Content