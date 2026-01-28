import { useState, useEffect } from 'react'
import Person from './components/Person'

const App = () => {
  const [persons, setPersons] = useState([])  // Empty → fetch from API
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  // 2.11: Fetch on load
  useEffect(() => {
    fetch('http://localhost:3001/persons')
      .then(res => res.json())
      .then(data => setPersons(data))
      .catch(err => console.error('Fetch error:', err))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    
    if (persons.some(p => p.name === newName)) {
      alert(`${newName} already added`)
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
      <div>filter shown with <input value={searchTerm} onChange={handleSearchChange} /></div>
      <form onSubmit={addPerson}>
        <div>name: <input value={newName} onChange={handleNameChange} /></div>
        <div>number: <input value={newNumber} onChange={handleNumberChange} /></div>
        <button type="submit">add</button>
      </form>
      <h2>Numbers</h2>
      {personsToShow.map(person => <Person key={person.id} person={person} />)}
    </div>
  )
}

export default App
