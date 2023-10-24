import { useState } from 'react'

function useNavigationLogic(initialStep = 1) {
  const [currentStep, setCurrentStep] = useState(initialStep)

  const moveToNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  return { currentStep, setCurrentStep, moveToNextStep }
}

function useStepValidation({
  companyName,
  isNameValidated,
  address,
  isAddressValidated,
  dateOfObservation,
  timeOfObservation,
  isDateTimeValidated,
  selectedFile,
}) {
  const isCurrentStepInputEmpty = (currentStep) => {
    switch (currentStep) {
      case 1:
        return !companyName || !isNameValidated
      case 2:
        return !address || !isAddressValidated
      case 3:
        return !dateOfObservation || !timeOfObservation || !isDateTimeValidated
      case 4:
        return !selectedFile
      default:
        return false
    }
  }

  return { isCurrentStepInputEmpty }
}

export { useNavigationLogic, useStepValidation }
