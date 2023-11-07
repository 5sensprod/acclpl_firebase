import { firestore } from '../firebaseConfig'
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore'
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
    return docRef.id // Return the document ID for further use
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
    const observationsPromises = establishmentsSnapshot.docs.map(
      (establishmentDoc) =>
        getDocs(
          query(
            collection(
              firestore,
              'establishments',
              establishmentDoc.id,
              'observations',
            ),
            where('userID', '==', userId),
          ),
        ),
    )

    // Attendre que toutes les promesses d'observations soient résolues
    const observationsSnapshots = await Promise.all(observationsPromises)

    // Extraire les données des observations et les aplatir dans un seul tableau
    const observations = observationsSnapshots.flatMap((snapshot) =>
      snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    )

    return observations
  } catch (error) {
    console.error('Error fetching observations for user:', error)
    throw error
  }
}

export { addObservation, getObservationsForUser }
