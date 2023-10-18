import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import SignUpModal from './components/SignUpModal'

function App() {
  return (
    <>
      <SignUpModal />
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </>
  )
}

export default App
