import { useEffect, useState } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Notification = ({message}) => {
  if (message === null)
  {
    return null
  }

  const style = {
    fontSize: 20,
    color: 'green',
    borderColor: 'green',
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    background: 'lightgrey'
  }

  const error = {
    ...style,
    color: 'red',
    borderColor: 'red'
  }

  return (
    <div style={message.includes('removed') ? error : style}>
      {message}
    </div>
  )
}

const Filter = ({filter, handler}) => {
  return (
    <div>
      filter shown with <input value={filter} onChange={handler} />
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.submitHandler}>
      <div>
        name: <input value={props.nameValue} onChange={props.nameHandler} />
      </div>
      <div>
        number: <input value={props.numberValue} onChange={props.numberHandler} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Person = ({name, number, handler}) => {
  return (
    <div>
      {name} {number}
      <button onClick={handler}>delete</button>
    </div>
  )
}

const Persons = ({persons, handler}) => {
  return (
    persons.map(person => <Person key={person.name} name={person.name} number={person.number} handler={() => handler(person.id)}/>)
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  
  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response => setPersons(response.data))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if (newName === '' || newNumber === '')
    {
      alert('Please enter a valid name and number')
      return
    }

    const temp = persons.filter(person => person.name === newName)
    if (temp.length !== 0)
    {
      const response = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (response)
      {
        const person = persons.find(person => person.name === newName)
        const changedPerson = {...person, number: newNumber}
        
        personService.change(person.id, changedPerson)
          .then(response => {
            setPersons(persons.map(p => p.id === person.id ? changedPerson : p))
            setMessage(`Changed ${changedPerson.name}'s number`)
            setNewName('')
            setNewNumber('')
            setTimeout(() => {
              setMessage(null)
            }, 5000)
          })
          .catch(error => {
            console.log('error', error)
            setMessage(`Information of ${person.name} has already been removed from server`)
            setTimeout(() => {
              setMessage(null)
            }, 5000)
         })
      }

      return
    }

    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService.add(newPerson).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      setMessage(`Added ${newPerson.name}`)
      setNewName('')
      setNewNumber('')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    })
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const deleteHandler = id => {
    const person = persons.find(person => person.id === id)
    const response = window.confirm(`Delete ${person.name} ?`)
    if(response)
    {
      personService.remove(id)
        .then(response => {
          console.log(`Deleted ${person.name}`)
          setPersons(persons.filter(person => person.id !== id))
        })
    }
  }

  const personsToShow = (filter === '') ? persons : persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} />
      
      <Filter filter={filter} handler={handleFilterChange} />

      <h3>Add a new person</h3>

      <PersonForm submitHandler={addPerson} nameValue={newName} nameHandler={handleNameChange}
       numberValue={newNumber} numberHandler={handleNumberChange} />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} handler={deleteHandler}/>

    </div>
  )
}

export default App