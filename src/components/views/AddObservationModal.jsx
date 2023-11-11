import React from 'react'
import { Modal, Form, Button, Spinner } from 'react-bootstrap'
import DateTimeInput from '../form/inputs/DateTimeInput'
import PhotoCapture from '../form/PhotoCapture'
import Notes from '../form/inputs/Notes'
import { useFormWizardState } from '../form/context/FormWizardContext'

const AddObservationModal = ({
  show,
  onHide,
  title,
  handleAddObservation,
  isLoading,
  setIsLoading,
}) => {
  const { dispatch, state } = useFormWizardState()
  const isDisabled =
    isLoading ||
    !state.formData.dateOfObservation ||
    !state.formData.timeOfObservation

  const handleClose = () => {
    setTimeout(() => {
      dispatch({ type: 'RESET_TO_DEFAULT_PHOTO' })
      dispatch({ type: 'RESET_DATE_TIME' })
      dispatch({ type: 'RESET_COMPANY_ADDRESS' })
      dispatch({
        type: 'RESET_COMPANY_NAME_MODAL',
      })
      dispatch({
        type: 'SET_ESTABLISHMENT_EXISTS',
        payload: false,
      })
      dispatch({ type: 'RESET_NOTES' })
      dispatch({ type: 'SET_CURRENT_ESTABLISHMENT_ID', payload: null })
    }, 500)
    onHide()
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Form onSubmit={handleAddObservation}>
          <DateTimeInput />
          <div className="d-flex gap-3">
            <PhotoCapture />
            <Notes />
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer className="bg-dark text-light text-start">
        <Button
          variant="primary"
          type="submit"
          onClick={() => {
            setIsLoading(true)
            handleAddObservation()
          }}
          disabled={isDisabled} // Utilisez ici isDisabled
        >
          {isLoading ? (
            <>
              <Spinner animation="border" size="sm" /> Chargement...
            </>
          ) : (
            'Soumettre'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddObservationModal
