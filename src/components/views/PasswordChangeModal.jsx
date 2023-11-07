// PasswordChangeModal.jsx
import React, { useState, useContext } from 'react'
import { Modal, Button, Form, InputGroup, Alert, Toast } from 'react-bootstrap'
import { LockFill, ShieldLockFill } from 'react-bootstrap-icons'
import { UserContext } from '../../context/userContext'

const PasswordChangeModal = ({ showModal, handleClose }) => {
  const { reauthenticateWithCredential, changePassword } =
    useContext(UserContext)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [error, setError] = useState('')
  const [showToast, setShowToast] = useState(false)

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
    setError('')
    setShowToast(false) // Si vous voulez aussi cacher le toast lors de la réinitialisation
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas.')
      return
    }
    try {
      await reauthenticateWithCredential(currentPassword)
      await changePassword(newPassword)
      setShowToast(true) // Affiche le toast de succès
      resetForm() // Réinitialise le formulaire
      handleClose() // Fermez la modal après le changement de mot de passe
    } catch (error) {
      setError(
        "Une erreur s'est produite lors du changement de mot de passe. Assurez-vous que votre mot de passe actuel est correct.",
      )
    }
  }

  const handleModalClose = () => {
    resetForm()
    handleClose()
  }

  return (
    <>
      <Modal show={showModal} onHide={handleModalClose} centered>
        <Modal.Header closeButton className="bg-dark text-light">
          <Modal.Title>Changer de mot de passe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handlePasswordChange}>
            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <ShieldLockFill />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Mot de passe actuel"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <LockFill />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Nouveau mot de passe"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <InputGroup>
                <InputGroup.Text>
                  <LockFill />
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Confirmer le nouveau mot de passe"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </InputGroup>
            </Form.Group>

            <Button variant="secondary" type="submit">
              Valider
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        bg="success"
        position="top-end"
      >
        <Toast.Body>Votre mot de passe a été changé avec succès !</Toast.Body>
      </Toast>
    </>
  )
}

export default PasswordChangeModal
