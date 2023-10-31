function getModalButtonsConfig(
  dispatch,
  coordinates,
  fullAddress,
  setModalConfig,
) {
  return [
    {
      text: 'Oui',
      onClick: () => {
        dispatch({
          type: 'UPDATE_FORM_DATA',
          payload: {
            companyAddress: fullAddress,
            companyCoordinates: coordinates,
          },
        })
        dispatch({ type: 'NEXT_STEP' })
        dispatch({ type: 'UPDATE_HAS_CLOSED_MODAL', payload: true })
        setModalConfig((prevConfig) => ({
          ...prevConfig,
          isVisible: false,
        }))
      },
    },
    {
      text: 'Non',
      onClick: () => {
        // Reset establishmentExists and currentEstablishmentId
        dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: false })
        dispatch({ type: 'SET_CURRENT_ESTABLISHMENT_ID', payload: null })

        // Move to the next step
        dispatch({ type: 'NEXT_STEP' })

        // Mark modal as closed
        dispatch({ type: 'UPDATE_HAS_CLOSED_MODAL', payload: true })

        // Close the modal
        dispatch({ type: 'CLOSE_MODAL' })

        setModalConfig((prevConfig) => ({
          ...prevConfig,
          isVisible: false,
        }))
      },
    },
  ]
}

export default getModalButtonsConfig
