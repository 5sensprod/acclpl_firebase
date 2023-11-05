import React, { useState, useContext } from 'react'
import { UserContext } from '../context/userContext'
import { Button, Form, InputGroup, Collapse } from 'react-bootstrap'
import { Envelope, LockFill } from 'react-bootstrap-icons' // Importation des icônes nécessaires

const EmailSignInDropdown = () => {
  const { signIn } = useContext(UserContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [open, setOpen] = useState(false)

  const handleSignIn = async (e) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      // Gérer la réussite de la connexion ici
    } catch (error) {
      // Gérer les erreurs ici
      console.error('Erreur lors de la connexion avec l’e-mail', error)
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
        variant="secondary"
        className="text-start"
      >
        <Envelope size={24} className="me-2" /> {/* Icône d'enveloppe */}
        Se connecter avec l'email
      </Button>
      <Collapse in={open}>
        <div id="example-collapse-text">
          <Form onSubmit={handleSignIn}>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                @{/* Icône d'enveloppe à l'intérieur du champ de texte */}
              </InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Adresse e-mail"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text>
                <LockFill />{' '}
                {/* Icône de verrouillage à l'intérieur du champ de texte */}
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Mot de passe"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </InputGroup>
            <Button variant="primary" type="submit">
              Connexion
            </Button>
          </Form>
        </div>
      </Collapse>
    </>
  )
}

export default EmailSignInDropdown
