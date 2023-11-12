import React, { useContext, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import SignUpModal from './components/SignUpModal'
import SignInModal from './components/SignInModal'
import Private from './pages/Private/Private'
import PrivateHome from './pages/Private/PrivateHome/PrivateHome'
import 'leaflet/dist/leaflet.css'
import ErrorBoundary from './components/ui/ErrorBoundary'
import Footer from './components/Footer'
import {
  initializeDBFromFirestore,
  checkIfDataIsInitialized,
  logCurrentData,
} from './db/sync'

import { UserContext } from './context/userContext'
import { AlertProvider } from './context/AlertContext'
import AlertContainer from './components/AlertContainer'

function App() {
  const { currentUser } = useContext(UserContext)

  useEffect(() => {
    if (currentUser) {
      initializeDBFromFirestore().catch(console.error)
      checkIfDataIsInitialized()
      logCurrentData()
    }
  }, [currentUser])

  return (
    <AlertProvider>
      {' '}
      <ErrorBoundary>
        <>
          <AlertContainer /> <SignUpModal />
          <SignInModal />
          {!currentUser && <NavBar />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/private" element={<Private />}>
              <Route path="/private/private-home" element={<PrivateHome />} />
            </Route>
          </Routes>
          <Footer />
        </>
      </ErrorBoundary>
    </AlertProvider>
  )
}

export default App
