import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import { Button } from 'react-bootstrap'
import { Envelope } from 'react-bootstrap-icons' // Importation des icônes nécessaires

const EmailSignInButton = () => {
  const { toggleModals } = useContext(UserContext)

  return (
    <>
      <Button
        onClick={() => toggleModals('signIn')}
        variant="secondary"
        className="text-start"
      >
        <Envelope size={24} className="me-2" /> {/* Icône d'enveloppe */}
        Se connecter avec l'email
      </Button>
    </>
  )
}

export default EmailSignInButton
