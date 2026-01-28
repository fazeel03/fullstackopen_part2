const Person = ({ person, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Delete ${person.name}?`)) {
      onDelete(person.id)
    }
  }

  return (
    <p>
      {person.name} {person.number} 
      <button onClick={handleDelete} style={{marginLeft: '10px'}}>
        delete
      </button>
    </p>
  )
}

export default Person
