import React from 'react'
import { Card, Container } from 'react-bootstrap'
import { WizardProvider } from './WizardProvider'
import ProgressStepper from './ProgressStepper'
import NavigationButtons from './NavigationButtons'

const Wizard = ({ steps, children }) => {
  return (
    <WizardProvider steps={steps}>
      <Card className="p-4 shadow-lg bg-dark text-light">
        <Card.Body>
          <Container>
            <ProgressStepper />
            {children}
            <NavigationButtons />
          </Container>
        </Card.Body>
      </Card>
    </WizardProvider>
  )
}

export default Wizard
