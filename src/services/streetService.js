import { firestore } from '../firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import StreetModel from '../models/StreetModel'

async function addStreet(streetData) {
  const street = new StreetModel(streetData)
  street.validate()

  try {
    const streetQuery = query(
      collection(firestore, 'streets'),
      where('streetName', '==', street.streetName),
      where('city', '==', street.city),
      where('postalCode', '==', street.postalCode),
    )
    const querySnapshot = await getDocs(streetQuery)
    if (!querySnapshot.empty) {
      // Street already exists, return the existing street reference
      return querySnapshot.docs[0].id // Assuming the query will return the existing street document
    }

    const docRef = await addDoc(
      collection(firestore, 'streets'),
      street.toFirebaseObject(),
    )
    console.log('Street document written with ID: ', docRef.id)
    return docRef.id // Return the document ID for further use
  } catch (e) {
    console.error('Error adding street document: ', e)
    throw e
  }
}

export { addStreet }
