import { Button } from 'react-bootstrap'
import { Plus } from 'react-bootstrap-icons'

const AddObservationButton = ({ establishmentRef, onAdd }) => {
  return (
    <Button
      variant="link"
      onClick={() => onAdd(establishmentRef)}
      className="text-light"
    >
      <Plus size="32" />
    </Button>
  )
}

export default AddObservationButton
