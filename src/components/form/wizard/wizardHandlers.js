import { addStreet } from '../../../services/streetService'
import {
  addEstablishment,
  getEstablishmentRef,
} from '../../../services/establishmentService'
import { addObservation } from '../../../services/observationService'

async function handleStreet(formData) {
  return await addStreet({
    streetName: formData.formattedAddress.streetName,
    city: formData.formattedAddress.city,
    postalCode: formData.formattedAddress.postalCode,
  })
}

async function handleEstablishment(formData, streetRef) {
  let establishmentRef = await getEstablishmentRef(
    formData.normalizedCompanyName,
  )

  if (!establishmentRef) {
    establishmentRef = await addEstablishment({
      establishmentName: formData.companyName,
      normalizedEstablishmentName: formData.normalizedCompanyName,
      streetRef: streetRef,
      coordinates: formData.companyCoordinates,
    })
  }

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
