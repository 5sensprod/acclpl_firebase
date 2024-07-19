import React, { useState } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const BugReportModal = ({ show, onHide }) => {
  const [bugDescription, setBugDescription] = useState('')

  const handleSubmit = () => {
    // Logique pour soumettre le bug
    console.log('Bug description:', bugDescription)
    // Réinitialiser le formulaire et fermer la modal
    setBugDescription('')
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Signaler un bug</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="bugDescription">
            <Form.Label>Description du bug</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={bugDescription}
              onChange={(e) => setBugDescription(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Soumettre
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default BugReportModal
