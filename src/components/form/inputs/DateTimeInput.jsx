import React from 'react'
import { InputWrapper } from './InputWrapper'
import { useFormWizardState } from '../wizard/FormWizardContext'

const DateTimeInput = () => {
  const { dispatch, state } = useFormWizardState()

  const handleDateChange = (event) => {
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { dateOfObservation: event.target.value },
    })
  }

  const handleTimeChange = (event) => {
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { timeOfObservation: event.target.value },
    })
  }

  return (
    <div className="row">
      <div className="form-group col-md-6 mb-1">
        <InputWrapper label="Date de la constatation" id="date-input">
          <input
            id="date-input"
            type="date"
            className="form-control"
            value={state.formData.dateOfObservation}
            onChange={handleDateChange}
          />
        </InputWrapper>
      </div>

      <div className="form-group col-md-6 mb-1">
        <InputWrapper label="Heure de la constatation" id="time-input">
          <input
            id="time-input"
            type="time"
            className="form-control"
            value={state.formData.timeOfObservation}
            onChange={handleTimeChange}
          />
        </InputWrapper>
      </div>
    </div>
  )
}

export default DateTimeInput
