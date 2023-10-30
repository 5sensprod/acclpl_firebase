import formatCompanyName from '../utils/formatCompanyName'
import normalizedCompanyName from '../utils/normalizedCompanyName'

class EstablishmentModel {
  constructor({ establishmentName, streetNumber, streetRef, coordinates }) {
    this.establishmentName = formatCompanyName(establishmentName) // Formattez le nom ici
    this.normalizedEstablishmentName = normalizedCompanyName(
      this.establishmentName,
    ) // Utilisez normalizedCompanyName ici
    this.streetNumber = streetNumber
    this.streetRef = streetRef
    this.coordinates = coordinates
  }
  validate() {
    if (!this.establishmentName || this.establishmentName.trim() === '') {
      throw new Error('Establishment name is required')
    }
    if (!this.streetRef) {
      throw new Error('Street reference is required')
    }
    if (!this.coordinates || this.coordinates.length !== 2) {
      throw new Error('Valid coordinates are required')
    }
  }

  toFirebaseObject() {
    const firebaseObject = {
      establishmentName: this.establishmentName,
      normalizedEstablishmentName: this.normalizedEstablishmentName,
      streetRef: this.streetRef,
      coordinates: {
        latitude: this.coordinates[0],
        longitude: this.coordinates[1],
      },
    }

    if (this.streetNumber) {
      firebaseObject.streetNumber = this.streetNumber
    }

    return firebaseObject
  }
}

export default EstablishmentModel
