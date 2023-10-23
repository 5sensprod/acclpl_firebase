import { firestore } from '../firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import ObservationModel from '../models/ObservationModel'

async function addObservation(observationData, establishmentRef) {
  const observation = new ObservationModel(observationData)
  observation.validate() // Assume you have a validate method to check the data

  // Vérifiez si establishmentRef et establishmentRef.id sont bien définis
  if (!establishmentRef || !establishmentRef.id) {
    throw new Error('Invalid establishment reference')
  }

  try {
    // console.log(establishmentRef) // Log the entire object
    // console.log(establishmentRef.id) // Log just the id property

    const docRef = await addDoc(
      collection(
        firestore,
        'establishments',
        establishmentRef.id,
        'observations',
      ),
      observation.toFirebaseObject(),
    )
    // console.log('Observation document written with ID: ', docRef.id);
    return docRef.id // Return the document ID for further use
  } catch (e) {
    console.error('Error adding observation document: ', e)
    throw e // Propagate the error to be handled higher up in the call stack
  }
}

export { addObservation }
