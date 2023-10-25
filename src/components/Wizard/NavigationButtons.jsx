import React from 'react'
import { Button } from 'react-bootstrap'
import useWizard from './useWizard'

const NavigationButtons = () => {
  const { currentStep, totalSteps, moveToNextStep, moveToPrevStep } =
    useWizard()

  return (
    <div className="d-flex justify-content-between my-3 p-3">
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

      {/* Si vous avez d'autres boutons ou logiques spécifiques à certaines étapes, vous pouvez les ajouter ici. */}
    </div>
  )
}

export default NavigationButtons
