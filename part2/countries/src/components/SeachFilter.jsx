const SearchFilter = (props) => {

    return (
        <form>
            <input type="text" onChange={props.handleInputFilter}></input>
        </form>
    )
}

export default SearchFilter