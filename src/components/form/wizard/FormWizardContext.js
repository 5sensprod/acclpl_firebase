import React, { createContext, useReducer, useContext } from 'react'

const FormWizardContext = createContext()

const wizardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 }
    case 'PREV_STEP':
      return { ...state, currentStep: state.currentStep - 1 }
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const FormWizardProvider = ({ children, steps }) => {
  const [state, dispatch] = useReducer(wizardReducer, {
    currentStep: 1,
    steps: steps,
  })

  return (
    <FormWizardContext.Provider value={{ state, dispatch }}>
      {children}
    </FormWizardContext.Provider>
  )
}

export const useFormWizardState = () => {
  const context = useContext(FormWizardContext)
  if (context === undefined) {
    throw new Error(
      'useFormWizardState must be used within a FormWizardProvider',
    )
  }
  return context
}
