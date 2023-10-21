import { firestore } from '../firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import StreetModel from '../models/StreetModel'

async function addStreet(streetData) {
  const street = new StreetModel(streetData)
  street.validate() // Assume you have a validate method to check the data

  try {
    // Check for duplicate street
    const streetQuery = query(
      collection(firestore, 'streets'),
      where('streetName', '==', street.streetName),
      where('city', '==', street.city),
      where('postalCode', '==', street.postalCode),
    )
    const querySnapshot = await getDocs(streetQuery)
    if (!querySnapshot.empty) {
      throw new Error('Street already exists')
    }

    // If no duplicate is found, add the new street
    const docRef = await addDoc(
      collection(firestore, 'streets'),
      street.toFirebaseObject(),
    )
    console.log('Street document written with ID: ', docRef.id)
    return docRef.id // Return the document ID for further use
  } catch (e) {
    console.error('Error adding street document: ', e)
    throw e // Propagate the error to be handled higher up in the call stack
  }
}

export { addStreet }
