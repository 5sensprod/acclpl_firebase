// sync.js
import db from './db'
import { getDocs, collection } from 'firebase/firestore'
import { firestore } from '../firebaseConfig'

export const initializeDBFromFirestore = async () => {
  // Vérifier si des établissements sont déjà présents dans IndexedDB.
  const countEstablishments = await db.establishments.count()
  if (countEstablishments === 0) {
    // Établissements
    const establishmentsSnapshot = await getDocs(
      collection(firestore, 'establishments'),
    )
    const establishments = establishmentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    await db.establishments.bulkPut(establishments)
  } else {
    console.log('IndexedDB already initialized for establishments.')
  }

  // Vérifier si des observations sont déjà présentes dans IndexedDB.
  const countObservations = await db.observations.count()
  if (countObservations === 0) {
    // Observations
    const observationsSnapshot = await getDocs(
      collection(firestore, 'observations'),
    )
    const observations = observationsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    await db.observations.bulkPut(observations)
  } else {
    console.log('IndexedDB already initialized for observations.')
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
