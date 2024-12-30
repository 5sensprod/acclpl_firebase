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
  deleteDoc,
  arrayRemove,
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

async function deleteObservationFromFirestore(observationId) {
  try {
    // D'abord, récupérer l'observation pour avoir l'ID de l'établissement
    const obsRef = doc(firestore, 'observations', observationId)
    const obsSnapshot = await getDocs(
      query(
        collection(firestore, 'observations'),
        where('__name__', '==', observationId),
      ),
    )
    const observationData = obsSnapshot.docs[0]?.data()

    if (observationData) {
      // Mettre à jour l'établissement
      const establishmentRef = doc(
        firestore,
        'establishments',
        observationData.establishmentRef,
      )
      await updateDoc(establishmentRef, {
        observationRefs: arrayRemove(observationId),
        observationCount: increment(-1),
      })

      // Supprimer l'observation
      await deleteDoc(obsRef)
      console.log('Observation supprimée avec succès:', observationId)
    }
  } catch (error) {
    console.error("Erreur lors de la suppression de l'observation:", error)
    throw error
  }
}

export {
  addObservation,
  getObservationsForUser,
  deleteObservationFromFirestore,
}
