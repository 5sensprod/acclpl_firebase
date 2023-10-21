import React, { useState } from 'react'
import { reverseGeocode, geocodeAddress } from '../../api/geocode'
import CompanyNameInput from './CompanyNameInput'
import AddressInput from './AddressInput'
import DateTimeInput from './DateTimeInput'
import PhotoCaptureInput from './PhotoCaptureInput'

function ObservationEntryForm({
  onSelectAddress,
  currentCoords,
  onSelectImage,
}) {
  const [address, setAddress] = useState('')
  const [isAddressValidated, setIsAddressValidated] = useState(false)
  const [companyName, setCompanyName] = useState('')
  const [dateOfObservation, setDateOfObservation] = useState('')
  const [timeOfObservation, setTimeOfObservation] = useState('')
  const [autocompleteResults, setAutocompleteResults] = useState([])
  const [isNameValidated, setIsNameValidated] = useState(false)
  const defaultName = 'Entreprise X'

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value)
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
    if (address) {
      if (onSelectAddress) {
        onSelectAddress({
          coordinates: currentCoords,
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

  const handleImageValidation = (imageData) => {
    onSelectImage(imageData)
  }

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

  const handleAddressValidation = () => {
    setIsAddressValidated(true)
  }

  const handleAddressModification = () => {
    setIsAddressValidated(false)
  }

  const handleDateChange = (e) => {
    setDateOfObservation(e.target.value)
  }

  const handleTimeChange = (e) => {
    setTimeOfObservation(e.target.value)
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
      <CompanyNameInput
        companyName={companyName}
        isNameValidated={isNameValidated}
        onNameChange={handleCompanyNameChange}
        onValidation={handleCompanyNameValidation}
        onModification={handleCompanyNameModification}
        onIDontKnowClick={handleIDontKnowClick}
      />
      <AddressInput
        address={address}
        isAddressValidated={isAddressValidated}
        isNameValidated={isNameValidated} // en supposant que isNameValidated est défini
        onAddressChange={handleAddressChange}
        onValidation={handleAddressValidation}
        onModification={handleAddressModification}
        onSuggestionClick={handleSuggestionClick}
        onGeolocationClick={handleGeolocationClick}
        autocompleteResults={autocompleteResults}
      />

      <DateTimeInput
        dateOfObservation={dateOfObservation}
        timeOfObservation={timeOfObservation}
        onDateChange={handleDateChange}
        onTimeChange={handleTimeChange}
      />
      <PhotoCaptureInput onImageValidate={handleImageValidation} />
    </div>
  )
}

export default ObservationEntryForm
