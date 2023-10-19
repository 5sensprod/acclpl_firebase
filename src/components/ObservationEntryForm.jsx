import React, { useState } from 'react'
import { reverseGeocode, geocodeAddress } from '../api/geocode'
import ValidatedToggleButton from './ValidatedToggleButton'
import PhotoCapture from './PhotoCapture'

function ObservationEntryForm({ onSelectAddress, currentCoords }) {
  const [address, setAddress] = useState('')
  const [isAddressValidated, setIsAddressValidated] = useState(false)
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
          coordinates: currentCoords, // Utilise les coordonnées actuelles
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

  const handleAddressValidation = () => {
    setIsAddressValidated(true)
  }

  const handleAddressModification = () => {
    setIsAddressValidated(false)
  }

  const handleGeolocationClick = async () => {
    if (!navigator.geolocation) {
      alert(
        "La géolocalisation n'est pas prise en charge par votre navigateur.",
      )
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude
        const lon = position.coords.longitude

        try {
          // Utilisation du géocodage inverse pour obtenir l'adresse
          const address = await reverseGeocode(lat, lon)
          if (address) {
            setAddress(address) // Met à jour l'adresse dans l'input
          } else {
            console.warn(
              'Géocodage inverse: aucune adresse trouvée pour ces coordonnées.',
            )
          }
        } catch (error) {
          console.error('Erreur lors du géocodage inverse:', error)
        }

        onSelectAddress({
          coordinates: [lon, lat],
          companyName: companyName,
        })
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            alert('Permission pour la géolocalisation refusée.')
            break
          case error.POSITION_UNAVAILABLE:
            alert('Information de localisation non disponible.')
            break
          case error.TIMEOUT:
            alert(
              "La requête pour obtenir la position de l'utilisateur a expiré.",
            )
            break
          case error.UNKNOWN_ERROR:
          default:
            alert("Une erreur inconnue s'est produite.")
            break
        }
      },
    )
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
        <ValidatedToggleButton
          isValidated={isNameValidated}
          onValidation={handleCompanyNameValidation}
          onModification={handleCompanyNameModification}
          disabled={!companyName.trim()}
        />

        {!isNameValidated && (
          <button
            type="button"
            className="btn text-light mt-2"
            onClick={handleIDontKnowClick}
            style={{ boxShadow: 'none', outline: 'none' }}
          >
            Je ne sais pas
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
                  onClick={() => handleSuggestionClick(feature)}
                  style={{ zIndex: 3 }}
                >
                  {feature.properties.label}
                </li>
              ) : null,
            )}
          </ul>
        </div>
        <ValidatedToggleButton
          isValidated={isAddressValidated}
          onValidation={handleAddressValidation}
          onModification={handleAddressModification}
          disabled={!address.trim()}
        />

        {!isAddressValidated && (
          <button
            type="button"
            className="btn text-light mt-2 btn"
            onClick={handleGeolocationClick}
            disabled={!isNameValidated}
            style={{ boxShadow: 'none', outline: 'none' }}
          >
            Me géolocaliser
          </button>
        )}
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
      <PhotoCapture />
    </div>
  )
}

export default ObservationEntryForm
