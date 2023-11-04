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

    // Créer le message en fonction de isApproximateMatch
    const messageBody = isApproximateMatch
      ? 'Les informations semblent correspondre à un établissement existant, mais il y a des incertitudes. Voulez-vous continuer avec ces informations ?'
      : "Un établissement avec des informations identiques ou similaires a été trouvé. Est-ce celui que vous essayez d'ajouter ?"

    // Inclure messageBody dans modalBodyContent
    const modalBodyContent = (
      <>
        <p>{messageBody}</p>
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
      </>
    )

    let title = 'Etablissement existant'
    if (isMultipleOccurrences) {
      title = 'Plusieurs établissements trouvés'
    } else if (isApproximateMatch) {
      title = 'Etablissement probablement similaire trouvé'
    }

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

    setModalConfig({
      isVisible: true,
      title: title,
      body: modalBodyContent, // Utiliser modalBodyContent ici
      buttons: buttonsConfig,
    })

    setIsLoading(false)
  }

  return showEstablishmentModal
}

export default useShowEstablishmentModal
