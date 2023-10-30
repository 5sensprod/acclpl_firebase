// src\components\form\wizard\wizardHandlers.js

// import { uploadImage } from '../../../services/uploadImage'
import { addStreet } from '../../../services/streetService'
import {
  addEstablishment,
  getEstablishmentRef,
} from '../../../services/establishmentService'
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
    let establishmentRef
    try {
      establishmentRef = await getEstablishmentRef(
        formData.normalizedCompanyName,
      )
    } catch (error) {
      // If establishment is not found, add it
      establishmentRef = await addEstablishment({
        establishmentName: formData.companyName,
        normalizedEstablishmentName: formData.normalizedCompanyName,
        streetRef: streetRef,
        coordinates: formData.companyCoordinates,
      })
    }

    console.log('userID:', currentUser.uid)
    console.log('Submitting with image URL:', formData.photoURLs)

    await addObservation(formData, establishmentRef)

    console.log('Data submitted successfully')
  } catch (error) {
    console.error('Error submitting data:', error)
    throw error
  }
}
