import React from 'react'
import { Card, Container } from 'react-bootstrap'
import { WizardProvider } from './WizardProvider'
import ProgressStepper from './ProgressStepper'
import NavigationButtons from './NavigationButtons'
import useWizard from './useWizard'

const Wizard = ({ steps }) => {
  return (
    <WizardProvider steps={steps}>
      <WizardContent steps={steps} />
    </WizardProvider>
  )
}

const WizardContent = ({ steps }) => {
  // Utilisez le hook useWizard pour obtenir l'étape actuelle
  const { currentStep } = useWizard()

  // Obtenez le composant de l'étape actuelle
  const CurrentComponent = steps[currentStep - 1].component

  return (
    <Card className="p-4 shadow-lg bg-dark text-light">
      <Card.Body>
        <Container>
          <ProgressStepper />
          {/* Rendez le composant de l'étape actuelle */}
          <CurrentComponent />
          <NavigationButtons />
        </Container>
      </Card.Body>
    </Card>
  )
}

export default Wizard
