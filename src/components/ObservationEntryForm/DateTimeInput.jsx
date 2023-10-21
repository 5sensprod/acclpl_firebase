import React from 'react'

function DateTimeInput({
  dateOfObservation,
  timeOfObservation,
  onDateChange,
  onTimeChange,
}) {
  return (
    <div className="row">
      <div className="form-group col-md-6 mb-3">
        <label htmlFor="date-input" className="text-light">
          Date de la constatation
        </label>
        <input
          id="date-input"
          type="date"
          className="form-control"
          value={dateOfObservation}
          onChange={onDateChange}
        />
      </div>

      <div className="form-group col-md-6 mb-3">
        <label htmlFor="time-input" className="text-light">
          Heure de la constatation
        </label>
        <input
          id="time-input"
          type="time"
          className="form-control"
          value={timeOfObservation}
          onChange={onTimeChange}
        />
      </div>
    </div>
  )
}

export default DateTimeInput
