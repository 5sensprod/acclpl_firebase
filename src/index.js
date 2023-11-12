import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { UserContextProvider } from './context/userContext'
import './index.css'
import 'leaflet/dist/leaflet.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import { ToastProvider } from './context/toastContext'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <HashRouter>
      <UserContextProvider>
        <ToastProvider>
          {' '}
          <App />
        </ToastProvider>
      </UserContextProvider>
    </HashRouter>
  </React.StrictMode>,
)
