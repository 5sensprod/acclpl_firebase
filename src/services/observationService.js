import { firestore } from '../firebaseConfig'
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  getDoc,
  doc,
} from 'firebase/firestore'
import ObservationModel from '../models/ObservationModel'

async function addObservation(observationData, establishmentRef) {
  const observation = new ObservationModel(observationData)
  observation.validate()

  // Vérifiez si establishmentRef et establishmentRef.id sont bien définis
  if (!establishmentRef || !establishmentRef.id) {
    console.log('Invalid establishmentRef:', establishmentRef)
    throw new Error('Invalid establishment reference')
  }

  try {
    const docRef = await addDoc(
      collection(
        firestore,
        'establishments',
        establishmentRef.id,
        'observations',
      ),
      observation.toFirebaseObject(),
    )
    return docRef.id
  } catch (e) {
    console.error('Error adding observation document: ', e)
    throw e
  }
}

async function getObservationsForUser(userId) {
  try {
    // Récupérer tous les établissements
    const establishmentsRef = collection(firestore, 'establishments')
    const establishmentsSnapshot = await getDocs(establishmentsRef)

    // Pour chaque établissement, récupérer les observations pour l'utilisateur
    let observations = []
    for (const establishmentDoc of establishmentsSnapshot.docs) {
      const obsSnapshot = await getDocs(
        query(
          collection(
            firestore,
            'establishments',
            establishmentDoc.id,
            'observations',
          ),
          where('userID', '==', userId),
        ),
      )

      // Pour chaque observation, ajouter les détails de l'établissement et de la rue
      for (const obsDoc of obsSnapshot.docs) {
        const establishmentData = establishmentDoc.data()
        const streetRef = establishmentData.streetRef
        const streetSnapshot = await getDoc(
          doc(firestore, 'streets', streetRef),
        )
        const streetData = streetSnapshot.exists()
          ? streetSnapshot.data()
          : null

        observations.push({
          id: obsDoc.id,
          ...obsDoc.data(),
          establishment: {
            id: establishmentDoc.id,
            ...establishmentData,
          },
          street: streetData,
        })
      }
    }

    return observations
  } catch (error) {
    console.error('Error fetching observations for user:', error)
    throw error
  }
}

export { addObservation, getObservationsForUser }
