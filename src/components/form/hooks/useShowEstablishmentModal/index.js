import { useModal } from '../../context/ModalContext'
import EstablishmentDisplay from './EstablishmentDisplay' // Remplacez les imports de createModalBody et EstablishmentList
import getModalButtonsConfig from './getModalButtonsConfig'

const useShowEstablishmentModal = (setIsLoading, dispatch) => {
  const { setModalConfig } = useModal()

  const showEstablishmentModal = (duplicateCheckResult) => {
    const isMultipleOccurrences = duplicateCheckResult.multiple
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
    )

    setModalConfig({
      isVisible: true,
      title: isMultipleOccurrences
        ? 'Plusieurs établissements trouvés'
        : 'Etablissement existant',
      body: modalBody,
      buttons: !isMultipleOccurrences && buttonsConfig, // Les boutons ne sont nécessaires que pour le cas d'un seul établissement
    })

    setIsLoading(false)
  }

  return showEstablishmentModal
}

export default useShowEstablishmentModal
