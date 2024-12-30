import React from 'react'
import { Button } from 'react-bootstrap'
import { InputWrapper, StyledInput } from './InputWrapper'
import useGeolocationAddress from '../hooks/useGeolocationAddress'
import { useFormWizardState } from '../context/FormWizardContext'

const GeolocateAddress = (props) => {
  const { dispatch, state } = useFormWizardState()

  // Détermine si l'établissement existe déjà
  const isExistingEstablishment =
    state.establishmentExists && state.formData.companyAddress

  const {
    address,
    autocompleteResults,
    handleAddressChange,
    handleSuggestionClick,
    handleGeolocationClick,
  } = useGeolocationAddress(state.formData.companyAddress, (coords, label) => {
    // Ne met à jour que si ce n'est pas un établissement existant
    if (!isExistingEstablishment) {
      dispatch({
        type: 'UPDATE_FORM_DATA',
        payload: {
          companyAddress: label,
          companyCoordinates: coords,
        },
      })
    }
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
          disabled={isExistingEstablishment} // Désactive l'input si établissement existant
          readOnly={isExistingEstablishment} // Ajoute readonly pour plus de sécurité
        />
        <Button
          variant="link"
          className="btn text-light mt-1 p-0"
          style={{
            textDecoration: 'none',
            opacity: isExistingEstablishment ? 0.5 : 1, // Réduit l'opacité si désactivé
            cursor: isExistingEstablishment ? 'not-allowed' : 'pointer', // Change le curseur
          }}
          onClick={handleGeolocationClick}
          disabled={isExistingEstablishment} // Désactive le bouton si établissement existant
        >
          Me géolocaliser
        </Button>
      </InputWrapper>
      {!isExistingEstablishment && ( // N'affiche les suggestions que si ce n'est pas un établissement existant
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
      )}
    </div>
  )
}

export default GeolocateAddress
