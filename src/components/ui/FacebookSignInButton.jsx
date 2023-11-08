import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext'
import { Button } from 'react-bootstrap'
import { Facebook } from 'react-bootstrap-icons'

const FacebookSignInButton = () => {
  const { facebookSignIn } = useContext(UserContext)
  const navigate = useNavigate()

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn()
      navigate('/private/private-home')
    } catch (error) {
      console.error('Erreur lors de la connexion avec Facebook', error)
    }
  }

  return (
    <Button
      onClick={handleFacebookSignIn}
      variant="primary"
      className="text-start"
    >
      <Facebook size={24} className="me-2" /> Se connecter avec Facebook
    </Button>
  )
}

export default FacebookSignInButton
