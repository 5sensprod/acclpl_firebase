import React from 'react'
import { Card, Container } from 'react-bootstrap'
import { WizardProvider } from './WizardProvider'
import ProgressStepper from './ProgressStepper'
import NavigationButtons from './NavigationButtons'
import useWizard from './useWizard'

import { useWizardState } from './wizardState'

const Wizard = ({ steps }) => {
  const { formData, setField } = useWizardState()

  return (
    <WizardProvider steps={steps}>
      <WizardContent steps={steps} formData={formData} setField={setField} />
    </WizardProvider>
  )
}

const WizardContent = ({ steps, formData, setField }) => {
  // Utilisez le hook useWizard pour obtenir l'étape actuelle
  const { currentStep } = useWizard()

  // Obtenez le composant de l'étape actuelle
  const CurrentComponent = steps[currentStep - 1].component
  const currentProps = steps[currentStep - 1].props

  return (
    <Card className="p-4 shadow-lg bg-dark text-light">
      <Card.Body>
        <Container>
          <ProgressStepper />
          {/* Rendez le composant de l'étape actuelle */}
          {React.createElement(CurrentComponent, currentProps)}
          <NavigationButtons />
        </Container>
      </Card.Body>
    </Card>
  )
}

export default Wizard
