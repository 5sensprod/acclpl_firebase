import { firestore } from '../firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import EstablishmentModel from '../models/EstablishmentModel'

async function addEstablishment(establishmentData) {
  const establishment = new EstablishmentModel(establishmentData)
  establishment.validate() // Assume you have a validate method to check the data

  try {
    // Check for duplicate establishment
    const establishmentQuery = query(
      collection(firestore, 'establishments'),
      where('establishmentName', '==', establishment.establishmentName),
      where('address', '==', establishment.address),
    )
    const querySnapshot = await getDocs(establishmentQuery)
    if (!querySnapshot.empty) {
      throw new Error('Establishment already exists')
    }

    // If no duplicate is found, add the new establishment
    const docRef = await addDoc(
      collection(firestore, 'establishments'),
      establishment.toFirebaseObject(),
    )
    console.log('Establishment document written with ID: ', docRef.id)
    return docRef.id // Return the document ID for further use
  } catch (e) {
    console.error('Error adding establishment document: ', e)
    throw e // Propagate the error to be handled higher up in the call stack
  }
}

export { addEstablishment }