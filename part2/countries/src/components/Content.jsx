const Content = (props) => {
    console.log(props.filtered.name);
    if (props.filtered.length > 10) return "Too many matches, specify another filter";
    else if (props.filtered.length > 1 && props.filtered.length < 10) return (
    <ul>
        {
            props.filtered.map(country => (
                <li key={country.name}>{country.name.common}</li>
            )
            )
        }
    </ul>
    )
    else return
         (
            <></>
        )
    
}

export default Content