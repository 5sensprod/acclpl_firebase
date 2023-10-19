import React from 'react'

function ValidatedToggleButton({
  isValidated,
  onValidation,
  onModification,
  disabled,
}) {
  if (isValidated) {
    return (
      <button className="btn btn-warning mt-2" onClick={onModification}>
        Modifier
      </button>
    )
  } else {
    return (
      <button
        className="btn btn-success mt-2"
        onClick={onValidation}
        disabled={disabled}
      >
        Valider
      </button>
    )
  }
}

export default ValidatedToggleButton
