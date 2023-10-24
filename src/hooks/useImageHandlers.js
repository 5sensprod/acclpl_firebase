import { useReducer } from 'react'
import {
  imageHandlersReducer,
  initialState,
} from '../reducers/imageHandlersReducer'

export function useImageHandlers(onSelectImage) {
  const [state, dispatch] = useReducer(imageHandlersReducer, initialState)

  const handleImageValidation = (imageData) => {
    dispatch({ type: 'SET_CROPPED_IMAGE_URL', payload: imageData })
    onSelectImage(imageData)
  }

  const handleFileSelected = (file) => {
    dispatch({ type: 'SET_SELECTED_FILE', payload: file })
  }

  return {
    ...state,
    handleImageValidation,
    handleFileSelected,
    setCroppedImageUrl: (url) =>
      dispatch({ type: 'SET_CROPPED_IMAGE_URL', payload: url }),
  }
}
