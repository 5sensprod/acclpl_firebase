class StreetModel {
  constructor({ streetName, city, postalCode }) {
    this.streetName = streetName
    this.city = city
    this.postalCode = postalCode
  }

  validate() {
    if (!this.streetName || this.streetName.trim() === '') {
      throw new Error('Street name is required')
    }
    if (!this.city || this.city.trim() === '') {
      throw new Error('City is required')
    }
    if (!this.postalCode || this.postalCode.trim() === '') {
      throw new Error('Postal code is required')
    }
  }

  toFirebaseObject() {
    return {
      streetName: this.streetName,
      city: this.city,
      postalCode: this.postalCode,
    }
  }
}

export default StreetModel
