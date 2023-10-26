import React from 'react'
import { Button } from 'react-bootstrap'
import { useFormWizardState } from './FormWizardContext'
import { checkDuplicateEstablishment } from '../../../services/establishmentCheckerService'
import DynamicModal from './DynamicModal'
import formatCompanyName from '../../../utils/formatCompanyName'
import normalizedCompanyName from '../../../utils/normalizedCompanyName'
import { useModal } from './ModalContext'

const WizardNavigationButtons = () => {
  const { state, dispatch } = useFormWizardState()
  const { setModalConfig } = useModal()
  const [isCheckPending, setIsCheckPending] = React.useState(false) // Nouveau state

  const currentStep = state.currentStep
  const totalSteps = state.steps.length

  const moveToPrevStep = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const moveToNextStep = async () => {
    if (currentStep === 1 && state.formData.companyName.trim() !== '') {
      const formattedName = formatCompanyName(state.formData.companyName)
      const normalized = normalizedCompanyName(formattedName)

      const isDuplicate = await checkDuplicateEstablishment(normalized)

      if (isDuplicate) {
        // Affichez le modal d'erreur si un doublon est détecté
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
      // Appliquez la mise en forme et la normalisation dans l'état
      dispatch({
        type: 'FORMAT_COMPANY',
        payload: state.formData.companyName,
      })
    }
    // Si tout est ok, allez à l'étape suivante
    dispatch({ type: 'NEXT_STEP' })
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
        <Button variant="primary" onClick={moveToNextStep}>
          Suivant
        </Button>
      )}
      <DynamicModal />
    </div>
  )
}

export default WizardNavigationButtons
