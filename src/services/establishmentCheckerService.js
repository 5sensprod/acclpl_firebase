import { firestore } from '../firebaseConfig'
import {
  query,
  where,
  getDocs,
  collection,
  doc,
  getDoc,
  limit,
  orderBy,
} from 'firebase/firestore'

async function checkDuplicateEstablishment(normalizedEstablishmentName) {
  if (!normalizedEstablishmentName) {
    throw new Error('normalizedEstablishmentName is required.')
  }

  const establishmentQuery = query(
    collection(firestore, 'establishments'),
    where('normalizedEstablishmentName', '==', normalizedEstablishmentName),
  )

  const querySnapshot = await getDocs(establishmentQuery)

  if (querySnapshot.empty) {
    return false
  }

  const establishmentDoc = querySnapshot.docs[0]
  const establishmentId = establishmentDoc.id
  const establishmentData = establishmentDoc.data()

  if (!establishmentData.streetRef) {
    throw new Error('Street reference in establishment is missing or invalid.')
  }

  const observationsQuery = query(
    collection(firestore, 'establishments', establishmentId, 'observations'),
    orderBy('date', 'desc'),
    limit(1),
  )

  const observationsSnapshot = await getDocs(observationsQuery)

  let photoURL = null
  if (!observationsSnapshot.empty) {
    const observationData = observationsSnapshot.docs[0].data()
    if (observationData.photoURLs && observationData.photoURLs.length > 0) {
      photoURL = observationData.photoURLs[0]
    }
  }

  const streetId =
    typeof establishmentData.streetRef === 'string'
      ? establishmentData.streetRef
      : establishmentData.streetRef.id

  if (!streetId) {
    throw new Error('Unable to extract street ID from the reference.')
  }

  const streetDocRef = doc(firestore, 'streets', streetId)
  const streetDoc = await getDoc(streetDocRef)

  if (!streetDoc.exists) {
    throw new Error('Associated street document not found.')
  }

  const streetData = streetDoc.data()

  return {
    found: true,
    details: {
      establishmentName: establishmentData.establishmentName,
      streetName: streetData.streetName,
      city: streetData.city,
      postalCode: streetData.postalCode,
      streetNumber: establishmentData.streetNumber,
      photoURL: photoURL,
    },
  }
}

export { checkDuplicateEstablishment }
