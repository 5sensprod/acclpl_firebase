import { Button } from 'react-bootstrap'
import { ArrowLeft, ArrowRight } from 'react-bootstrap-icons'

export function NavigationButtons({
  currentStep,
  isCurrentStepInputEmpty,
  moveToNextStep,
  setCurrentStep,
  handleVisualizeClick,
}) {
  return (
    <div className="d-flex justify-content-between mb-3">
      {currentStep > 1 && (
        <Button
          variant="outline-primary"
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          <ArrowLeft className="mr-2" /> Précédent
        </Button>
      )}
      {currentStep < 4 && (
        <Button
          variant="primary"
          onClick={moveToNextStep}
          disabled={isCurrentStepInputEmpty(currentStep)}
        >
          Suivant <ArrowRight className="ml-2" />
        </Button>
      )}
      {currentStep === 4 && (
        <>
          <button
            type="button"
            onClick={handleVisualizeClick}
            className="btn btn-primary mr-2"
          >
            Visualiser
          </button>
          <button type="submit" className="btn btn-success">
            Envoyer
          </button>
        </>
      )}
    </div>
  )
}
