import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useModal } from '../context/ModalContext'

const EstablishmentModal = () => {
  const { modalConfig, setModalConfig } = useModal()

  const handleClose = () => {
    setModalConfig((prevConfig) => ({ ...prevConfig, isVisible: false }))
  }

  return (
    <Modal show={modalConfig.isVisible} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{modalConfig.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{modalConfig.body}</Modal.Body>
      <Modal.Footer>
        {modalConfig.buttons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant || 'secondary'}
            onClick={button.onClick || handleClose}
          >
            {button.text}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  )
}

export default EstablishmentModal
