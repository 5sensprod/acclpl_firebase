import { firestore } from '../firebaseConfig'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore'
import EstablishmentModel from '../models/EstablishmentModel'
// import normalizedCompanyName from '../utils/normalizedCompanyName'

async function getStreetByRef(streetRef) {
  try {
    const streetDoc = await getDoc(doc(firestore, 'streets', streetRef))
    if (streetDoc.exists()) {
      return streetDoc.data()
    } else {
      throw new Error('Street not found')
    }
  } catch (error) {
    console.error('Error fetching street: ', error)
    throw error
  }
}

async function addEstablishment(establishmentData) {
  const establishment = new EstablishmentModel(establishmentData)
  establishment.validate() // Assume you have a validate method to check the data

  try {
    // Prepare the query
    const establishmentQueryConditions = [
      where(
        'normalizedEstablishmentName',
        '==',
        establishment.normalizedEstablishmentName,
      ), // Updated line
      where('streetRef', '==', establishment.streetRef),
    ]

    if (establishment.streetNumber) {
      establishmentQueryConditions.push(
        where('streetNumber', '==', establishment.streetNumber),
      )
    }

    const establishmentQuery = query(
      collection(firestore, 'establishments'),
      ...establishmentQueryConditions,
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
    console.log('Establishment document written with ID: ', docRef.id) // Log the ID
    return { id: docRef.id } // Retournez un objet avec une propriété id
  } catch (e) {
    if (e.message !== 'Establishment already exists') {
      // Seulement loguer l'erreur si ce n'est pas l'erreur "Establishment already exists"
      console.error('Error adding establishment document: ', e)
    }
    throw e // Propagate the error to be handled higher up in the call stack
  }
}

async function getEstablishmentRef(normalizedEstablishmentName) {
  if (!normalizedEstablishmentName) {
    throw new Error('normalizedEstablishmentName is required.')
  }

  try {
    const establishmentQuery = query(
      collection(firestore, 'establishments'),
      where('normalizedEstablishmentName', '==', normalizedEstablishmentName),
    )

    const querySnapshot = await getDocs(establishmentQuery)
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data()
    } else {
      return null // Retournez null si aucun établissement correspondant n'est trouvé
    }
  } catch (error) {
    console.error('Error fetching establishment reference: ', error)
    throw error
  }
}

export { addEstablishment, getEstablishmentRef, getStreetByRef }
