import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { UserContextProvider } from './context/userContext'
import './index.css'
import 'leaflet/dist/leaflet.css'
import 'bootstrap/dist/css/bootstrap.min.css'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <React.StrictMode>
    <HashRouter>
      <UserContextProvider>
        <App />
      </UserContextProvider>
    </HashRouter>
  </React.StrictMode>,
)
