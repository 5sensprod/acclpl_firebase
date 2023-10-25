// wizardState.js

import { useReducer } from 'react'

const initialState = {
  companyName: '',
  // ... d'autres champs au besoin ...
}

const actionTypes = {
  SET_FIELD: 'SET_FIELD',
  // ... d'autres types d'action au besoin ...
}

function reducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_FIELD:
      return { ...state, [action.payload.field]: action.payload.value }
    // ... d'autres cas au besoin ...
    default:
      return state
  }
}

export function useWizardState() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setField = (field, value) => {
    dispatch({ type: actionTypes.SET_FIELD, payload: { field, value } })
  }

  return {
    formData: state,
    setField,
    // ... d'autres méthodes ou valeurs exportées au besoin ...
  }
}
