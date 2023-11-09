import { firestore } from '../firebaseConfig'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  increment,
} from 'firebase/firestore'
import ObservationModel from '../models/ObservationModel'

async function addObservation(observationData) {
  const observation = new ObservationModel(observationData)
  observation.validate()

  try {
    const docRef = await addDoc(
      collection(firestore, 'observations'),
      observation.toFirebaseObject(),
    )

    console.log('Observation ajoutée avec ID:', docRef.id)
    // Après avoir créé l'observation, liez-la à l'établissement
    const establishmentRef = doc(
      firestore,
      'establishments',
      observationData.establishmentRef,
    )
    console.log(
      'Mise à jour de l’établissement avec ID:',
      observationData.establishmentRef,
    )

    await updateDoc(establishmentRef, {
      observationRefs: arrayUnion(docRef.id),
      observationCount: increment(1),
    })
    console.log('Établissement mis à jour avec succès.')

    return docRef.id // Retourne l'ID de l'observation pour une utilisation ultérieure
  } catch (e) {
    console.error("Erreur lors de l'ajout du document d'observation :", e)
    throw e
  }
}

async function getObservationsForUser(userId) {
  try {
    const obsSnapshot = await getDocs(
      query(
        collection(firestore, 'observations'),
        where('userID', '==', userId),
      ),
    )

    let observations = []
    obsSnapshot.forEach((doc) => {
      observations.push({
        id: doc.id,
        ...doc.data(),
      })
    })

    return observations
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des observations pour l'utilisateur :",
      error,
    )
    throw error
  }
}

export { addObservation, getObservationsForUser }
