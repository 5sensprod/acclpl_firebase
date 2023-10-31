// ModalContext.js
import React, { createContext, useState, useContext } from 'react'

const ModalContext = createContext()

export const ModalProvider = ({ children }) => {
  const [modalConfig, setModalConfig] = useState({
    isVisible: false,
    title: '',
    body: '',
    buttons: [],
  })

  return (
    <ModalContext.Provider value={{ modalConfig, setModalConfig }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
