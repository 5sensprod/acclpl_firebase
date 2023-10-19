import adresseApi from './adresseApi'

export const reverseGeocode = async (lat, lon) => {
  try {
    const response = await adresseApi.get(`/reverse/?lat=${lat}&lon=${lon}`)

    if (
      response.data &&
      response.data.features &&
      response.data.features.length > 0
    ) {
      // Prenez le premier résultat comme l'adresse la plus pertinente
      const bestMatch = response.data.features[0]
      return bestMatch.properties.label
    }
    return null
  } catch (error) {
    console.error('Erreur de géocodage inverse:', error)
    return null
  }
}

export const geocodeAddress = async (address) => {
  try {
    const response = await adresseApi.get(
      `/search/?q=${encodeURIComponent(address)}&limit=5&postcode=51000`,
    )

    if (Array.isArray(response.data.features)) {
      const relevantResults = response.data.features.filter(
        (feature) => feature.properties.score > 0.5,
      )
      return relevantResults
    }
    return []
  } catch (error) {
    throw error
  }
}
