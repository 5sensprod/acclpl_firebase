import React from 'react'
import { InputWrapper } from './InputWrapper'
import { Button } from 'react-bootstrap'
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

  const setToCurrentDateTime = () => {
    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().slice(0, 10)
    const formattedTime = currentDate.toTimeString().slice(0, 5)

    handleDateChange({ target: { value: formattedDate } })
    handleTimeChange({ target: { value: formattedTime } })
  }

  return (
    <div className="d-flex justify-content-between mb-0 gap-3">
      <div className="mb-0 w-50">
        <InputWrapper label="Date de la constatation" id="date-input">
          <input
            id="date-input"
            type="date"
            className="form-control"
            value={state.formData.dateOfObservation}
            onChange={handleDateChange}
          />
          <Button
            variant="link"
            className="btn text-light mb-1 p-1 "
            style={{ textDecoration: 'none' }}
            onClick={setToCurrentDateTime}
          >
            Maintenant
          </Button>
        </InputWrapper>
      </div>

      <div className="mb-0 w-50">
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
