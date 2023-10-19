import React, { useState } from 'react'
import { geocodeAddress } from '../api/geocode'

function GeocodeForm({ onSelectAddress, currentCoords }) {
  const [address, setAddress] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [dateOfObservation, setDateOfObservation] = useState('')
  const [timeOfObservation, setTimeOfObservation] = useState('')
  const [autocompleteResults, setAutocompleteResults] = useState([])
  const [isNameValidated, setIsNameValidated] = useState(false)
  const defaultName = 'Entreprise X'

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

  const handleSuggestionClick = (feature) => {
    setAddress(feature.properties.label)
    if (onSelectAddress && feature.geometry) {
      onSelectAddress({
        coordinates: feature.geometry.coordinates,
        companyName: companyName,
      })
    }
    setAutocompleteResults([])
  }

  const handleCompanyNameValidation = () => {
    setIsNameValidated(true)
    // Envoyer les informations mises à jour si une adresse est déjà sélectionnée
    if (address) {
      if (onSelectAddress) {
        onSelectAddress({
          coordinates: currentCoords, // Utilisez les coordonnées actuelles
          companyName: companyName,
        })
      }
    }
  }

  const handleCompanyNameModification = () => {
    setIsNameValidated(false)
  }

  const handleIDontKnowClick = () => {
    setCompanyName(defaultName)
    setIsNameValidated(true)
  }

  return (
    <div className="my-4">
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
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Entrez le nom de l'entreprise"
          disabled={isNameValidated}
        />
        {!isNameValidated ? (
          <>
            <button
              className="btn btn-success mt-2"
              onClick={handleCompanyNameValidation}
              disabled={!companyName.trim()} // Désactiver le bouton si companyName est vide
            >
              Valider
            </button>
            <button
              type="button"
              className="btn btn-link mt-2"
              onClick={handleIDontKnowClick}
            >
              Je ne sais pas
            </button>
          </>
        ) : (
          <button
            className="btn btn-warning mt-2"
            onClick={handleCompanyNameModification}
          >
            Modifier
          </button>
        )}
      </div>

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
          onChange={handleAddressChange}
          placeholder="Saisissez une adresse"
          required
          disabled={!isNameValidated}
          style={{ zIndex: 6 }}
        />
        <div
          className="position-relative mt-n5"
          style={{ zIndex: 3, marginTop: '-5px' }}
        >
          <ul className="autocomplete-list position-absolute w-100 bg-white p-0">
            {autocompleteResults.map((feature, index) =>
              feature.properties ? (
                <li
                  key={index}
                  className="p-2"
                  onClick={() => handleSuggestionClick(feature)}
                  style={{ zIndex: 3 }}
                >
                  {feature.properties.label}
                </li>
              ) : null,
            )}
          </ul>
        </div>
      </div>

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
            onChange={(e) => setDateOfObservation(e.target.value)}
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
            onChange={(e) => setTimeOfObservation(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default GeocodeForm
