import React, { useState } from 'react'
import { geocodeAddress } from '../../../api/geocode'
import { InputWrapper, StyledInput } from './InputWrapper'
import { useFormWizardState } from '../wizard/FormWizardContext'

const AddressCompany = () => {
  const { state, dispatch } = useFormWizardState()
  const [address, setAddress] = useState(state.formData.companyAddress || '')
  const [autocompleteResults, setAutocompleteResults] = useState([])

  const handleAddressChange = async (e) => {
    const query = e.target.value
    setAddress(query)

    if (query.length < 3) {
      setAutocompleteResults([])
      return
    }

    try {
      const features = await geocodeAddress(query)
      setAutocompleteResults(features || [])
    } catch (err) {
      console.error("Erreur lors de l'autocomplétion:", err)
    }
  }

  const handleSuggestionClick = ({ properties }) => {
    if (!properties) return

    const { label } = properties
    setAddress(label)
    setAutocompleteResults([])

    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: { companyAddress: label },
    })
  }

  return (
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
      <div className="position-relative">
        <ul className="list-group autocomplete-list position-absolute w-100 bg-white p-0">
          {autocompleteResults.map(
            (feature, index) =>
              feature.properties && (
                <li
                  key={index}
                  className="list-group-item list-group-item-action p-2"
                  onClick={() => handleSuggestionClick(feature)}
                >
                  {feature.properties.label}
                </li>
              ),
          )}
        </ul>
      </div>
    </InputWrapper>
  )
}

export default AddressCompany
