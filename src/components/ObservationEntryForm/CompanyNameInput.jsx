import React from 'react'
import ValidatedToggleButton from '../ValidatedToggleButton'

function CompanyNameInput({
  companyName,
  isNameValidated,
  onNameChange,
  onValidation,
  onModification,
  onIDontKnowClick,
}) {
  return (
    <div className="form-group mb-3">
      <label htmlFor="company-name-input" className="text-light">
        Nom de l'entreprise
      </label>
      <input
        id="company-name-input"
        name="companyName"
        type="text"
        className="form-control"
        value={companyName}
        onChange={onNameChange}
        placeholder="Entrez le nom de l'entreprise"
        disabled={isNameValidated}
      />
      <ValidatedToggleButton
        isValidated={isNameValidated}
        onValidation={onValidation}
        onModification={onModification}
        disabled={!companyName.trim()}
      />

      {!isNameValidated && (
        <button
          type="button"
          className="btn text-light mt-2"
          onClick={onIDontKnowClick}
          style={{ boxShadow: 'none', outline: 'none', border: 'none' }}
        >
          Je ne sais pas
        </button>
      )}
    </div>
  )
}

export default CompanyNameInput
