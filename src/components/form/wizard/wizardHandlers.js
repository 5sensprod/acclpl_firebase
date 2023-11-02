import { addStreet } from '../../../services/streetService'
import { addEstablishment } from '../../../services/establishmentService'
import { addObservation } from '../../../services/observationService'

async function handleStreet(formData) {
  return await addStreet({
    streetName: formData.formattedAddress.streetName,
    city: formData.formattedAddress.city,
    postalCode: formData.formattedAddress.postalCode,
  })
}

async function handleEstablishment(formData, streetRef) {
  // Nous allons directement ajouter un nouvel établissement sans vérifier s'il existe déjà.
  const establishmentRef = await addEstablishment({
    establishmentName: formData.companyName,
    normalizedEstablishmentName: formData.normalizedCompanyName,
    streetRef: streetRef,
    streetNumber: formData.formattedAddress.streetNumber, // Assurez-vous que cette propriété existe dans formData
    coordinates: formData.companyCoordinates,
  })

  return establishmentRef
}

async function handleObservation(formData, establishmentRef) {
  return await addObservation(formData, establishmentRef)
}

export async function submitData(formData, currentUser) {
  // 1. Add or get street reference
  const streetRef = await handleStreet(formData)

  // 2. Add or get establishment reference
  const establishmentRef = await handleEstablishment(formData, streetRef)

  // 3. Add observation
  await handleObservation(formData, establishmentRef)
}
