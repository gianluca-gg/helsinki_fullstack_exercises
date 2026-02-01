const SearchFilter = (props) => {
  return (
        <div>
          filter shown with <input value={props.filtername} onChange={props.handleInputFilter} />
        </div>
  )
}

export default SearchFilter