import React from 'react'
import { InputWrapper } from './InputWrapper'
import { Button } from 'react-bootstrap'
import { useFormWizardState } from '../context/FormWizardContext'

const DateTimeInput = () => {
  const { dispatch, state } = useFormWizardState()

  const handleInputChange = (field) => (event) => {
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { [field]: event.target.value },
    })
  }

  const setToCurrentDateTime = () => {
    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().slice(0, 10)
    const formattedTime = currentDate.toTimeString().slice(0, 5)

    handleInputChange('dateOfObservation')({ target: { value: formattedDate } })
    handleInputChange('timeOfObservation')({ target: { value: formattedTime } })
  }

  return (
    <div className="d-flex justify-content-between mb-0 gap-3">
      <DateTimeSection
        label="Date"
        id="date-input"
        type="date"
        value={state.formData.dateOfObservation}
        onChange={handleInputChange('dateOfObservation')}
        buttonLabel="Maintenant"
        onClickButton={setToCurrentDateTime}
      />
      <DateTimeSection
        label="Heure"
        id="time-input"
        type="time"
        value={state.formData.timeOfObservation}
        onChange={handleInputChange('timeOfObservation')}
      />
    </div>
  )
}

const DateTimeSection = ({
  label,
  id,
  type,
  value,
  onChange,
  buttonLabel,
  onClickButton,
}) => (
  <div className="mb-0 w-50">
    <InputWrapper label={label} id={id}>
      <input
        id={id}
        type={type}
        className="form-control"
        value={value}
        onChange={onChange}
      />
      {buttonLabel && (
        <Button
          variant="link"
          className="btn text-light mb-0 p-1 ps-0 pb-0"
          style={{ textDecoration: 'none' }}
          onClick={onClickButton}
        >
          {buttonLabel}
        </Button>
      )}
    </InputWrapper>
  </div>
)

export default DateTimeInput
