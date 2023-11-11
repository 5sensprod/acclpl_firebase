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
    <div className="form-group m-0 w-75">
      <label htmlFor="additionalNotes" className="mb-2">
        Notes
      </label>
      <textarea
        id="additionalNotes"
        className="form-control p-1 mb-3"
        style={{ height: '187px' }}
        value={state.formData.additionalNotes || ''}
        onChange={handleNotesChange}
        placeholder="Facultatif"
      />
    </div>
  )
}

export default Notes
