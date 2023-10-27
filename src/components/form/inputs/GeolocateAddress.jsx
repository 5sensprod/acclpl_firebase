import React from 'react'
import { Button } from 'react-bootstrap'
import { InputWrapper, StyledInput } from './InputWrapper'
import useGeolocationAddress from '../wizard/useGeolocationAddress'
import { useFormWizardState } from '../wizard/FormWizardContext'

const GeolocateAddress = (props) => {
  const { dispatch, state } = useFormWizardState()

  const {
    address,
    autocompleteResults,
    handleAddressChange,
    handleSuggestionClick,
    handleGeolocationClick,
  } = useGeolocationAddress(state.formData.companyAddress, (coords, label) => {
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: {
        companyAddress: label,
        companyCoordinates: coords,
      },
    })
  })

  return (
    <div>
      <InputWrapper label="Adresse de l'entreprise" id="company-address-input">
        <StyledInput
          id="company-address-input"
          name="companyAddress"
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="Saisissez une adresse"
          required
        />
        <Button variant="secondary" onClick={handleGeolocationClick}>
          Me géolocaliser
        </Button>
      </InputWrapper>

      <div className="position-relative">
        <ul className="list-group autocomplete-list position-absolute w-100 bg-white p-0">
          {autocompleteResults.map((feature, index) =>
            feature.properties ? (
              <li
                key={index}
                className="list-group-item list-group-item-action p-2"
                onClick={() => handleSuggestionClick(feature)}
              >
                {feature.properties.label}
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </div>
  )
}

export default GeolocateAddress
