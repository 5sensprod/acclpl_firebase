class ObservationModel {
  constructor(data) {
    this.userID = data.userID
    this.establishmentRef = data.establishmentRef
    this.date = data.date
    this.time = data.time
    this.photoURLs = data.photoURLs
    this.additionalNotes = data.additionalNotes
    this.observationTypes = data.observationTypes || []
  }

  validate() {
    if (!this.userID) throw new Error("L'ID utilisateur est requis")
    if (!this.establishmentRef)
      throw new Error("La référence de l'établissement est requise")
    if (!this.date) throw new Error('La date est requise')
    if (!this.time) throw new Error("L'heure est requise")
    if (!this.photoURLs || !Array.isArray(this.photoURLs))
      throw new Error('Les URLs des photos doivent être un tableau')
    if (!this.observationTypes || !Array.isArray(this.observationTypes))
      throw new Error("Les types d'observation doivent être un tableau")
    if (this.observationTypes.length === 0)
      throw new Error("Au moins un type d'observation est requis")
  }

  toFirebaseObject() {
    return {
      userID: this.userID,
      establishmentRef: this.establishmentRef,
      date: this.date,
      time: this.time,
      photoURLs: this.photoURLs,
      additionalNotes: this.additionalNotes || null,
      observationTypes: this.observationTypes,
    }
  }
}

export default ObservationModel
