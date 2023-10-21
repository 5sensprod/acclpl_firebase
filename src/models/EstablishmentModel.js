class EstablishmentModel {
  constructor({ establishmentName, address, streetRef, coordinates }) {
    this.establishmentName = establishmentName
    this.address = address
    this.streetRef = streetRef
    this.coordinates = coordinates
  }

  validate() {
    if (!this.establishmentName || this.establishmentName.trim() === '') {
      throw new Error('Establishment name is required')
    }
    if (!this.address || this.address.trim() === '') {
      throw new Error('Address is required')
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
      address: this.address,
      streetRef: this.streetRef,
      coordinates: {
        latitude: this.coordinates[0],
        longitude: this.coordinates[1],
      },
    }
  }
}

export default EstablishmentModel
