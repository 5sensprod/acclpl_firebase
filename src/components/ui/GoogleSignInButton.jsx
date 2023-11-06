import { useContext } from 'react'
import { useNavigate } from 'react-router-dom' // Importez useNavigate
import { UserContext } from '../../context/userContext'
import { Button } from 'react-bootstrap'
import { Google } from 'react-bootstrap-icons'

const GoogleSignInButton = () => {
  const { googleSignIn } = useContext(UserContext)
  const navigate = useNavigate() // Initialisez useNavigate

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn()
      // gérer la réussite de la connexion
      navigate('/private/private-home') // Ajoutez la redirection ici
    } catch (error) {
      // gérer les erreurs
      console.error(error)
    }
  }

  return (
    <Button
      variant="light"
      className="text-dark d-flex align-items-center"
      onClick={handleGoogleSignIn}
    >
      <Google size={24} className="me-2" /> {/* Icône Google */}
      Connectez-vous avec Google
    </Button>
  )
}

export default GoogleSignInButton
