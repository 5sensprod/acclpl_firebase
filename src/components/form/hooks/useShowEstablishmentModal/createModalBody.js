import EstablishmentList from './EstablishmentList'

function createModalBody(duplicateCheckResult, isMultipleOccurrences) {
  if (isMultipleOccurrences) {
    const { establishmentIds } = duplicateCheckResult
    return <EstablishmentList establishmentIds={establishmentIds} />
  }

  const {
    details: {
      establishmentName,
      streetName,
      city,
      postalCode,
      streetNumber,
      photoURL,
    },
  } = duplicateCheckResult

  const fullAddress = streetNumber
    ? `${streetNumber} ${streetName}, ${postalCode} ${city}`
    : `${streetName}, ${postalCode} ${city}`

  const image = new Image()
  image.src = photoURL

  return (
    <div>
      <div className="bg-dark text-light d-flex justify-content-around align-items-center p-3 mb-3 rounded">
        <div>
          <h3 className="mb-2">{establishmentName}</h3>
          <p className="mb-0">{fullAddress.split(',')[0]}</p>
          <p className="mb-2">{city}</p>
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
      <h5 className="mb-2">Est-ce en lien avec votre signalement ?</h5>
    </div>
  )
}

export default createModalBody
