import React, { useContext, useRef, useState } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { Envelope, LockFill } from 'react-bootstrap-icons' // Importez les icônes nécessaires

export default function SignInModal() {
  const { modalState, toggleModals, signIn } = useContext(UserContext)

  const navigate = useNavigate()

  const [validation, setValidation] = useState('')

  const emailRef = useRef()
  const passwordRef = useRef()

  const handleForm = async (e) => {
    e.preventDefault()
    try {
      await signIn(emailRef.current.value, passwordRef.current.value)

      setValidation('')
      toggleModals('close')
      navigate('/private/private-home')
    } catch {
      setValidation("Oups, l'adresse email ou le mot de passe est invalide.")
    }
  }

  return (
    <Modal
      show={modalState.signInModal}
      onHide={() => toggleModals('close')}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Connexion</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleForm}>
          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <Envelope />{' '}
                {/* Icône d'enveloppe à l'intérieur du champ de texte */}
              </InputGroup.Text>
              <Form.Control
                ref={emailRef}
                type="email"
                placeholder="Adresse e-mail"
                required
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <LockFill />{' '}
                {/* Icône de verrouillage à l'intérieur du champ de texte */}
              </InputGroup.Text>
              <Form.Control
                ref={passwordRef}
                type="password"
                placeholder="Mot de passe"
                required
              />
            </InputGroup>
            <Form.Text className="text-danger">{validation}</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Connexion
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
