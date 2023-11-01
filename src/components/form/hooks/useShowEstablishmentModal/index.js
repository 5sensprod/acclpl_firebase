import { useModal } from '../../context/ModalContext'
import createModalBody from './createModalBody'
import getModalButtonsConfig from './getModalButtonsConfig'
import EstablishmentList from './EstablishmentList'

const useShowEstablishmentModal = (setIsLoading, dispatch) => {
  const { setModalConfig } = useModal()

  const showEstablishmentModal = (duplicateCheckResult) => {
    const isMultipleOccurrences = duplicateCheckResult.multiple
    if (isMultipleOccurrences) {
      // Plusieurs établissements trouvés
      setModalConfig({
        isVisible: true,
        title: 'Plusieurs établissements trouvés',
        body: (
          <EstablishmentList
            establishmentIds={duplicateCheckResult.establishmentIds}
            onSelect={(selectedEstablishmentId) => {
              dispatch({
                type: 'SET_CURRENT_ESTABLISHMENT_ID',
                payload: selectedEstablishmentId,
              })
              // Vous pouvez ajouter d'autres actions après avoir sélectionné un établissement si nécessaire.
            }}
          />
        ),
        // Vous pouvez ajouter des boutons si nécessaire, par exemple pour fermer la modale
      })
    } else {
      const {
        details: { coordinates },
      } = duplicateCheckResult

      const fullAddress = `${duplicateCheckResult.details.streetNumber || ''} ${
        duplicateCheckResult.details.streetName
      }, ${duplicateCheckResult.details.postalCode} ${
        duplicateCheckResult.details.city
      }`

      const modalBody = createModalBody(
        duplicateCheckResult,
        isMultipleOccurrences,
      )
      const buttonsConfig = getModalButtonsConfig(
        dispatch,
        coordinates,
        fullAddress,
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
