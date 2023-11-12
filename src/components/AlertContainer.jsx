import React from 'react'
import { useAlert } from '../context/AlertContext'
import AlertMessage from './ui/AlertMessage'

const AlertContainer = () => {
  const { alert, hideAlert } = useAlert()
  return (
    <AlertMessage
      key={Date.now()}
      variant={alert.variant}
      message={alert.message}
      onClose={hideAlert}
    />
  )
}

export default AlertContainer
