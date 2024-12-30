import React from 'react'
import { Modal, Button } from 'react-bootstrap'

const BaseModal = ({
  show,
  onHide,
  title,
  children,
  buttons,
  size = 'md',
  centered = true,
}) => {
  return (
    <Modal show={show} onHide={onHide} size={size} centered={centered}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {buttons.map((button, index) => (
          <Button
            key={index}
            variant={button.variant || 'secondary'}
            onClick={button.onClick}
          >
            {button.text}
          </Button>
        ))}
      </Modal.Footer>
    </Modal>
  )
}

export default BaseModal
