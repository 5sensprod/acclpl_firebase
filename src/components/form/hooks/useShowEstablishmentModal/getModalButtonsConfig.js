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
      isDefaultPhoto: false,
    },
  })
  dispatch({ type: 'SET_STEP', payload: 3 })
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
  isMultipleOccurrences,
) {
  // Définir le texte du bouton "Non" en fonction du nombre d'occurrences
  const noButtonText = isMultipleOccurrences
    ? "Il s'agit d'un autre établissement"
    : 'Non'

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
          photoURLs,
        ),
    })
  }

  return buttons
}

export default getModalButtonsConfig
