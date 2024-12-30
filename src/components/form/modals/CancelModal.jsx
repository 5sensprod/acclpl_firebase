import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const CancelModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation d'annulation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir annuler ce signalement ? Toutes les données
        saisies seront perdues.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Revenir
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Confirmer l'annulation
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CancelModal
