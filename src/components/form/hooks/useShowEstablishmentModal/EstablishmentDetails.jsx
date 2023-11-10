import React from 'react'

const EstablishmentDetails = ({
  establishmentName,
  address,
  photoURL,
  onClick,
  isMultipleOccurrences,
}) => {
  const fullAddress = address

  const cursorStyle = isMultipleOccurrences ? { cursor: 'pointer' } : {}

  return (
    <div onClick={onClick} style={cursorStyle}>
      <div className="bg-dark text-light d-flex justify-content-around align-items-center p-3 mb-3 rounded">
        <div>
          <h3 className="mb-2">{establishmentName}</h3>
          <p className="mb-0">{fullAddress}</p>
        </div>
        <div>
          <img
            src={photoURL}
            alt="Observation"
            className="rounded"
            style={{ width: '80px', height: '80px' }}
          />
        </div>
      </div>
      {!isMultipleOccurrences && (
        <h5 className="mb-2">Est-ce en lien avec votre signalement ?</h5>
      )}
    </div>
  )
}

export default EstablishmentDetails
