import React from 'react'
import { Button } from 'react-bootstrap'
import { useFormWizardState } from './FormWizardContext'

const WizardNavigationButtons = () => {
  const { state, actions } = useFormWizardState()

  const currentStep = state.currentStep
  const totalSteps = state.steps.length

  const moveToPrevStep = () => {
    actions.moveToStep(currentStep - 1)
  }

  const moveToNextStep = () => {
    actions.moveToStep(currentStep + 1)
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
