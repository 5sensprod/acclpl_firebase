import React from 'react'
import ValidatedToggleButton from '../ValidatedToggleButton'

function AddressInput({
  address,
  isAddressValidated,
  isNameValidated,
  onAddressChange,
  onValidation,
  onModification,
  onSuggestionClick,
  onGeolocationClick,
  autocompleteResults,
}) {
  return (
    <div className="form-group mb-3">
      <label htmlFor="address-input" className="text-light">
        Adresse de l'entreprise
      </label>
      <input
        id="address-input"
        name="companyAddress"
        type="text"
        className="form-control"
        value={address}
        onChange={onAddressChange}
        placeholder="Saisissez une adresse"
        required
        disabled={isAddressValidated || !isNameValidated}
        style={{ zIndex: 6 }}
      />
      <div className="position-relative" style={{ zIndex: 3 }}>
        <ul className="list-group autocomplete-list position-absolute w-100 bg-white p-0">
          {autocompleteResults.map((feature, index) =>
            feature.properties ? (
              <li
                key={index}
                className="list-group-item list-group-item-action p-2"
                onClick={() => onSuggestionClick(feature)}
                style={{ zIndex: 3 }}
              >
                {feature.properties.label}
              </li>
            ) : null,
          )}
        </ul>
      </div>
      <div className="col-md-12 mt-1">
        <ValidatedToggleButton
          isValidated={isAddressValidated}
          onValidation={onValidation}
          onModification={onModification}
          disabled={!address.trim()}
        />
      </div>

      {!isAddressValidated && (
        <button
          type="button"
          className="btn text-light mt-1"
          onClick={onGeolocationClick}
          disabled={!isNameValidated}
          style={{ boxShadow: 'none', outline: 'none', border: 'none' }}
        >
          Me géolocaliser
        </button>
      )}
    </div>
  )
}

export default AddressInput
