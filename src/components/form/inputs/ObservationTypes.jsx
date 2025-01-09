// ObservationTypes.jsx
import React from 'react'
import { useFormWizardState } from '../context/FormWizardContext'

const ObservationTypes = () => {
  const { state, dispatch } = useFormWizardState()

  const observationTypes = [
    { id: 'colors', label: 'Les couleurs' },
    { id: 'windows', label: 'Les vitrines' },
    { id: 'sign', label: "L'enseigne" },
    { id: 'local', label: 'Le local' },
  ]

  const handleTypeChange = (typeId) => {
    const currentTypes = state.formData.observationTypes || []
    const newTypes = currentTypes.includes(typeId)
      ? currentTypes.filter((id) => id !== typeId)
      : [...currentTypes, typeId]

    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { observationTypes: newTypes },
    })
  }

  return (
    <div className="form-group m-0 w-100">
      <label className="mb-2">Types d'observation</label>
      <div className="d-flex flex-column gap-2">
        {observationTypes.map(({ id, label }) => (
          <div key={id} className="form-check">
            <input
              type="checkbox"
              id={id}
              className="form-check-input"
              checked={state.formData.observationTypes?.includes(id) || false}
              onChange={() => handleTypeChange(id)}
            />
            <label htmlFor={id} className="form-check-label">
              {label}
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ObservationTypes
