import { useState, useEffect } from 'react'
import Person from './components/Person'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Notification from './components/Notification'  
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [successMsg, setSuccessMsg] = useState('')    // NEW 2.16
  const [errorMsg, setErrorMsg] = useState('')        // NEW 2.16

  // 2.16 Success helper
  const showSuccess = (msg) => {
    setSuccessMsg(msg)
    setTimeout(() => setSuccessMsg(''), 5000)
  }

  useEffect(() => {
    fetch('http://localhost:3001/persons')
      .then(res => res.json())
      .then(data => setPersons(data))
  }, [])

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${person.name}?`)) {
      fetch(`http://localhost:3001/persons/${id}`, { method: 'DELETE' })
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          showSuccess(`Deleted ${person.name}`)  // 2.16
        })
    }
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
          showSuccess(`Updated ${returnedPerson.name}'s number`)  // 2.16
        })
        .catch(() => {
          setErrorMsg(`Information of ${existingPerson.name} was already deleted`)  // 2.17 prep
          setTimeout(() => setErrorMsg(''), 5000)
        })
      }
      setNewName(''); setNewNumber(''); return
    }

    // Create new
    const personObject = { name: newName, number: newNumber }
    fetch('http://localhost:3001/persons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(personObject)
    })
    .then(res => res.json())
    .then(added => {
      setPersons(persons.concat(added))
      showSuccess(`Added ${added.name}`)  // 2.16
    })
    .catch(() => {
      setErrorMsg('Failed to add person')  // 2.17 prep
      setTimeout(() => setErrorMsg(''), 5000)
    })
    
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
      
      {/* 2.16 Notification */}
      <Notification success={successMsg} error={errorMsg} />
      
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
