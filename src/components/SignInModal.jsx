import React, { useContext, useRef, useState } from 'react'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
import { Modal, Button, Form } from 'react-bootstrap'

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
      navigate('/')
    } catch {
      setValidation("Oups, L'adresse email ou le mot de passe est invalide")
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
            <Form.Label>Adresse email</Form.Label>
            <Form.Control
              ref={emailRef}
              type="email"
              placeholder="Entrer email"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              ref={passwordRef}
              type="password"
              placeholder="Mot de passe"
              required
            />
            <Form.Text className="text-danger">{validation}</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Se connecter
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
