// Importez les modules nécessaires depuis firebaseConfig.js et firebase/firestore
import { firestore } from '../firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import EstablishmentModel from '../models/EstablishmentModel'
import StreetModel from '../models/StreetModel'
import UserModel from '../models/UserModel'
import ObservationModel from '../models/ObservationModel'

// Fonction pour ajouter une nouvelle rue
async function addStreet(streetData) {
  const street = new StreetModel(streetData)
  try {
    const docRef = await addDoc(
      collection(firestore, 'streets'),
      street.toFirebaseObject(),
    )
    console.log('Street document written with ID: ', docRef.id)
    return docRef.id // Retournez l'ID du document pour une utilisation ultérieure
  } catch (e) {
    console.error('Error adding street document: ', e)
    throw e // Propagez l'erreur pour la gérer plus haut dans la pile d'appels
  }
}

// Fonction pour ajouter un nouvel établissement
async function addEstablishment(establishmentData) {
  const establishment = new EstablishmentModel(establishmentData)
  try {
    const docRef = await addDoc(
      collection(firestore, 'establishments'),
      establishment.toFirebaseObject(),
    )
    console.log('Establishment document written with ID: ', docRef.id)
    return docRef.id // Retournez l'ID du document pour une utilisation ultérieure
  } catch (e) {
    console.error('Error adding establishment document: ', e)
    throw e // Propagez l'erreur pour la gérer plus haut dans la pile d'appels
  }
}

// Fonction pour ajouter un nouvel utilisateur
async function addUser(userData) {
  const user = new UserModel(userData)
  try {
    const docRef = await addDoc(
      collection(firestore, 'users'),
      user.toFirebaseObject(),
    )
    console.log('User document written with ID: ', docRef.id)
    return docRef.id // Retournez l'ID du document pour une utilisation ultérieure
  } catch (e) {
    console.error('Error adding user document: ', e)
    throw e // Propagez l'erreur pour la gérer plus haut dans la pile d'appels
  }
}

// Fonction pour ajouter une nouvelle observation
async function addObservation(observationData) {
  const observation = new ObservationModel(observationData)
  try {
    const docRef = await addDoc(
      collection(
        firestore,
        'establishments',
        observationData.establishmentRef,
        'observations',
      ),
      observation.toFirebaseObject(),
    )
    console.log('Observation document written with ID: ', docRef.id)
    return docRef.id // Retournez l'ID du document pour une utilisation ultérieure
  } catch (e) {
    console.error('Error adding observation document: ', e)
    throw e // Propagez l'erreur pour la gérer plus haut dans la pile d'appels
  }
}

// Exportez les fonctions pour pouvoir les importer dans d'autres fichiers
export { addStreet, addEstablishment, addUser, addObservation }
