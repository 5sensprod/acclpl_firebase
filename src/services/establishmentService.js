import { firestore } from '../firebaseConfig'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import EstablishmentModel from '../models/EstablishmentModel'

async function addEstablishment(establishmentData) {
  const establishment = new EstablishmentModel(establishmentData)
  establishment.validate() // Assume you have a validate method to check the data

  try {
    // Prepare the query
    const establishmentQueryConditions = [
      where('establishmentName', '==', establishment.establishmentName),
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
    // console.log('Establishment document written with ID: ', docRef.id)
    return docRef.id // Return the document ID for further use
  } catch (e) {
    if (e.message !== 'Establishment already exists') {
      // Seulement loguer l'erreur si ce n'est pas l'erreur "Establishment already exists"
      console.error('Error adding establishment document: ', e)
    }
    throw e // Propagate the error to be handled higher up in the call stack
  }
}

async function getEstablishmentRef(establishmentName, streetRef) {
  try {
    const establishmentQuery = query(
      collection(firestore, 'establishments'),
      where('establishmentName', '==', establishmentName),
      where('streetRef', '==', streetRef),
    )

    const querySnapshot = await getDocs(establishmentQuery)
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].ref // Retourne la référence du premier document trouvé
    } else {
      throw new Error('No matching establishment found')
    }
  } catch (error) {
    console.error('Error fetching establishment reference: ', error)
    throw error
  }
}

export { addEstablishment, getEstablishmentRef }
