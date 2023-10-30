import { addStreet } from '../../../services/streetService'
import {
  addEstablishment,
  getEstablishmentRef,
} from '../../../services/establishmentServiceWizard'
import { addObservation } from '../../../services/observationService'

export async function submitData(formData, currentUser) {
  try {
    // 2. Add or get street reference
    const streetRef = await addStreet({
      streetName: formData.formattedAddress.streetName,
      city: formData.formattedAddress.city,
      postalCode: formData.formattedAddress.postalCode,
    })

    // 3. Add or get establishment reference
    let establishmentRef = await getEstablishmentRef(
      formData.normalizedCompanyName,
    )

    if (!establishmentRef) {
      // Si establishmentRef est null, ajoutez un nouvel établissement
      establishmentRef = await addEstablishment({
        establishmentName: formData.companyName,
        normalizedEstablishmentName: formData.normalizedCompanyName,
        streetRef: streetRef,
        coordinates: formData.companyCoordinates,
      })
    }

    await addObservation(formData, establishmentRef)
  } catch (error) {
    throw error
  }
}
