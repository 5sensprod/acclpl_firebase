import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import LeafletMap from '../../LeafletMap'

const PreviewModal = ({
  show,
  onHide,
  formData,
  previewPhotoURL,
  isDefaultPhoto,
  photoURL,
}) => {
  const imageURL = isDefaultPhoto ? previewPhotoURL : photoURL

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Prévisualisation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LeafletMap
          markerCoords={formData.companyCoordinates}
          companyName={formData.companyName}
          imageURL={imageURL} // Utilisez imageURL ici
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default PreviewModal
