class EstablishmentModel {
  constructor({ establishmentName, streetNumber, streetRef, coordinates }) {
    this.establishmentName = establishmentName
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
    return {
      establishmentName: this.establishmentName,
      streetNumber: this.streetNumber,
      streetRef: this.streetRef,
      coordinates: {
        latitude: this.coordinates[0],
        longitude: this.coordinates[1],
      },
    }
  }
}

export default EstablishmentModel
