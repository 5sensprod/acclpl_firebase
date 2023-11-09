class UserModel {
  constructor({
    userID,
    displayName,
    email,
    joinedDate,
    observationRefs = [],
  }) {
    this.userID = userID
    this.displayName = displayName
    this.email = email
    this.joinedDate = joinedDate
    this.observationRefs = observationRefs
  }

  validate() {
    if (!this.userID || this.userID.trim() === '') {
      throw new Error('User ID is required')
    }
    if (!this.displayName || this.displayName.trim() === '') {
      throw new Error('Display Name is required')
    }
    if (!this.email || this.email.trim() === '' || !this.email.includes('@')) {
      throw new Error('Valid email is required')
    }
    if (!this.joinedDate || isNaN(new Date(this.joinedDate).getTime())) {
      throw new Error('Valid joined date is required')
    }
    // Optionally validate the observationRefs array
    if (!Array.isArray(this.observationRefs)) {
      throw new Error('Observation references should be an array')
    }
  }

  toFirebaseObject() {
    return {
      userID: this.userID,
      displayName: this.displayName,
      email: this.email,
      joinedDate: this.joinedDate,
      observationRefs: this.observationRefs,
    }
  }
}

export default UserModel
