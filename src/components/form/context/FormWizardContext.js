import React, { createContext, useReducer, useContext } from 'react'
import { formatCompanyAction } from '../wizard/wizardTransformations'
import wizardSteps from '../wizard/WizardSteps'
import defaultPhoto from '../../../assets/images/defaultPhoto.jpg'

const FormWizardContext = createContext()

const initialState = {
  currentEstablishmentIds: [],
  zoom: 1,
  rotation: 0,
  crop: { x: 0, y: 0 },
  tempOriginalPhotoURL: null,
  tempPhotoURL: null,
  tempSelectedFile: null,
  tempCroppedImageUrl: null,
  originalPhotoURL: null,
  previewPhotoURL: defaultPhoto,
  photoURL: defaultPhoto,
  isDefaultPhoto: true,
  isOccurrence: false,
  openCrop: false,
  currentStep: 1,
  steps: [],
  establishmentExists: false,
  currentEstablishmentsData: [],
  formData: {
    companyName: '',
    normalizedCompanyName: '',
    companyAddress: '',
    formattedAddress: {
      streetNumber: '',
      streetName: '',
      postalCode: '',
      city: '',
    },
    companyCoordinates: [],
    dateOfObservation: '',
    timeOfObservation: '',
    photoBlob: null,
    photoURLs: [],
    selectedFile: null,
    croppedImageUrl: null,
    currentEstablishmentId: null,
    additionalNotes: '',
    observationTypes: [],
  },
}

const wizardReducer = (state, action) => {
  switch (action.type) {
    case 'RESET_NOTES':
      console.log('Réinitialisation de la notes.')
      return {
        ...state,
        formData: {
          ...state.formData,
          additionalNotes: '',
        },
      }

    case 'UPDATE_COMPANY_NAME_MODAL':
      console.log('Mise à jour companyName: ', action.payload.companyName)
      console.log(
        'Mise à jour normalizedCompanyName: ',
        action.payload.normalizedCompanyName,
      )
      return {
        ...state,
        formData: {
          ...state.formData,
          companyName: action.payload.companyName,
          normalizedCompanyName: action.payload.normalizedCompanyName,
        },
      }

    case 'RESET_COMPANY_NAME_MODAL':
      console.log('Réinitialisation des noms de l’entreprise.')
      return {
        ...state,
        formData: {
          ...state.formData,
          companyName: '',
          normalizedCompanyName: '',
        },
      }

    case 'RESET_COMPANY_ADDRESS':
      console.log('Adresse de l’entreprise réinitialisée.')
      return {
        ...state,
        formData: {
          ...state.formData,
          companyAddress: '',
        },
      }

    case 'UPDATE_COMPANY_ADDRESS':
      console.log('Nouvelle adresse reçue: ', action.payload) // Log pour vérification
      return {
        ...state,
        formData: {
          ...state.formData,
          companyAddress: action.payload,
        },
      }

    case 'RESET_DATE_TIME':
      return {
        ...state,
        formData: {
          ...state.formData,
          dateOfObservation: '',
          timeOfObservation: '',
        },
      }

    case 'SET_IS_OCCURRENCE_TRUE':
      return {
        ...state,
        isOccurrence: true,
      }
    case 'SET_IS_OCCURRENCE_FALSE':
      return {
        ...state,
        isOccurrence: false,
      }

    case 'UPDATE_ADDITIONAL_NOTES':
      return {
        ...state,
        formData: {
          ...state.formData,
          additionalNotes: action.payload,
        },
      }

    case 'SET_STEP':
      return { ...state, currentStep: action.payload }

    case 'UPDATE_COMPANY_NAME':
      return {
        ...state,
        formData: {
          ...state.formData,
          companyName: action.payload,
        },
      }

    case 'SET_COMPANY_COORDINATES':
      console.log('Payload pour SET_COMPANY_COORDINATES:', action.payload)
      return {
        ...state,
        formData: {
          ...state.formData,
          companyCoordinates: action.payload,
        },
      }

    case 'RESET_TO_FIRST_STEP':
      return { ...state, currentStep: 1 }

    case 'RESET_FORM_DATA':
      return {
        ...state,
        formData: { ...initialState.formData },
      }

    case 'RESET_FORM':
      return {
        ...initialState,
        steps: state.steps,
      }

    case 'SET_CURRENT_ESTABLISHMENTS_DATA':
      return {
        ...state,
        currentEstablishmentsData: action.payload,
      }

    case 'SET_ESTABLISHMENT_EXISTS':
      return {
        ...state,
        establishmentExists: action.payload,
      }

    case 'SET_CURRENT_ESTABLISHMENT_ID':
      return {
        ...state,
        formData: {
          ...state.formData,
          currentEstablishmentId: action.payload,
        },
      }

    case 'FORMAT_ADDRESS':
      return {
        ...state,
        formData: {
          ...state.formData,
          formattedAddress: action.payload,
        },
      }

    case 'SAVE_PREVIOUS_CROP_ZOOM_AND_ROTATION':
      return {
        ...state,
        previousCrop: state.crop,
        previousZoom: state.zoom,
        previousRotation: state.rotation,
      }

    case 'RESTORE_PREVIOUS_CROP_ZOOM_AND_ROTATION':
      return {
        ...state,
        crop: state.previousCrop,
        zoom: state.previousZoom,
        rotation: state.previousRotation,
      }

    case 'RESET_CROP_ZOOM_AND_ROTATION_TO_DEFAULT':
      return {
        ...state,
        crop: { x: 0, y: 0 },
        zoom: 1,
        rotation: 0,
      }

    case 'UPDATE_CROP_ZOOM_AND_ROTATION':
      return {
        ...state,
        crop: action.payload.crop,
        zoom: action.payload.zoom,
        rotation: action.payload.rotation,
      }

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

    case 'SET_TEMP_PHOTO':
      return {
        ...state,
        tempPhotoURL: action.payload.photoURL,
        tempSelectedFile: action.payload.selectedFile,
        tempCroppedImageUrl: action.payload.croppedImageUrl,
      }

    case 'RESET_TEMP_PHOTO':
      return {
        ...state,
        tempPhotoURL: null,
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
          // Assurer que formattedAddress est correctement mis à jour
          formattedAddress: {
            ...state.formData.formattedAddress,
            ...(action.payload.formattedAddress || {}),
          },
        },
        isDefaultPhoto: action.payload.hasOwnProperty('isDefaultPhoto')
          ? action.payload.isDefaultPhoto
          : state.isDefaultPhoto,
      }
    case 'UPDATE_HAS_CLOSED_MODAL':
      return {
        ...state,
        hasClosedModal: action.payload,
      }

    case 'RESET_HAS_CLOSED_MODAL':
      return {
        ...state,
        hasClosedModal: false,
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
