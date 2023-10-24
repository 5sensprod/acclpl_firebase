export const initialState = {
  selectedFile: null,
  croppedImageUrl: null,
}

export function imageHandlersReducer(state, action) {
  switch (action.type) {
    case 'SET_SELECTED_FILE':
      return { ...state, selectedFile: action.payload }
    case 'SET_CROPPED_IMAGE_URL':
      return { ...state, croppedImageUrl: action.payload }
    default:
      throw new Error(`Unsupported action type: ${action.type}`)
  }
}
