import React, { createContext, useState, useMemo, useCallback } from 'react'

export const WizardContext = createContext(null)

export const WizardProvider = ({ children, steps }) => {
  const [currentStep, setCurrentStep] = useState(1)

  const totalSteps = steps.length
  const isLastStep = currentStep === totalSteps
  const isFirstStep = currentStep === 1

  const moveToNextStep = useCallback(() => {
    if (!isLastStep) setCurrentStep((prevStep) => prevStep + 1)
  }, [isLastStep])

  const moveToPrevStep = useCallback(() => {
    if (!isFirstStep) setCurrentStep((prevStep) => prevStep - 1)
  }, [isFirstStep])

  const CurrentComponent = steps[currentStep - 1].component

  const value = useMemo(
    () => ({
      currentStep,
      totalSteps,
      moveToNextStep,
      moveToPrevStep,
      CurrentComponent,
    }),
    [currentStep, totalSteps, moveToNextStep, moveToPrevStep, CurrentComponent],
  )

  return (
    <WizardContext.Provider value={value}>
      <CurrentComponent />
      {children}
    </WizardContext.Provider>
  )
}
