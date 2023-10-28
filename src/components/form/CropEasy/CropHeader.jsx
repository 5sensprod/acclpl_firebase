import React from 'react'
import { Modal } from 'react-bootstrap'

function CropHeader({ title = 'Crop Image' }) {
  return (
    <Modal.Header closeButton>
      <Modal.Title>{title}</Modal.Title>
    </Modal.Header>
  )
}

export default CropHeader
