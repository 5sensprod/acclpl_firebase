import { useReducer } from 'react'
import { imageHandlersReducer } from '../reducers/imageHandlersReducer'

export function useImageHandlers(onSelectImage) {
  const initialState = {
    selectedFile: null,
    croppedImageUrl: null,
  }

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
