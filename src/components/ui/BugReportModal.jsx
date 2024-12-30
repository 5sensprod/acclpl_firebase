import React, { useState, useContext } from 'react'
import { Modal, Button, Form, Alert } from 'react-bootstrap'
import { UserContext } from '../../context/userContext' // Ajoutez cet import

const BugReportModal = ({ show, onHide }) => {
  const [bugDescription, setBugDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState({ type: '', message: '' })
  const { currentUser } = useContext(UserContext) // Pour récupérer l'email de l'utilisateur

  const handleSubmit = async () => {
    if (!bugDescription.trim()) {
      setFeedback({
        type: 'danger',
        message: 'Veuillez décrire le bug rencontré',
      })
      return
    }

    setIsSubmitting(true)
    setFeedback({ type: '', message: '' })

    const formData = new FormData()
    formData.append('bugDescription', bugDescription)
    formData.append('userEmail', currentUser?.email || 'Utilisateur anonyme')

    try {
      const response = await fetch(
        'https://ecoveille.acclpl.fr/send_email.php',
        {
          method: 'POST',
          body: formData,
        },
      )

      const result = await response.json()

      if (result.status === 'success') {
        setFeedback({
          type: 'success',
          message: 'Votre signalement a été envoyé avec succès',
        })
        setTimeout(() => {
          setBugDescription('')
          onHide()
          setFeedback({ type: '', message: '' })
        }, 2000)
      } else {
        throw new Error(result.message || "Erreur lors de l'envoi")
      }
    } catch (error) {
      setFeedback({
        type: 'danger',
        message: `Erreur: ${error.message}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Signaler un bug</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {feedback.message && (
          <Alert variant={feedback.type} className="mb-3">
            {feedback.message}
          </Alert>
        )}
        <Form>
          <Form.Group controlId="bugDescription">
            <Form.Label>Description du bug</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
              placeholder="Décrivez le problème rencontré en détail..."
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isSubmitting}>
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Soumettre'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BugReportModal
