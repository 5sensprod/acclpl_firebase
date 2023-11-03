import { useModal } from '../../context/ModalContext'
import EstablishmentDisplay from './EstablishmentDisplay'
import getModalButtonsConfig from './getModalButtonsConfig'

const useShowEstablishmentModal = (setIsLoading, dispatch) => {
  const { setModalConfig } = useModal()

  const showEstablishmentModal = (duplicateCheckResult) => {
    const { multiple: isMultipleOccurrences, isApproximateMatch } =
      duplicateCheckResult

    const companyName = duplicateCheckResult.details.name

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
      duplicateCheckResult.details.coordinates,
      `${duplicateCheckResult.details.streetNumber || ''} ${
        duplicateCheckResult.details.streetName
      }, ${duplicateCheckResult.details.postalCode} ${
        duplicateCheckResult.details.city
      }`,
      setModalConfig,
      companyName,
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
      buttons: !isMultipleOccurrences && buttonsConfig,
    })

    setIsLoading(false)
  }

  return showEstablishmentModal
}

export default useShowEstablishmentModal
