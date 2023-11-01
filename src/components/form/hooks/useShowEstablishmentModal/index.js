import { useModal } from '../../context/ModalContext'
import createModalBody from './createModalBody'
import getModalButtonsConfig from './getModalButtonsConfig'
import EstablishmentList from './EstablishmentList'

const useShowEstablishmentModal = (setIsLoading, dispatch) => {
  const { setModalConfig } = useModal()

  const showEstablishmentModal = (duplicateCheckResult) => {
    const isMultipleOccurrences = duplicateCheckResult.multiple
    if (isMultipleOccurrences) {
      setModalConfig({
        isVisible: true,
        title: 'Plusieurs établissements trouvés',
        body: (
          <EstablishmentList
            establishmentsDetails={duplicateCheckResult.details}
            onSelect={(selectedEstablishmentId) => {
              dispatch({
                type: 'SET_CURRENT_ESTABLISHMENT_ID',
                payload: selectedEstablishmentId,
              })
            }}
            dispatch={dispatch} // Assurez-vous d'ajouter ceci
            setModalConfig={setModalConfig} // et ceci
          />
        ),
      })
    } else {
      const modalBody = createModalBody(
        duplicateCheckResult,
        isMultipleOccurrences,
        dispatch, // Ajoutez ceci
        setModalConfig, // Ajoutez ceci
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
        title: 'Etablissement existant',
        body: modalBody,
        buttons: buttonsConfig,
      })
    }

    setIsLoading(false)
  }

  return showEstablishmentModal
}

export default useShowEstablishmentModal
