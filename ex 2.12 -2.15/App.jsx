import { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetch('http://localhost:3001/persons')
      .then(res => res.json())
      .then(data => setPersons(data))
  }, [])

  const deletePerson = (id) => {
    fetch(`http://localhost:3001/persons/${id}`, { method: 'DELETE' })
      .then(() => setPersons(persons.filter(p => p.id !== id)))
  }

  const addPerson = (event) => {
    event.preventDefault()
    
    const existingPerson = persons.find(p => p.name === newName)
    
    if (existingPerson) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number ${existingPerson.number}?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber }
        fetch(`http://localhost:3001/persons/${existingPerson.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPerson)
        })
        .then(res => res.json())
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id === existingPerson.id ? returnedPerson : p))
        })
      }
      setNewName(''); setNewNumber(''); return
    }

    const person = { name: newName, number: newNumber }
    fetch('http://localhost:3001/persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(person)
    })
    .then(res => res.json())
    .then(added => setPersons(persons.concat(added)))
    
    setNewName(''); setNewNumber('')
  }

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleSearchChange = (e) => setSearchTerm(e.target.value)

  const personsToShow = searchTerm === ''
    ? persons
    : persons.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={searchTerm} onChange={handleSearchChange} />
      <h3>Add a new</h3>
      <PersonForm 
        onSubmit={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      {personsToShow.map(person => 
        <Person key={person.id} person={person} onDelete={deletePerson} />
      )}
    </div>
  )
}

export default App
