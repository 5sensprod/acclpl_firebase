import React from 'react'
import { handleYesClick } from './getModalButtonsConfig'
import EstablishmentDetails from './EstablishmentDetails'

// Helper function to get the full address from the establishment details
const getFullAddress = ({ streetNumber, streetName, postalCode, city }) =>
  `${
    streetNumber ? `${streetNumber} ` : ''
  }${streetName}, ${postalCode} ${city}`

// Handles the click event on the establishment item
const handleItemClick = (
  establishmentId,
  dispatch,
  setModalConfig,
  onSelect,
  coordinates,
  fullAddress,
  companyName,
  photoURL,
) => {
  console.log('URL de la photo récupérée:', photoURL)
  onSelect(establishmentId)
  handleYesClick(
    dispatch,
    coordinates,
    fullAddress,
    setModalConfig,
    companyName,
    photoURL,
  )
}

const EstablishmentDisplay = ({
  duplicateCheckResult,
  onSelect,
  dispatch,
  setModalConfig,
}) => {
  const isMultipleOccurrences = duplicateCheckResult.multiple

  // Handle multiple occurrences case
  if (isMultipleOccurrences) {
    return (
      <div>
        {duplicateCheckResult.details.map((establishment, index) => (
          <EstablishmentDetails
            key={index}
            {...establishment}
            onClick={() =>
              handleItemClick(
                establishment.establishmentId,
                dispatch,
                setModalConfig,
                onSelect,
                establishment.coordinates,
                getFullAddress(establishment),
                establishment.establishmentName,
                establishment.photoURL,
              )
            }
          />
        ))}
      </div>
    )
  }

  // Handle single occurrence case
  if (!isMultipleOccurrences && duplicateCheckResult.details) {
    const singleEstablishment = duplicateCheckResult.details

    return <EstablishmentDetails {...singleEstablishment} />
  }

  // Handle no details case
  return <div>Aucun détail disponible.</div>
}

export default EstablishmentDisplay
