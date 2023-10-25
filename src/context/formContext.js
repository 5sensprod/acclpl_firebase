import { createContext, useReducer } from 'react'

export const FormContext = createContext()

const initialState = {
  // Définissez votre état initial ici
}

const formReducer = (state, action) => {
  // Traitez les actions ici
  return state
}

export const FormProvider = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState)

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  )
}
