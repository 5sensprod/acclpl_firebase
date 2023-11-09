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
  establishment.validate()

  try {
    const establishmentQuery = query(
      collection(firestore, 'establishments'),
      where(
        'normalizedEstablishmentName',
        '==',
        establishment.normalizedEstablishmentName,
      ),
      where('address', '==', establishment.address),
    )

    const querySnapshot = await getDocs(establishmentQuery)
    if (!querySnapshot.empty) {
      // Un établissement avec le même nom normalisé et la même adresse existe déjà.
      throw new Error('Establishment already exists at this address')
    }

    const docRef = await addDoc(
      collection(firestore, 'establishments'),
      establishment.toFirebaseObject(),
    )
    console.log('Establishment document written with ID: ', docRef.id)
    return { id: docRef.id } // Retourne l'objet avec l'ID pour une utilisation ultérieure
  } catch (e) {
    console.error('Error adding establishment document: ', e)
    throw e
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
      const doc = querySnapshot.docs[0]
      return {
        id: doc.id,
        data: doc.data(),
      }
    } else {
      return null
    }
  } catch (error) {
    console.error('Error fetching establishment reference: ', error)
    throw error
  }
}

export { addEstablishment, getEstablishmentRef, getStreetByRef }
