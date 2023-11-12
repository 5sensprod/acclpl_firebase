import React, { createContext, useContext, useState } from 'react'
import { Toast } from 'react-bootstrap'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const addToast = (message, type = 'info') => {
    const id = Math.random().toString(36).substring(2, 11)
    setToasts((currentToasts) => [...currentToasts, { id, message, type }])

    setTimeout(() => removeToast(id), 3000)
  }

  const removeToast = (id) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    )
  }

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <>
      <div
        aria-live="polite"
        aria-atomic="true"
        className="toast-container position-fixed bottom-0 start-50 translate-middle-x"
        style={{ zIndex: 1100 }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            onClose={() => removeToast(toast.id)}
            show={true}
            delay={3000}
            autohide
            className="mb-3"
            bg={
              toast.type === 'info'
                ? 'primary'
                : toast.type === 'success'
                ? 'success'
                : 'danger'
            }
          >
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </div>
    </>
  )
}
