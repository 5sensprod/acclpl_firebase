import React, { useEffect } from 'react'

import { Modal, Button, Form } from 'react-bootstrap'

const AddObservationModal = ({ show, onHide, establishment }) => {
  // Ajoutez ici votre logique de formulaire

  useEffect(() => {
    console.log('Props reçues par AddObservationModal:', establishment)
  }, [establishment])

  const handleSubmit = (event) => {
    event.preventDefault()
    // Ici, vous traiterez la soumission du formulaire
    console.log(
      "Une nouvelle observation est ajoutée pour l'établissement: ",
      establishment,
    )
    onHide() // Cacher la modal après la soumission
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Ajouter une observation à {establishment.name || "l'établissement"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* ... champs de formulaire */}
        <Form onSubmit={handleSubmit}>
          {/* ... autres éléments du formulaire */}
        </Form>
        <Button variant="primary" type="submit" onClick={handleSubmit}>
          Soumettre
        </Button>
      </Modal.Body>
    </Modal>
  )
}

export default AddObservationModal
