import React from 'react'

function ValidatedToggleButton({
  isValidated,
  onValidation,
  onModification,
  disabled,
}) {
  if (isValidated) {
    return (
      <button
        className="btn btn-warning mt-2 btn-sm"
        onClick={onModification}
        style={{ boxShadow: 'none', outline: 'none' }}
      >
        Modifier
      </button>
    )
  } else {
    return (
      <button
        className="btn btn-success mt-2"
        onClick={onValidation}
        disabled={disabled}
        style={{ boxShadow: 'none', outline: 'none' }}
      >
        Valider
      </button>
    )
  }
}

export default ValidatedToggleButton
