// src\components\form\inputs\additionalNotes.jsx
import React from 'react'
import { useFormWizardState } from '../context/FormWizardContext'

const Notes = () => {
  const { state, dispatch } = useFormWizardState()

  const handleNotesChange = (event) => {
    dispatch({
      type: 'UPDATE_ADDITIONAL_NOTES',
      payload: event.target.value,
    })
  }

  return (
    <div className="form-group">
      <label htmlFor="additionalNotes">Notes supplémentaires</label>
      <textarea
        id="additionalNotes"
        className="form-control"
        value={state.formData.additionalNotes || ''}
        onChange={handleNotesChange}
        placeholder="Ajoutez des notes supplémentaires concernant votre observation"
      />
    </div>
  )
}

export default Notes
