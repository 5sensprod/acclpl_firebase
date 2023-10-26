import React from 'react'
import FormWizardLayout from './FormWizardLayout'
import { FormWizardProvider, useFormWizardState } from './FormWizardContext'

const FormWizard = ({ steps }) => {
  return (
    <FormWizardProvider steps={steps}>
      <WizardContent />
    </FormWizardProvider>
  )
}

const WizardContent = () => {
  const { state } = useFormWizardState()
  const ActiveStepComponent = state.steps[state.currentStep - 1].component
  const activeStepProps = state.steps[state.currentStep - 1].props

  return (
    <FormWizardLayout>
      <ActiveStepComponent {...activeStepProps} />
    </FormWizardLayout>
  )
}

export default FormWizard
