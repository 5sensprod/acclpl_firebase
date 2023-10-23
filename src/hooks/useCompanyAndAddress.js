import { useState } from 'react'
import { reverseGeocode, geocodeAddress } from '../api/geocode'

function useCompanyAndAddress(onSelectAddress, currentCoords, moveToNextStep) {
  const [companyName, setCompanyName] = useState('')
  const [isNameValidated, setIsNameValidated] = useState(false)
  const [address, setAddress] = useState('')
  const [isAddressValidated, setIsAddressValidated] = useState(false)
  const [autocompleteResults, setAutocompleteResults] = useState([])
  const defaultName = 'Entreprise X'

  if (!onSelectAddress) return null // Si onSelectAddress n'est pas fourni, retournez null

  // Fonctions pour gérer le nom de l'entreprise
  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value)
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
    if (moveToNextStep) moveToNextStep()
  }
  const handleCompanyNameModification = () => {
    setIsNameValidated(false)
  }

  const handleIDontKnowClick = () => {
    setCompanyName(defaultName)
    setIsNameValidated(true)
  }

  // Fonctions pour gérer l'adresse
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
          coordinates: currentCoords || [lon, lat],
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

  return {
    companyName,
    isNameValidated,
    handleCompanyNameChange,
    handleCompanyNameValidation,
    handleCompanyNameModification,
    handleIDontKnowClick,
    address,
    isAddressValidated,
    autocompleteResults,
    handleAddressChange,
    handleSuggestionClick,
    handleAddressValidation,
    handleAddressModification,
    handleGeolocationClick,
  }
}

export default useCompanyAndAddress
