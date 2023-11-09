export const handleYesClick = (dispatch, details, setModalConfig) => {
  const invertedCoordinates = [
    details.coordinates.latitude,
    details.coordinates.longitude,
  ]

  dispatch({
    type: 'UPDATE_FORM_DATA',
    payload: {
      companyAddress: details.address,
      companyCoordinates: invertedCoordinates,
      companyName: details.establishmentName,
      photoURLs: [details.photoURL],
      isDefaultPhoto: false,
    },
  })

  dispatch({
    type: 'SET_CURRENT_ESTABLISHMENT_ID',
    payload: details.establishmentId,
  })

  dispatch({
    type: 'SET_STEP',
    payload: 3,
  })

  setModalConfig((prevConfig) => ({
    ...prevConfig,
    isVisible: false,
  }))
}

function getModalButtonsConfig(
  dispatch,
  details,
  setModalConfig,
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
      onClick: () => handleYesClick(dispatch, details, setModalConfig),
    })
  }

  return buttons
}

export default getModalButtonsConfig
