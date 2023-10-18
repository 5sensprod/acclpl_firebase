import adresseApi from './adresseApi'

export const geocodeAddress = async (address) => {
  try {
    const response = await adresseApi.get(
      `/search/?q=${encodeURIComponent(address)}&limit=5&postcode=51000`,
    )

    if (response.data.features) {
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
