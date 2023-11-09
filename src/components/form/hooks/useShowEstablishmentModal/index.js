import { useModal } from '../../context/ModalContext'
import EstablishmentDisplay from './EstablishmentDisplay'
import getModalButtonsConfig from './getModalButtonsConfig'

// useShowEstablishmentModal/index.js

const useShowEstablishmentModal = (setIsLoading, dispatch) => {
  const { setModalConfig } = useModal()

  const showEstablishmentModal = (duplicateCheckResult) => {
    if (!duplicateCheckResult) {
      console.error('Aucun résultat de vérification des doublons fourni.')
      setIsLoading(false)
      return
    }

    const {
      multiple: isMultipleOccurrences,
      details,
      isApproximateMatch,
    } = duplicateCheckResult

    // Assurez-vous que les détails contiennent toutes les informations nécessaires
    if (
      !details ||
      !details.coordinates ||
      !details.address ||
      !details.photoURL
    ) {
      console.error(
        'Les détails de l’établissement ne sont pas complets:',
        details,
      )
      setIsLoading(false)
      return
    }

    const modalBodyContent = (
      <>
        <p>
          {isApproximateMatch
            ? 'Les informations semblent correspondre à un établissement existant. Sélectionnez celui en rapport avec votre signalement.'
            : "Sélectionnez l'établissement en rapport avec votre signalement."}
        </p>
        <EstablishmentDisplay
          establishmentName={details.establishmentName}
          address={details.address}
          coordinates={details.coordinates}
          photoURL={details.photoURL}
          onSelect={(selectedEstablishmentId) => {
            dispatch({
              type: 'SET_CURRENT_ESTABLISHMENT_ID',
              payload: selectedEstablishmentId,
            })
            // Autres actions si nécessaire...
          }}
        />
      </>
    )

    let title = isApproximateMatch
      ? 'Etablissement probablement similaire trouvé'
      : 'Etablissement existant'

    const buttonsConfig = getModalButtonsConfig(
      dispatch,
      details, // Passer l'objet complet ici
      setModalConfig,
      isMultipleOccurrences,
    )

    setModalConfig({
      isVisible: true,
      title,
      body: modalBodyContent,
      buttons: buttonsConfig,
    })

    setIsLoading(false)
  }

  return showEstablishmentModal
}

export default useShowEstablishmentModal
