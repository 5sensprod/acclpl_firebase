import React from 'react'
import { Card, Container } from 'react-bootstrap'
import { FormWizardProvider, useFormWizardState } from './FormWizardContext'
import StepProgressIndicator from './StepProgressIndicator'
import WizardNavigationButtons from './WizardNavigationButtons'

const FormWizard = ({ steps }) => {
  return (
    <FormWizardProvider steps={steps}>
      <FormWizardLayout />
    </FormWizardProvider>
  )
}

const FormWizardLayout = () => {
  const { state } = useFormWizardState()

  const ActiveStepComponent = state.steps[state.currentStep - 1].component
  const activeStepProps = state.steps[state.currentStep - 1].props

  return (
    <Card className="p-4 shadow-lg bg-dark text-light">
      <Card.Body>
        <Container>
          <StepProgressIndicator />
          {React.createElement(ActiveStepComponent, activeStepProps)}
          <WizardNavigationButtons />
        </Container>
      </Card.Body>
    </Card>
  )
}

export default FormWizard
