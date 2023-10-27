import { useReducer } from 'react'
import { reverseGeocode, geocodeAddress } from '../../../api/geocode'

const initialState = {
  address: '',
  autocompleteResults: [],
}

const ACTIONS = {
  SET_ADDRESS: 'SET_ADDRESS',
  SET_AUTOCOMPLETE_RESULTS: 'SET_AUTOCOMPLETE_RESULTS',
}

function addressReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_ADDRESS:
      return { ...state, address: action.payload }
    case ACTIONS.SET_AUTOCOMPLETE_RESULTS:
      return { ...state, autocompleteResults: action.payload }
    default:
      return state
  }
}

function useGeolocationAddress(initialAddress, onSelectAddress) {
  const [state, dispatch] = useReducer(addressReducer, {
    ...initialState,
    address: initialAddress,
  })

  const handleAddressChange = async (e) => {
    const query = e.target.value
    dispatch({ type: ACTIONS.SET_ADDRESS, payload: query })

    if (query.length < 3) {
      dispatch({ type: ACTIONS.SET_AUTOCOMPLETE_RESULTS, payload: [] })
      return
    }

    try {
      const features = await geocodeAddress(query)
      dispatch({
        type: ACTIONS.SET_AUTOCOMPLETE_RESULTS,
        payload: features || [],
      })
    } catch (err) {
      console.error("Erreur lors de l'autocomplétion:", err)
    }
  }

  const handleSuggestionClick = (feature) => {
    dispatch({ type: ACTIONS.SET_ADDRESS, payload: feature.properties.label })
    if (onSelectAddress && feature.geometry) {
      onSelectAddress(feature.geometry.coordinates, feature.properties.label)
    }
    dispatch({ type: ACTIONS.SET_AUTOCOMPLETE_RESULTS, payload: [] })
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
          const address = await reverseGeocode(lat, lon)
          if (address) {
            dispatch({ type: ACTIONS.SET_ADDRESS, payload: address })
            onSelectAddress([lon, lat], address)
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
    address: state.address,
    autocompleteResults: state.autocompleteResults,
    handleAddressChange,
    handleSuggestionClick,
    handleGeolocationClick,
  }
}

export default useGeolocationAddress
