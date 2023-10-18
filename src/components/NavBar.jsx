import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebaseConfig'

export default function Navbar() {
  const { toggleModals } = useContext(UserContext)

  const navigate = useNavigate()

  const logOut = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch {
      alert(
        'Pour certaines raisons, nous ne pouvons pas nous déconnecter, veuillez vérifier votre connexion internet et réessayer.',
      )
    }
  }

  return (
    <nav className="navbar navbar-light bg-light px-4">
      <Link to="/" className="navbar-brand">
        Ensemble contre la pollution lumineuse
      </Link>

      <div>
        <button
          onClick={() => toggleModals('signUp')}
          className="btn btn-primary btn-sm"
        >
          S'inscrire
        </button>
        <button
          onClick={() => toggleModals('signIn')}
          className="btn btn-primary btn-sm ms-2"
        >
          Connexion
        </button>
        <button onClick={logOut} className="btn btn-danger btn-sm ms-2">
          Déconnexion
        </button>
      </div>
    </nav>
  )
}
