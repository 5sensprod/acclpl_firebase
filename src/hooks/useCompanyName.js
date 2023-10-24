import { useReducer } from 'react'

const defaultName = 'Entreprise X'

const initialState = {
  companyName: '',
  isNameValidated: false,
}

const actionTypes = {
  SET_COMPANY_NAME: 'SET_COMPANY_NAME',
  VALIDATE_NAME: 'VALIDATE_NAME',
  MODIFY_NAME: 'MODIFY_NAME',
  SET_DEFAULT_NAME: 'SET_DEFAULT_NAME',
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_COMPANY_NAME:
      return { ...state, companyName: action.payload }
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

function useCompanyName(onSelectCompanyName, moveToNextStep) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const handleCompanyNameChange = (e) => {
    dispatch({ type: actionTypes.SET_COMPANY_NAME, payload: e.target.value })
  }

  const handleCompanyNameValidation = () => {
    dispatch({ type: actionTypes.VALIDATE_NAME })
    if (onSelectCompanyName) {
      onSelectCompanyName(state.companyName)
    }
    if (moveToNextStep) moveToNextStep()
  }

  const handleCompanyNameModification = () => {
    dispatch({ type: actionTypes.MODIFY_NAME })
  }

  const handleIDontKnowClick = () => {
    dispatch({ type: actionTypes.SET_DEFAULT_NAME })
  }

  return {
    companyName: state.companyName,
    isNameValidated: state.isNameValidated,
    handleCompanyNameChange,
    handleCompanyNameValidation,
    handleCompanyNameModification,
    handleIDontKnowClick,
  }
}

export default useCompanyName
