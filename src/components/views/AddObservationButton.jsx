import React from 'react'
import { Button } from 'react-bootstrap'
import { Plus } from 'react-bootstrap-icons'

const AddObservationButton = ({ onClick }) => {
  return (
    <Button variant="link" onClick={onClick} className="text-light">
      <Plus size="32" />
    </Button>
  )
}

export default AddObservationButton
