class ObservationModel {
  constructor(data) {
    this.userID = data.userID
    this.date = data.date
    this.time = data.time
    this.photoURLs = data.photoURLs
    this.additionalNotes = data.additionalNotes
  }

  validate() {
    if (!this.userID) throw new Error('User ID is required')
    if (!this.date) throw new Error('Date is required')
    if (!this.time) throw new Error('Time is required')
    if (!this.photoURLs || !Array.isArray(this.photoURLs))
      throw new Error('Photo URLs must be an array')
  }

  toFirebaseObject() {
    return {
      userID: this.userID,
      date: this.date,
      time: this.time,
      photoURLs: this.photoURLs,
      additionalNotes: this.additionalNotes || null,
    }
  }
}

export default ObservationModel
