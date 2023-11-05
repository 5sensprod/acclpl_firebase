import React, { useContext } from 'react'
import { UserContext } from '../context/userContext'
import { Button } from 'react-bootstrap'
import { Facebook } from 'react-bootstrap-icons' // Assurez-vous d'avoir installé react-bootstrap-icons

const FacebookSignInButton = () => {
  const { facebookSignIn } = useContext(UserContext)

  const handleFacebookSignIn = async () => {
    try {
      await facebookSignIn()
      // Gérer la réussite de la connexion ici
    } catch (error) {
      // Gérer les erreurs ici
      console.error('Erreur lors de la connexion avec Facebook', error)
    }
  }

  return (
    <Button onClick={handleFacebookSignIn} variant="primary">
      <Facebook className="me-2" /> Connectez-vous avec Facebook
    </Button>
  )
}

export default FacebookSignInButton
