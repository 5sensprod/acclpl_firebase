import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const DeleteModal = ({ show, handleClose, handleConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation de suppression</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir supprimer ce signalement ? Cette action est
        irréversible.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          Supprimer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DeleteModal
