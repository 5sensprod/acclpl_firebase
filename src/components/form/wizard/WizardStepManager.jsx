import React from 'react'
import { Button } from 'react-bootstrap'
import { Spinner } from 'react-bootstrap'
import { useFormWizardState } from './FormWizardContext'
import { checkDuplicateEstablishment } from '../../../services/establishmentCheckerService'
import DynamicModal from './DynamicModal'
import formatCompanyName from '../../../utils/formatCompanyName'
import normalizedCompanyName from '../../../utils/normalizedCompanyName'
import { useModal } from './ModalContext'

const WizardStepManager = () => {
  const { state, dispatch } = useFormWizardState()
  const { setModalConfig } = useModal()
  const [isCheckPending, setIsCheckPending] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)

  const currentStep = state.currentStep
  const totalSteps = state.steps.length

  const moveToPrevStep = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const moveToNextStep = async () => {
    setIsLoading(true)

    if (currentStep === 1 && state.formData.companyName.trim() !== '') {
      const formattedName = formatCompanyName(state.formData.companyName)
      const normalized = normalizedCompanyName(formattedName)

      const duplicateCheckResult = await checkDuplicateEstablishment(normalized)

      if (duplicateCheckResult.found) {
        // Si un doublon est détecté, adresse pour l'affichage
        const {
          establishmentName,
          streetName,
          city,
          postalCode,
          streetNumber,
          photoURL, // Nouveau : URL de la photo associée
        } = duplicateCheckResult.details
        const fullAddress = `${streetNumber} ${streetName}, ${postalCode} ${city}`

        // Le contenu de la modal
        const modalBodyContent = (
          <div>
            <div className="bg-dark text-light d-flex justify-content-around align-items-center p-3 mb-3 rounded">
              <div>
                {' '}
                <h3 className="mb-2">{establishmentName}</h3>
                <p className="mb-0">{fullAddress.split(',')[0]}</p>{' '}
                <p className="mb-2">{city}</p>
              </div>
              <div>
                {' '}
                {photoURL && (
                  <img
                    src={photoURL}
                    alt="Observation"
                    className="rounded"
                    style={{
                      width: '80px',
                      height: '80px',
                    }}
                  />
                )}
              </div>
            </div>
            <h5 className="mb-2">Est-il en lien avec votre signalement ?</h5>
          </div>
        )
        // Le modal d'information
        setModalConfig({
          isVisible: true,
          title: 'Etablissement existant',
          body: modalBodyContent,
          buttons: [
            {
              text: 'Oui',
              onClick: () => {
                // TODO: Gérez le scénario "Oui" ici (peut-être remplir l'adresse pour l'étape suivante automatiquement)
              },
            },
            {
              text: 'Non',
              onClick: () => {
                // TODO: Gérez le scénario "Non" ici (peut-être aller à l'étape suivante pour saisir l'adresse manuellement)
              },
            },
            // {
            //   text: 'Fermer',
            //   onClick: () =>
            //     setModalConfig((prev) => ({ ...prev, isVisible: false })),
            // },
          ],
        })
        setIsLoading(false)
        return
      }

      // Si pas de doublon, normalisation dans l'état
      dispatch({
        type: 'FORMAT_COMPANY',
        payload: state.formData.companyName,
      })
    }

    // Si tout est ok, allez à l'étape suivante
    dispatch({ type: 'NEXT_STEP' })
    setIsLoading(false)
  }

  React.useEffect(() => {
    if (isCheckPending) {
      const checkDuplicates = async () => {
        if (state.formData.normalizedCompanyName) {
          const isDuplicate = await checkDuplicateEstablishment(
            state.formData.normalizedCompanyName,
          )
          if (isDuplicate) {
            setModalConfig({
              isVisible: true,
              title: 'Erreur',
              body: 'Un doublon a été détecté !',
              buttons: [
                {
                  text: 'Fermer',
                  onClick: () =>
                    setModalConfig((prev) => ({ ...prev, isVisible: false })),
                },
              ],
            })
            return
          }
        }

        dispatch({ type: 'NEXT_STEP' })
        setIsCheckPending(false)
      }

      checkDuplicates()
    }
  }, [
    isCheckPending,
    state.formData.normalizedCompanyName,
    setModalConfig,
    dispatch,
  ])

  return (
    <div className="d-flex justify-content-between my-3">
      {currentStep > 1 && (
        <Button variant="outline-primary" onClick={moveToPrevStep}>
          Revenir
        </Button>
      )}

      {currentStep < totalSteps && (
        <Button variant="primary" onClick={moveToNextStep} disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" />
            </>
          ) : (
            'Suivant'
          )}
        </Button>
      )}
      <DynamicModal />
    </div>
  )
}

export default WizardStepManager
