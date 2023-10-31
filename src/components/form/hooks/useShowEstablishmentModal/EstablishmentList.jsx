import React from 'react'

const EstablishmentList = ({ establishmentIds = [], onSelect }) => {
  if (!establishmentIds) {
    return <div>Les IDs ne sont pas disponibles</div>
  }
  return (
    <div>
      <h5>Choisissez l'établissement correct :</h5>
      <ul>
        {establishmentIds.map((id, index) => (
          <li key={index}>
            <button onClick={() => onSelect(id)}>{id}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EstablishmentList
