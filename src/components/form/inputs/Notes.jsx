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
    <div className="form-group m-0">
      <label htmlFor="additionalNotes">Notes supplémentaires</label>
      <textarea
        id="additionalNotes"
        className="form-control p-1 mb-3"
        value={state.formData.additionalNotes || ''}
        onChange={handleNotesChange}
        placeholder="Facultatif"
      />
    </div>
  )
}

export default Notes
