// src/components/views/AddObservationModal.jsx
import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
// import DateTimeInput from './DateTimeInput'
import DateTimeInput from '../form/inputs/DateTimeInput'
import PhotoCapture from '../form/PhotoCapture'
import Notes from '../form/inputs/Notes'

const AddObservationModal = ({ show, onHide, title, handleSubmit }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Form onSubmit={handleSubmit}>
          <DateTimeInput />
          <div className="d-flex gap-3">
            <PhotoCapture />
            <Notes />
          </div>
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
