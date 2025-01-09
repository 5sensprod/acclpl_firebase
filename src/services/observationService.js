// observationService.js
import { firestore } from '../firebaseConfig'
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
  writeBatch,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore'
import ObservationModel from '../models/ObservationModel'
import db from '../db/db'
import { syncObservation } from './wordpressService'

async function addObservation(observationData) {
  const observation = new ObservationModel(observationData)
  observation.validate()

  try {
    return await runTransaction(firestore, async (transaction) => {
      const obsCollection = collection(firestore, 'observations')
      const obsRef = doc(obsCollection)
      const establishmentRef = doc(
        firestore,
        'establishments',
        observationData.establishmentRef,
      )
      const userRef = doc(firestore, 'users', observationData.userID)

      const establishmentDoc = await transaction.get(establishmentRef)
      if (!establishmentDoc.exists()) throw new Error('Establishment not found')

      const obsToSave = observation.toFirebaseObject()
      transaction.set(obsRef, obsToSave)

      transaction.update(establishmentRef, {
        observationRefs: arrayUnion(obsRef.id),
        observationCount: increment(1),
      })

      transaction.update(userRef, {
        observationRefs: arrayUnion(obsRef.id),
      })

      const observationWithId = {
        id: obsRef.id,
        ...obsToSave,
      }

      await db.observations.put(observationWithId)
      await syncObservation(observationWithId)

      return obsRef.id
    })
  } catch (e) {
    console.error("Erreur lors de l'ajout de l'observation:", e)
    throw e
  }
}
async function getObservationsForUser(userId) {
  try {
    let observations = await db.observations
      .where('userID')
      .equals(userId)
      .toArray()

    if (observations.length > 0) return observations

    const obsSnapshot = await getDocs(
      query(
        collection(firestore, 'observations'),
        where('userID', '==', userId),
      ),
    )

    observations = obsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    console.log('Observations récupérées:', observations)

    await db.observations.bulkPut(observations)
    return observations
  } catch (error) {
    console.error('Error fetching observations:', error)
    throw error
  }
}

async function deleteObservation(observationId) {
  try {
    await runTransaction(firestore, async (transaction) => {
      const obsRef = doc(firestore, 'observations', observationId)
      const obsDoc = await transaction.get(obsRef)

      if (!obsDoc.exists()) {
        throw new Error('Observation not found')
      }

      const data = obsDoc.data()
      const establishmentRef = doc(
        firestore,
        'establishments',
        data.establishmentRef,
      )
      const userRef = doc(firestore, 'users', data.userID)

      transaction.delete(obsRef)
      transaction.update(establishmentRef, {
        observationRefs: arrayRemove(observationId),
        observationCount: increment(-1),
      })
      transaction.update(userRef, {
        observationRefs: arrayRemove(observationId),
      })

      await db.observations.delete(observationId)
    })
  } catch (error) {
    console.error('Error deleting observation:', error)
    throw error
  }
}

async function batchUpdateObservations(updates) {
  const batch = writeBatch(firestore)

  updates.forEach(({ id, data }) => {
    const ref = doc(firestore, 'observations', id)
    batch.update(ref, data)
  })

  await batch.commit()
  await db.observations.bulkPut(updates)
}

export {
  addObservation,
  getObservationsForUser,
  deleteObservation,
  batchUpdateObservations,
}
