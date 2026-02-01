const Content = (props) => {
  return (
    <div>
    {props.filterName === '' ? props.persons.map((person, index) => <li key={index}>{person.name} {person.number}</li>) : props.filtered.map((person) => <li key={person.id}>{person.name} {person.number}</li>)}
    </div>
  )
}

export default Content