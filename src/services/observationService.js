import { firestore } from '../firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
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

export { addObservation }
