import { createContext, useContext, useState } from 'react'

const AlertContext = createContext()

export const useAlert = () => useContext(AlertContext)

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({
    show: false,
    message: '',
    variant: 'danger',
  })

  const showAlert = (message, variant = 'danger') => {
    setAlert({ show: true, message, variant })
  }

  const hideAlert = () => {
    setAlert({ ...alert, show: false })
  }

  return (
    <AlertContext.Provider value={{ alert, showAlert, hideAlert }}>
      {children}
    </AlertContext.Provider>
  )
}
