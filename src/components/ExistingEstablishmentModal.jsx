import { Modal, Button } from 'react-bootstrap'

function ExistingEstablishmentModal({
  show,
  street,
  companyName,
  onHide,
  onNoClick,
}) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Entreprise existante</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        S'agit-il de {companyName} situé {street && street.streetName} ?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onNoClick}>
          Non
        </Button>
        <Button variant="primary" onClick={onHide}>
          Oui
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ExistingEstablishmentModal
