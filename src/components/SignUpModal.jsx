import React, { useContext, useRef, useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { UserContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'

export default function SignUpModal() {
  const { modalState, toggleModals, signUp } = useContext(UserContext)

  const navigate = useNavigate()
  const [validation, setValidation] = useState('')

  const emailRef = useRef()
  const passwordRef = useRef()
  const repeatPwdRef = useRef()

  const handleForm = async (e) => {
    e.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value
    const repeatPassword = repeatPwdRef.current.value

    if (password.length < 6 || repeatPassword.length < 6) {
      setValidation('6 caractères min')
      return
    }

    if (password !== repeatPassword) {
      setValidation('Le mot de passe ne correspond pas')
      return
    }

    try {
      await signUp(email, password)
      setValidation('')
      toggleModals('close')
      navigate('/private/private-home')
    } catch (err) {
      if (err.code === 'auth/invalid-email') {
        setValidation("Format d'adresse invalide")
      }
      if (err.code === 'auth/email-already-in-use') {
        setValidation("L'adresse est déjà utilisée")
      }
    }
  }

  const closeModal = () => {
    setValidation('')
    toggleModals('close')
  }

  return (
    <Modal show={modalState.signUpModal} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>S'inscrire</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleForm}>
          <Form.Group className="mb-3">
            <Form.Label>Adresse email</Form.Label>
            <Form.Control
              ref={emailRef}
              type="email"
              required
              placeholder="Entrer email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mot de passe</Form.Label>
            <Form.Control
              ref={passwordRef}
              type="password"
              required
              placeholder="Mot de passe"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Répeter le mot de passe</Form.Label>
            <Form.Control
              ref={repeatPwdRef}
              type="password"
              required
              placeholder="Répeter le mot de passe"
            />
            <Form.Text className="text-danger">{validation}</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            S'inscrire
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
