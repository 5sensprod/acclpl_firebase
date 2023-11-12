import React, { useState, useContext } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { LockFill, ShieldLockFill } from 'react-bootstrap-icons'
import { UserContext } from '../../../context/userContext'
import { useToast } from '../../../context/toastContext'
import InputWithIcon from '../../ui/InputWithIcon'

const PasswordChangeModal = ({ showModal, handleClose }) => {
  const { reauthenticateWithCredential, changePassword } =
    useContext(UserContext)
  const { addToast } = useToast()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const resetForm = () => {
    setCurrentPassword('')
    setNewPassword('')
    setConfirmNewPassword('')
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmNewPassword) {
      addToast('Les nouveaux mots de passe ne correspondent pas.', 'danger')
      return
    }
    try {
      await reauthenticateWithCredential(currentPassword)
      await changePassword(newPassword)
      addToast('Votre mot de passe a été changé avec succès !', 'success')
      resetForm()
      handleClose()
    } catch (error) {
      addToast(
        "Une erreur s'est produite lors du changement de mot de passe. Assurez-vous que votre mot de passe actuel est correct.",
        'danger',
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
          <Form onSubmit={handlePasswordChange}>
            <InputWithIcon
              icon={<ShieldLockFill />}
              type="password"
              placeholder="Mot de passe actuel"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <InputWithIcon
              icon={<LockFill />}
              type="password"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <InputWithIcon
              icon={<LockFill />}
              type="password"
              placeholder="Confirmer le nouveau mot de passe"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
            />
            <Button variant="secondary" type="submit">
              Valider
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default PasswordChangeModal
