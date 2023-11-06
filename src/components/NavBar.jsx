import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { auth } from '../firebaseConfig'
import logo from '../assets/images/logo.jpg'
export default function Navbar() {
  const { currentUser, toggleModals } = useContext(UserContext)

  const navigate = useNavigate()

  const logOut = async () => {
    try {
      await signOut(auth)
      navigate('/private/private-home')
    } catch {
      alert(
        'Pour certaines raisons, nous ne pouvons pas nous déconnecter, veuillez vérifier votre connexion internet et réessayer.',
      )
    }
  }

  return (
    <nav
      className="navbar navbar-light bg-light px-4 p-1 mx-auto rounded-top"
      style={{ zIndex: 10000, maxWidth: '800px' }}
    >
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="Logo" height="30" />{' '}
        {/* Mettre à jour l'attribut 'height' selon la taille souhaitée */}
      </Link>

      <div>
        {!currentUser && (
          <>
            <button
              onClick={() => toggleModals('signUp')}
              className="btn btn-secondary btn-sm"
            >
              S'inscrire
            </button>
            {/* Button pour la connexion remplacé par le modal */}
          </>
        )}
        {currentUser && (
          <button onClick={logOut} className="btn btn-danger btn-sm ms-2">
            Déconnexion
          </button>
        )}
      </div>
    </nav>
  )
}
