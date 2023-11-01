import { handleYesClick } from './getModalButtonsConfig' // Importez ceci en haut

const EstablishmentItem = ({
  establishment,
  onSelect,
  dispatch,
  setModalConfig,
}) => {
  const {
    establishmentId,
    establishmentName,
    streetName,
    city,
    postalCode,
    streetNumber,
    photoURL,
  } = establishment

  const fullAddress = streetNumber
    ? `${streetNumber} ${streetName}, ${postalCode} ${city}`
    : `${streetName}, ${postalCode} ${city}`

  return (
    <div
      onClick={() => {
        onSelect(establishmentId)
        handleYesClick(
          dispatch,
          establishment.coordinates,
          fullAddress,
          setModalConfig,
        ) // Ajoutez ceci
      }}
    >
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

const EstablishmentList = ({
  establishmentsDetails = [],
  onSelect,
  dispatch,
  setModalConfig,
}) => {
  return (
    <div>
      {establishmentsDetails.map((establishment, index) => (
        <EstablishmentItem
          key={index}
          establishment={establishment}
          onSelect={onSelect}
          dispatch={dispatch} // Assurez-vous d'ajouter ceci
          setModalConfig={setModalConfig} // et ceci
        />
      ))}
    </div>
  )
}

export default EstablishmentList
