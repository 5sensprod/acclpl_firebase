import React, { createContext, useReducer, useContext } from 'react'
import { formatCompanyAction } from './wizardTransformations'
import wizardSteps from './WizardSteps'
import defaultPhoto from '../../../assets/images/defaultPhoto.jpg'

const FormWizardContext = createContext()

const initialState = {
  tempOriginalPhotoURL: null,
  tempPhotoURL: null,
  tempSelectedFile: null,
  tempCroppedImageUrl: null,
  originalPhotoURL: null,
  photoURL: defaultPhoto,
  isDefaultPhoto: true,
  openCrop: false,
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
    // originalPhotoURL: null,
    zoom: 1,
    rotation: 0,
    // ... d'autres champs que vous pourriez avoir
  },
}

const wizardReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORIGINAL_PHOTO':
      return {
        ...state,
        originalPhotoURL: action.payload,
      }
    case 'SET_TEMP_ORIGINAL_PHOTO':
      return {
        ...state,
        tempOriginalPhotoURL: action.payload,
      }

    case 'RESET_TEMP_ORIGINAL_PHOTO':
      return {
        ...state,
        tempOriginalPhotoURL: null,
      }

    case 'SET_TEMP_PHOTO':
      return {
        ...state,
        tempPhotoURL: action.payload.photoURL,
        tempSelectedFile: action.payload.selectedFile,
        tempCroppedImageUrl: action.payload.croppedImageUrl,
      }

    // Pour réinitialiser l'état temporaire (par exemple, lors de l'annulation)
    case 'RESET_TEMP_PHOTO':
      return {
        ...state,
        tempPhotoURL: null,
        tempSelectedFile: null,
        tempCroppedImageUrl: null,
      }

    // Pour confirmer le recadrage et copier l'état temporaire dans l'état permanent
    case 'CONFIRM_CROP':
      return {
        ...state,
        photoURL: state.tempPhotoURL,
        selectedFile: state.tempSelectedFile,
        croppedImageUrl: state.tempCroppedImageUrl,
        tempPhotoURL: null, // Réinitialisation après la confirmation
        tempSelectedFile: null,
        tempCroppedImageUrl: null,
      }
    case 'UPDATE_PHOTO_URL':
      return {
        ...state,
        photoURL: action.payload,
        isDefaultPhoto: false,
      }
    case 'RESET_TO_DEFAULT_PHOTO':
      return {
        ...state,
        photoURL: defaultPhoto,
        isDefaultPhoto: true,
      }
    case 'OPEN_CROP':
      return { ...state, openCrop: true }
    case 'CLOSE_CROP':
      return { ...state, openCrop: false }
    case 'SET_PHOTO':
      return { ...state, photoURL: action.payload, photoModified: true }
    case 'RESET_PHOTO':
      return { ...state, photoURL: defaultPhoto, photoModified: false }
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

    case 'SET_ZOOM':
      return {
        ...state,
        formData: {
          ...state.formData,
          zoom: action.payload,
        },
      }

    case 'SET_ROTATION':
      return {
        ...state,
        formData: {
          ...state.formData,
          rotation: action.payload,
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
