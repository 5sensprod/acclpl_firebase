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
    companyAddress: '', // Ajouté
    companyCoordinates: [], // Ajouté
    dateOfObservation: '',
    timeOfObservation: '',
    photoBlob: null,
    photoURLs: [],
    selectedFile: null, // Ajouté
    croppedImageUrl: null, // Ajouté
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
      console.log('Updating form data:', action.payload)
      return {
        ...state,
        formData: {
          ...state.formData,
          ...action.payload,
        },
      }

    case 'UPDATE_HAS_CLOSED_MODAL':
      return {
        ...state,
        hasClosedModal: action.payload,
      }

    case 'CLOSE_MODAL':
      return {
        ...state,
        hasClosedModal: true,
      }

    case 'RESET_HAS_CLOSED_MODAL':
      return {
        ...state,
        hasClosedModal: false,
      }

    case 'SET_SELECTED_FILE':
      return {
        ...state,
        formData: {
          ...state.formData,
          selectedFile: action.payload,
        },
      }
    case 'SET_CROPPED_IMAGE_URL':
      return {
        ...state,
        formData: {
          ...state.formData,
          croppedImageUrl: action.payload,
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
