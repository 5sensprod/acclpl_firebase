import { useModal } from '../../context/ModalContext'
import EstablishmentDisplay from './EstablishmentDisplay'
import getModalButtonsConfig from './getModalButtonsConfig'

const useShowEstablishmentModal = (setIsLoading, dispatch) => {
  const { setModalConfig } = useModal()

  const showEstablishmentModal = (duplicateCheckResult) => {
    const {
      multiple: isMultipleOccurrences,
      details,
      isApproximateMatch,
    } = duplicateCheckResult
    const companyName = details.establishmentName
    const photoURLs = details.photoURL

    const modalBody = (
      <EstablishmentDisplay
        duplicateCheckResult={duplicateCheckResult}
        onSelect={(selectedEstablishmentId) => {
          dispatch({
            type: 'SET_CURRENT_ESTABLISHMENT_ID',
            payload: selectedEstablishmentId,
          })
        }}
        dispatch={dispatch}
        setModalConfig={setModalConfig}
      />
    )

    const buttonsConfig = getModalButtonsConfig(
      dispatch,
      details.coordinates,
      `${details.streetNumber || ''} ${details.streetName}, ${
        details.postalCode
      } ${details.city}`,
      setModalConfig,
      companyName,
      photoURLs,
    )

    const title = isMultipleOccurrences
      ? 'Plusieurs établissements trouvés'
      : isApproximateMatch
      ? 'Etablissement probablement similaire trouvé'
      : 'Etablissement existant'

    setModalConfig({
      isVisible: true,
      title: title,
      body: modalBody,
      buttons: buttonsConfig,
    })

    setIsLoading(false)
  }

  return showEstablishmentModal
}

export default useShowEstablishmentModal
