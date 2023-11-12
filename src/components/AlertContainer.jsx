// src/components/AlertContainer.jsx
import React, { useEffect } from 'react'
import { useAlert } from '../context/AlertContext'
import AlertMessage from './ui/AlertMessage'

const AlertContainer = () => {
  const { alert, hideAlert } = useAlert()

  useEffect(() => {
    if (alert.show) {
      // Disparaît après 5 secondes
      const timer = setTimeout(hideAlert, 5000)
      return () => clearTimeout(timer)
    }
  }, [alert, hideAlert])

  return (
    <AlertMessage
      variant={alert.variant}
      message={alert.message}
      onClose={hideAlert} // Permet de fermer manuellement l'alerte
    />
  )
}

export default AlertContainer
