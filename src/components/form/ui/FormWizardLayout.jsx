import React from 'react'
import { Card, Container } from 'react-bootstrap'
import { useFormWizardState } from '../context/FormWizardContext'
import StepProgressIndicator from './StepProgressIndicator'
import WizardStepManager from '../wizard/WizardStepManager'

const FormWizardLayout = ({ children }) => {
  const { state } = useFormWizardState()

  return (
    <Card className="p-4 shadow-lg bg-dark text-light">
      <Card.Body>
        <Container>
          <StepProgressIndicator />
          <h3 className="mb-3">
            {state.steps[state.currentStep - 1].label}
          </h3>{' '}
          {/* Afficher le label de l'étape active */}
          {children}{' '}
          {/* C'est ici que votre composant d'étape actif sera rendu */}
          <WizardStepManager />
        </Container>
      </Card.Body>
    </Card>
  )
}

export default FormWizardLayout
