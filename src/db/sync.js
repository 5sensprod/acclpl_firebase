// sync.js
import db from './db'
import { getDocs, collection } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'

export const initializeDBFromFirestore = async () => {
  try {
    // Établissements
    const countEstablishments = await db.establishments.count()
    if (countEstablishments === 0) {
      const establishmentsSnapshot = await getDocs(
        collection(firestore, 'establishments'),
      )
      const establishments = establishmentsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      await db.establishments.bulkPut(establishments)
      console.log('Establishments synced with IndexedDB')
    } else {
      console.log('IndexedDB already initialized for establishments.')
    }

    // Observations
    const countObservations = await db.observations.count()
    if (countObservations === 0) {
      const observationsSnapshot = await getDocs(
        collection(firestore, 'observations'),
      )
      const observations = observationsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      await db.observations.bulkPut(observations)
      console.log('Observations synced with IndexedDB')
    } else {
      console.log('IndexedDB already initialized for observations.')
    }
  } catch (error) {
    console.error('Error syncing with Firestore:', error)
    throw new Error('Failed to initialize data from Firestore.')
  }
}

export const checkIfDataIsInitialized = async () => {
  const countEstablishments = await db.establishments.count()
  const countObservations = await db.observations.count()
  console.log(`Nombre d'établissements dans IndexedDB: ${countEstablishments}`)
  console.log(`Nombre d'observations dans IndexedDB: ${countObservations}`)
}

export const logCurrentData = async () => {
  try {
    // Récupérer et loguer les données des établissements
    const establishments = await db.establishments.toArray()
    console.log(
      'Données actuelles des établissements dans IndexedDB:',
      establishments,
    )

    // Récupérer et loguer les données des observations
    const observations = await db.observations.toArray()
    console.log(
      'Données actuelles des observations dans IndexedDB:',
      observations,
    )
  } catch (error) {
    console.error(
      'Erreur lors de la récupération des données IndexedDB:',
      error,
    )
  }
}

export const clearData = async () => {
  try {
    // Effacer les données des établissements
    await db.establishments.clear()
    console.log('Les données des établissements ont été effacées.')

    // Effacer les données des observations
    await db.observations.clear()
    console.log('Les données des observations ont été effacées.')
  } catch (error) {
    console.error('Erreur lors de l’effacement des données IndexedDB:', error)
  }
}
