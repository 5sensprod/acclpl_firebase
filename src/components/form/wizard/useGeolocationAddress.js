import { useState } from 'react'
import { reverseGeocode, geocodeAddress } from '../../../api/geocode'

function useGeolocationAddress(initialAddress, onSelectAddress) {
  const [address, setAddress] = useState(initialAddress || '')
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

  const handleSuggestionClick = (feature) => {
    setAddress(feature.properties.label)
    if (onSelectAddress && feature.geometry) {
      onSelectAddress(
        [feature.geometry.coordinates[1], feature.geometry.coordinates[0]],
        feature.properties.label,
      )
    }
    setAutocompleteResults([])
  }

  const handleGeolocationClick = () => {
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
          const addressFound = await reverseGeocode(lat, lon)
          if (addressFound) {
            setAddress(addressFound)
            onSelectAddress([lat, lon], addressFound)
          } else {
            console.warn(
              'Géocodage inverse: aucune adresse trouvée pour ces coordonnées.',
            )
          }
        } catch (error) {
          console.error('Erreur lors du géocodage inverse:', error)
        }
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
    address,
    autocompleteResults,
    handleAddressChange,
    handleSuggestionClick,
    handleGeolocationClick,
  }
}

export default useGeolocationAddress
