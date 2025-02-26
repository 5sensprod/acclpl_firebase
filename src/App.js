import React, { useContext } from 'react'
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
import { UserContext } from './context/userContext'
import { FirestoreSync } from './FirestoreSync'

function App() {
  const { currentUser } = useContext(UserContext)

  return (
    <ErrorBoundary>
      <>
        {currentUser && <FirestoreSync />}
        <SignUpModal />
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
  )
}

export default App
