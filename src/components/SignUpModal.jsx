import React, { useContext, useRef, useState } from 'react'
import { Modal, Button, Form, InputGroup } from 'react-bootstrap'
import { UserContext } from '../context/userContext'
import { Envelope, LockFill, PersonBadge } from 'react-bootstrap-icons'
import { useNavigate } from 'react-router-dom'

export default function SignUpModal() {
  const { modalState, toggleModals, signUp } = useContext(UserContext)

  const navigate = useNavigate()
  const [validation, setValidation] = useState('')

  const emailRef = useRef()
  const passwordRef = useRef()
  const repeatPwdRef = useRef()
  const displayNameRef = useRef()

  const handleForm = async (e) => {
    e.preventDefault()

    const email = emailRef.current.value
    const password = passwordRef.current.value
    const repeatPassword = repeatPwdRef.current.value
    const displayName = displayNameRef.current.value

    if (password.length < 6 || repeatPassword.length < 6) {
      setValidation('6 caractères min')
      return
    }

    if (password !== repeatPassword) {
      setValidation('Le mot de passe ne correspond pas')
      return
    }

    if (!displayName.trim()) {
      setValidation("Le nom d'affichage est requis")
      return
    }

    try {
      await signUp(email, password, displayName)
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
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>S'inscrire</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleForm}>
          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <PersonBadge />
              </InputGroup.Text>
              <Form.Control
                ref={displayNameRef}
                type="text"
                required
                placeholder="Nom d'affichage"
              />
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <Envelope />
              </InputGroup.Text>
              <Form.Control
                ref={emailRef}
                type="email"
                required
                placeholder="Entrer email"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <LockFill />
              </InputGroup.Text>
              <Form.Control
                ref={passwordRef}
                type="password"
                required
                placeholder="Mot de passe"
              />
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-3">
            <InputGroup>
              <InputGroup.Text>
                <LockFill />
              </InputGroup.Text>
              <Form.Control
                ref={repeatPwdRef}
                type="password"
                required
                placeholder="Répéter le mot de passe"
              />
            </InputGroup>
            <Form.Text className="text-danger">{validation}</Form.Text>
          </Form.Group>

          <Button variant="secondary" type="submit">
            Valider
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
