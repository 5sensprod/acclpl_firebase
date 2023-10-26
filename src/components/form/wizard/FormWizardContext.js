import React, { createContext, useReducer, useContext } from 'react'
import { formatCompanyAction } from './wizardTransformations'
import wizardSteps from './WizardSteps'

const FormWizardContext = createContext()

const initialState = {
  currentStep: 1,
  steps: [],
  formData: {
    companyName: '',
    normalizedCompanyName: '',
    // ... d'autres champs que vous pourriez avoir
  },
}

const wizardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }

    case 'NEXT_STEP':
      return { ...state, currentStep: state.currentStep + 1 }

    case 'PREV_STEP':
      return { ...state, currentStep: state.currentStep - 1 }

    case 'FORMAT_COMPANY':
      return formatCompanyAction(state, action)

    case 'UPDATE_FORM_DATA':
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      }

    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const FormWizardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(wizardReducer, {
    ...initialState,
    steps: wizardSteps,
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
