import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext'
import { Button } from 'react-bootstrap'
import { Google } from 'react-bootstrap-icons'

const GoogleSignInButton = () => {
  const { googleSignIn } = useContext(UserContext)
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn()
      navigate('/private/private-home')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Button
      variant="light"
      className="text-dark d-flex align-items-center"
      onClick={handleGoogleSignIn}
    >
      <Google size={24} className="me-2" />
      Se connectez avec Google
    </Button>
  )
}

export default GoogleSignInButton
