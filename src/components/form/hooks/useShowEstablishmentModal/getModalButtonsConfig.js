export const handleYesClick = (
  dispatch,
  coordinates,
  fullAddress,
  setModalConfig,
  companyName,
  photoURL,
) => {
  const invertedCoordinates = [coordinates[1], coordinates[0]]
  dispatch({
    type: 'UPDATE_FORM_DATA',
    payload: {
      companyAddress: fullAddress,
      companyCoordinates: invertedCoordinates,
      companyName: companyName,
      photoURLs: [photoURL],
      isDefaultPhoto: false, // Assurez-vous de mettre à jour cette valeur
    },
  })
  dispatch({ type: 'NEXT_STEP' })
  dispatch({ type: 'UPDATE_HAS_CLOSED_MODAL', payload: true })
  setModalConfig((prevConfig) => ({
    ...prevConfig,
    isVisible: false,
  }))
}

function getModalButtonsConfig(
  dispatch,
  coordinates,
  fullAddress,
  setModalConfig,
  companyName,
  photoURLs,
  isMultipleOccurrences, // Ajoutez ce paramètre
) {
  // Définir le texte du bouton "Non" en fonction du nombre d'occurrences
  const noButtonText = isMultipleOccurrences
    ? "Il s'agit d'un autre établissement"
    : 'Non'

  // Commencer par le bouton "Non" qui est toujours présent
  const buttons = [
    {
      text: noButtonText,
      onClick: () => {
        dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: false })
        dispatch({ type: 'SET_CURRENT_ESTABLISHMENT_ID', payload: null })
        dispatch({ type: 'NEXT_STEP' })
        dispatch({ type: 'UPDATE_HAS_CLOSED_MODAL', payload: true })
        setModalConfig((prevConfig) => ({
          ...prevConfig,
          isVisible: false,
        }))
      },
    },
  ]

  // Ajoute le bouton "Oui" seulement s'il y a une seule occurrence
  if (!isMultipleOccurrences) {
    buttons.push({
      text: 'Oui',
      onClick: () =>
        handleYesClick(
          dispatch,
          coordinates,
          fullAddress,
          setModalConfig,
          companyName,
          photoURLs[0],
        ),
    })
  }

  return buttons
}

export default getModalButtonsConfig
