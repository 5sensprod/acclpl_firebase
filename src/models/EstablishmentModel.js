import formatCompanyName from '../utils/formatCompanyName'
import normalizedCompanyName from '../utils/normalizedCompanyName'

class EstablishmentModel {
  constructor({
    establishmentName,
    address, // Ajouté pour stocker l'adresse complète
    coordinates,
    observationCount = 0, // Initialisé à 0 par défaut
    observationRefs = [], // Tableau vide par défaut pour les nouvelles instances
  }) {
    this.establishmentName = formatCompanyName(establishmentName) // Formattez le nom ici
    this.normalizedEstablishmentName = normalizedCompanyName(
      this.establishmentName,
    ) // Utilisez normalizedCompanyName ici
    this.address = address // Stocker l'adresse complète ici
    this.coordinates = coordinates
    this.observationCount = observationCount // Le nombre d'observations liées à cet établissement
    this.observationRefs = observationRefs // Les références aux documents d'observation
  }

  validate() {
    if (!this.establishmentName || this.establishmentName.trim() === '') {
      throw new Error("Le nom de l'établissement est requis")
    }
    if (!this.address || this.address.trim() === '') {
      throw new Error("L'adresse est requise")
    }
    if (!this.coordinates || this.coordinates.length !== 2) {
      throw new Error('Des coordonnées valides sont requises')
    }
  }

  toFirebaseObject() {
    return {
      establishmentName: this.establishmentName,
      normalizedEstablishmentName: this.normalizedEstablishmentName,
      address: this.address, // L'adresse complète de l'établissement
      coordinates: {
        latitude: this.coordinates[0],
        longitude: this.coordinates[1],
      },
      observationCount: this.observationCount, // Nombre d'observations pour l'établissement
      observationRefs: this.observationRefs, // Références aux observations
    }
  }
}

export default EstablishmentModel
