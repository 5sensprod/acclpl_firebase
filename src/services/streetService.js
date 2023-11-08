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
      return querySnapshot.docs[0].id
    }

    const docRef = await addDoc(
      collection(firestore, 'streets'),
      street.toFirebaseObject(),
    )
    console.log('Street document written with ID: ', docRef.id)
    return docRef.id
  } catch (e) {
    console.error('Error adding street document: ', e)
    throw e
  }
}

export { addStreet }
