import { useReducer } from 'react'

const defaultName = 'Entreprise X'

const initialState = {
  isNameValidated: false,
}

const actionTypes = {
  VALIDATE_NAME: 'VALIDATE_NAME',
  MODIFY_NAME: 'MODIFY_NAME',
  SET_DEFAULT_NAME: 'SET_DEFAULT_NAME',
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.VALIDATE_NAME:
      return { ...state, isNameValidated: true }
    case actionTypes.MODIFY_NAME:
      return { ...state, isNameValidated: false }
    case actionTypes.SET_DEFAULT_NAME:
      return { ...state, companyName: defaultName, isNameValidated: true }
    default:
      return state
  }
}

function useCompanyNameWizard(
  onSelectCompanyName,
  moveToNextStep,
  formData,
  setField,
) {
  const { companyName: initialCompanyName } = formData

  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    companyName: initialCompanyName || initialState.companyName,
  })

  const handleCompanyNameChange = (e) => {
    setField('companyName', e.target.value)
    if (onSelectCompanyName) {
      onSelectCompanyName(e.target.value)
    }
  }

  const handleCompanyNameValidation = () => {
    dispatch({ type: actionTypes.VALIDATE_NAME })
    if (moveToNextStep) moveToNextStep()
  }

  const handleCompanyNameModification = () => {
    dispatch({ type: actionTypes.MODIFY_NAME })
  }

  const handleIDontKnowClick = () => {
    dispatch({ type: actionTypes.SET_DEFAULT_NAME })
  }

  return {
    companyName: formData.companyName,
    isNameValidated: state.isNameValidated,
    handleCompanyNameChange,
    handleCompanyNameValidation,
    handleCompanyNameModification,
    handleIDontKnowClick,
  }
}

export default useCompanyNameWizard
