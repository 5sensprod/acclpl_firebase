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
// import SidebarMenu from './components/ui/SidebarMenu'

import { UserContext } from './context/userContext' // Assurez-vous que le chemin d'accès est correct

function App() {
  const { currentUser } = useContext(UserContext)

  return (
    <ErrorBoundary>
      <>
        <SignUpModal />
        <SignInModal />
        {!currentUser && <NavBar />}
        {/* {currentUser && <SidebarMenu />} */}
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
