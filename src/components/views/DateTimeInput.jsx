import React, { useState } from 'react'
import { Button } from 'react-bootstrap'

const DateTimeInput = ({ onDateTimeChange }) => {
  const [dateOfObservation, setDateOfObservation] = useState('')
  const [timeOfObservation, setTimeOfObservation] = useState('')

  const setToCurrentDateTime = () => {
    const currentDate = new Date()
    const formattedDate = currentDate.toISOString().slice(0, 10)
    const formattedTime = currentDate.toTimeString().slice(0, 5)

    setDateOfObservation(formattedDate)
    setTimeOfObservation(formattedTime)

    if (onDateTimeChange) {
      onDateTimeChange(formattedDate, formattedTime)
    }
  }

  return (
    <div className="d-flex justify-content-between mb-3 gap-3">
      <DateTimeSection
        label="Date"
        id="date-input"
        type="date"
        value={dateOfObservation}
        onChange={(e) => setDateOfObservation(e.target.value)}
      />
      <DateTimeSection
        label="Heure"
        id="time-input"
        type="time"
        value={timeOfObservation}
        onChange={(e) => setTimeOfObservation(e.target.value)}
      />
      <Button variant="secondary" onClick={setToCurrentDateTime}>
        Maintenant
      </Button>
    </div>
  )
}

const DateTimeSection = ({ label, id, type, value, onChange }) => (
  <div className="w-50">
    <label htmlFor={id} className="form-label">
      {label}
    </label>
    <input
      id={id}
      type={type}
      className="form-control"
      value={value}
      onChange={onChange}
    />
  </div>
)

export default DateTimeInput
