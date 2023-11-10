// src/components/views/AddObservationModal.jsx
import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import DateTimeInput from './DateTimeInput'

const AddObservationModal = ({ show, onHide, title, handleSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <DateTimeInput />
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-dark text-light text-start">
        <Button variant="secondary" type="submit" onClick={handleSubmit}>
          Soumettre
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddObservationModal
