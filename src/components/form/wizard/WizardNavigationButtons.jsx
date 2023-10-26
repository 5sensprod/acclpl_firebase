import React from 'react'
import { Button } from 'react-bootstrap'
import { useFormWizardState } from './FormWizardContext'

const WizardNavigationButtons = () => {
  const { state, dispatch } = useFormWizardState()

  const currentStep = state.currentStep
  const totalSteps = state.steps.length

  const moveToPrevStep = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const moveToNextStep = () => {
    // Si nous sommes à la première étape, formatons le nom de l'entreprise avant de passer à la prochaine étape.
    if (currentStep === 1 && state.formData.companyName.trim() !== '') {
      dispatch({
        type: 'FORMAT_COMPANY_NAME',
        payload: state.formData.companyName,
      })
    }

    // Passez à la prochaine étape.
    dispatch({ type: 'NEXT_STEP' })
  }

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
    </div>
  )
}

export default WizardNavigationButtons
