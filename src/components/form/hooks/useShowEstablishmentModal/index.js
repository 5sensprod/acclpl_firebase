import { useModal } from '../../context/ModalContext'
import createModalBody from './createModalBody'
import getModalButtonsConfig from './getModalButtonsConfig'

const useShowEstablishmentModal = (setIsLoading, dispatch) => {
  const { setModalConfig } = useModal()

  const showEstablishmentModal = (duplicateCheckResult) => {
    const modalBody = createModalBody(duplicateCheckResult)

    const {
      details: { coordinates },
    } = duplicateCheckResult

    const fullAddress = `${duplicateCheckResult.details.streetNumber || ''} ${
      duplicateCheckResult.details.streetName
    }, ${duplicateCheckResult.details.postalCode} ${
      duplicateCheckResult.details.city
    }`

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

    setIsLoading(false)
  }

  return showEstablishmentModal
}

export default useShowEstablishmentModal
