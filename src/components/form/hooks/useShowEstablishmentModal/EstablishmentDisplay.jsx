import React from 'react'
import { useFormWizardState } from '../../context/FormWizardContext' // Importez le hook pour accéder à l'état et au dispatch
import defaultPhoto from '../../../../assets/images/defaultPhoto.jpg' // Assurez-vous que le chemin est correct

const EstablishmentDisplay = ({
  establishmentId,
  establishmentName,
  address,
  coordinates,
  photoURL,
  onSelect,
  isMultipleOccurrences,
  setModalConfig,
}) => {
  const { dispatch } = useFormWizardState() // Utilisez le hook ici

  // Fonction pour gérer le clic sur un établissement dans la liste des doublons possibles
  const handleItemClick = () => {
    console.log('Établissement sélectionné:', establishmentName)
    onSelect(establishmentId)

    // Dispatch des informations de l'établissement pour la prévisualisation sur la carte
    // en inversant l'ordre des coordonnées si nécessaire
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: {
        currentEstablishmentId: establishmentId,
        companyName: establishmentName,
        companyAddress: address,
        companyCoordinates: [coordinates.longitude, coordinates.latitude], // Inversion des coordonnées ici
        photoURLs: [photoURL],
        isDefaultPhoto: false,
      },
    })

    // Fermer la modale après la sélection
    setModalConfig((prevConfig) => ({ ...prevConfig, isVisible: false }))
  }
  const cursorStyle = isMultipleOccurrences ? { cursor: 'pointer' } : {}

  return (
    <div onClick={handleItemClick} style={cursorStyle}>
      <div className="bg-dark text-light d-flex justify-content-around align-items-center p-3 mb-3 rounded">
        <div>
          <h3 className="mb-2">{establishmentName}</h3>
          <p className="mb-0">{address}</p>
          <p className="mb-2">{`Latitude: ${coordinates.latitude}, Longitude: ${coordinates.longitude}`}</p>
        </div>
        <div>
          <img
            src={photoURL || defaultPhoto} // Utilisez l'image par défaut si photoURL est undefined
            alt={`Observation de ${establishmentName}`}
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

export default EstablishmentDisplay
