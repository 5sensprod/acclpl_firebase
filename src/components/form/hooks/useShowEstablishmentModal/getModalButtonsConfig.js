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
) {
  // Here, if there's only one occurrence, add a "Yes" button to the config
  return [
    {
      text: 'Non',
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
    {
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
    },
  ]
}

export default getModalButtonsConfig
