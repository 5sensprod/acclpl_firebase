import React from 'react'
import FormWizardLayout from '../ui/FormWizardLayout'
import {
  FormWizardProvider,
  useFormWizardState,
} from '../context/FormWizardContext'
import { ModalProvider } from '../context/ModalContext'

const FormWizard = ({ steps }) => {
  return (
    <ModalProvider>
      <FormWizardProvider steps={steps}>
        <WizardContent />
      </FormWizardProvider>
    </ModalProvider>
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
