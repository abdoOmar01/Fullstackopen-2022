import axios from 'axios'
import { useState, useEffect } from 'react'

const Country = ({country}) => {
  const [weather, setWeather] = useState(null)

  const api_key = process.env.REACT_APP_API_KEY
  const lat = country.latlng[0]
  const lon = country.latlng[1]

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`)
    .then(response => {
      setWeather(response.data)
    })
  }, [])

  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.hasOwnProperty('capital')? country.capital[0] : "(no capital)"}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => <li key={lang}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} />
      {weather !== null ?
      <div>
        <h3>Weather in {country.hasOwnProperty('capital')? country.capital[0] : country.name.common}</h3>
        <p>temperature {Math.round(weather.main.temp - 273.15)} Celsius</p>
        <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
        <p>wind {weather.wind.speed} m/s</p>
      </div> : 
      <p>Fetching weather data...</p>}
    </div>
  )
}

const Countries = ({countries}) => {
  
  const [clicked, setClicked] = useState(false)
  const [countryToShow, setCountryToShow] = useState(null)

  const showCountry = (event) => {
    setClicked(!clicked)
    setCountryToShow(countries.find(country => country.name.common === event.target.id))
  }

  if (!clicked)
  {
    if (countries.length > 10)
    {
      return <p>Too many matches, specify another filter</p>
    }
  
    else if (countries.length <= 10 && countries.length > 1)
    {
      return (
        <div>
          {countries.map(country => (
            <div key={country.name.common}>
              {country.name.common} <button id={country.name.common} onClick={showCountry}>show</button>
            </div>
          ))}
        </div>
      )
    }
  
    else if (countries.length == 1)
    {
      return <Country country={countries[0]} />
    }

  }

  else
  {
    return (
      <div>
        <Country country={countryToShow} /> 
        <button onClick={showCountry}>go back</button>
      </div>
    )
  }

}

function App() {

  const [countries, setCountries] = useState([])
  const [name, setName] = useState('')

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then(response => {
      setCountries(response.data)
    })
  }, [])

  const handleNameChange = (event) => {
    setName(event.target.value)
  }

  let countriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(name.toLowerCase()))
  countriesToShow.forEach((country) => {
    if (country.name.common.toLowerCase() === name)
    {
      countriesToShow = [country]
    }
  })

  return (
    <div>
      <div>
        find countries <input value={name} onChange={handleNameChange}/>
      </div>
      <div>
        <Countries countries={countriesToShow} />
      </div>
    </div>
  )
}

export default App;
