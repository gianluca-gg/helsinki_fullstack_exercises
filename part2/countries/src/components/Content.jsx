import { useState } from 'react'
const Content = (props) => {
  const { filtered } = props
  const [openId, setOpenId] = useState(null);
const toggle = (id) => {
  setOpenId((prev) => (prev === id ? null : id));
};
  if (filtered.length > 10) {
    return "Too many matches, specify another filter"
  }

if (filtered.length > 1 && filtered.length <= 10) {
    return (
      <ul>
        {filtered.map((country) => {
          const id = country.cca3;
          const isOpen = openId === id;

          return (
            <li key={id}>
              {country.name.common}{" "}
              <button onClick={() => toggle(id)}>
                {isOpen ? "Hide" : "Show"}
              </button>

              {isOpen && (
                <div>
                  <p>Capital: {country.capital?.[0]}</p>
                  <p>Area: {country.area}</p>
                  <p>
                    Languages:{" "}
                    {country.languages
                      ? Object.values(country.languages).join(", ")
                      : "N/A"}
                  </p>
                  {country.flags?.png && (
                    <img src={country.flags.png} alt="flag" width={120} />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  if (filtered.length === 1) {
    return (
      <div>
        <h2>{filtered[0].name.common}</h2>
        <p>Capital {filtered[0].capital}</p>
        <p>Area {filtered[0].area}</p>
        <h2>Languages</h2>
        <ul>
              {Object.values(filtered[0].languages).map((lang) => (
    <li key={lang}>{lang}</li>
  ))}
        </ul>
         <img src={filtered[0].flags.png} alt="flag" width={120} />
      </div>
    )
  }

  // filtered.length === 0
  return <p>Nessun risultato</p>
}

export default Content
