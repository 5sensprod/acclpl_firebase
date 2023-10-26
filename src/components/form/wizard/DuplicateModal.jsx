// DuplicateModal.jsx
import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const DuplicateModal = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Erreur</Modal.Title>
      </Modal.Header>
      <Modal.Body>Un doublon a été détecté !</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DuplicateModal
