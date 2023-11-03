import { handleYesClick } from './getModalButtonsConfig'
import EstablishmentDetails from './EstablishmentDetails'

const getFullAddress = ({ streetNumber, streetName, postalCode, city }) =>
  streetNumber
    ? `${streetNumber} ${streetName}, ${postalCode} ${city}`
    : `${streetName}, ${postalCode} ${city}`

const handleItemClick = (
  establishmentId,
  dispatch,
  setModalConfig,
  onSelect,
  coordinates,
  fullAddress,
  companyName,
) => {
  onSelect(establishmentId)
  handleYesClick(
    dispatch,
    coordinates,
    fullAddress,
    setModalConfig,
    companyName,
  )
}

const EstablishmentItem = ({
  establishment,
  onSelect,
  dispatch,
  setModalConfig,
}) => {
  const { establishmentId, coordinates, establishmentName } = establishment
  const fullAddress = getFullAddress(establishment)

  return (
    <EstablishmentDetails
      {...establishment}
      onClick={() =>
        handleItemClick(
          establishmentId,
          dispatch,
          setModalConfig,
          onSelect,
          coordinates,
          fullAddress,
          establishmentName,
        )
      }
    />
  )
}

const EstablishmentDisplay = ({
  duplicateCheckResult,
  onSelect,
  dispatch,
  setModalConfig,
}) => {
  const isMultipleOccurrences = duplicateCheckResult.multiple

  // Gestion des multiples occurrences
  if (isMultipleOccurrences) {
    return (
      <div>
        {duplicateCheckResult.details.map((establishment, index) => (
          <EstablishmentItem
            key={index}
            establishment={establishment}
            onSelect={onSelect}
            dispatch={dispatch}
            setModalConfig={setModalConfig}
          />
        ))}
      </div>
    )
  }

  // Gestion d'une seule occurrence
  if (!isMultipleOccurrences && duplicateCheckResult.details) {
    const singleEstablishment = duplicateCheckResult.details
    const fullAddress = getFullAddress(singleEstablishment)
    return (
      <EstablishmentDetails
        {...singleEstablishment}
        onClick={() =>
          handleItemClick(
            singleEstablishment.establishmentId,
            dispatch,
            setModalConfig,
            onSelect,
            singleEstablishment.coordinates,
            fullAddress,
            singleEstablishment.establishmentName,
          )
        }
      />
    )
  }

  // Si aucune information n'est fournie, retourner un message d'erreur
  return <div>Aucun détail disponible.</div>
}

export default EstablishmentDisplay
