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
import { addObservationRefToUser } from './userService'

async function addObservation(observationData) {
  const observation = new ObservationModel(observationData)
  observation.validate()

  try {
    const docRef = await addDoc(
      collection(firestore, 'observations'),
      observation.toFirebaseObject(),
    )
    await addObservationRefToUser(observationData.userID, docRef.id)
    console.log('Observation ajoutée avec ID:', docRef.id)
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

    return docRef.id
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
