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
) => {
  onSelect(establishmentId)
  handleYesClick(dispatch, coordinates, fullAddress, setModalConfig)
}

const EstablishmentItem = ({
  establishment,
  onSelect,
  dispatch,
  setModalConfig,
}) => {
  const { establishmentId, coordinates } = establishment
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

  return <EstablishmentDetails {...duplicateCheckResult.details} />
}

export default EstablishmentDisplay
