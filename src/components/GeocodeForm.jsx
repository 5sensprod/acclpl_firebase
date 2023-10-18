import React, { useState } from 'react'
import { geocodeAddress } from '../api/geocode'

function GeocodeForm({ onSelectAddress }) {
  const [address, setAddress] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [dateOfObservation, setDateOfObservation] = useState('')
  const [timeOfObservation, setTimeOfObservation] = useState('')
  const [autocompleteResults, setAutocompleteResults] = useState([])

  const handleAddressChange = async (e) => {
    const query = e.target.value
    setAddress(query)

    if (query.length < 5) {
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
        coordinates: feature.geometry.coordinates, // Modifié 'coords' à 'coordinates' pour la cohérence
        companyName: companyName,
      })
    }
    setAutocompleteResults([])
  }

  return (
    <div className="my-4">
      <div className="form-group mb-3">
        <label htmlFor="company-name-input" className="text-light">
          Nom de l'entreprise
        </label>
        <input
          id="company-name-input"
          name="companyName" // Ajout de l'attribut 'name'
          type="text"
          className="form-control"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="Entrez le nom de l'entreprise"
          required // Ajout de l'attribut 'required'
        />
      </div>

      <div className="form-group mb-3">
        <label htmlFor="address-input" className="text-light">
          Adresse de l'entreprise
        </label>
        <input
          id="address-input"
          name="companyAddress" // Ajout de l'attribut 'name'
          type="text"
          className="form-control"
          value={address}
          onChange={handleAddressChange}
          placeholder="Saisissez une adresse"
          required // Ajout de l'attribut 'required'
        />
        <div className="position-relative">
          {autocompleteResults.map(
            (feature, index) =>
              feature.properties && (
                <div
                  key={index}
                  className="position-absolute bg-white w-100 border p-2"
                  onClick={() => handleSuggestionClick(feature)}
                >
                  {feature.properties.label}
                </div>
              ),
          )}
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
