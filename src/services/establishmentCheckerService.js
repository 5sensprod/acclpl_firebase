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

async function getObservationDetails(establishmentId) {
  const observationsQuery = query(
    collection(firestore, 'establishments', establishmentId, 'observations'),
    orderBy('date', 'desc'),
    limit(1),
  )
  const observationsSnapshot = await getDocs(observationsQuery)
  return observationsSnapshot.empty ||
    !observationsSnapshot.docs[0].data().photoURLs?.length
    ? null
    : observationsSnapshot.docs[0].data().photoURLs[0]
}

async function getStreetDetails(streetRef) {
  const streetId = typeof streetRef === 'string' ? streetRef : streetRef.id
  const streetDocRef = doc(firestore, 'streets', streetId)
  const streetDoc = await getDoc(streetDocRef)
  return streetDoc.data()
}

async function buildEstablishmentDetails(establishmentDoc) {
  const establishmentId = establishmentDoc.id
  const establishmentData = establishmentDoc.data()
  const photoURL = await getObservationDetails(establishmentId)
  const streetData = await getStreetDetails(establishmentData.streetRef)

  return {
    establishmentId,
    establishmentName: establishmentData.establishmentName,
    streetName: streetData.streetName,
    city: streetData.city,
    postalCode: streetData.postalCode,
    streetNumber: establishmentData.streetNumber,
    photoURL,
    coordinates: [
      establishmentData.coordinates.longitude,
      establishmentData.coordinates.latitude,
    ],
  }
}

async function checkDuplicateEstablishment(
  normalizedEstablishmentName,
  dispatch,
) {
  if (!normalizedEstablishmentName) {
    throw new Error('normalizedEstablishmentName is required.')
  }

  const establishmentQuery = query(
    collection(firestore, 'establishments'),
    where('normalizedEstablishmentName', '==', normalizedEstablishmentName),
  )

  const querySnapshot = await getDocs(establishmentQuery)

  switch (querySnapshot.docs.length) {
    case 0:
      dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: false })
      dispatch({ type: 'SET_CURRENT_ESTABLISHMENT_ID', payload: null })
      return false

    case 1:
      const details = await buildEstablishmentDetails(querySnapshot.docs[0])
      dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: true })
      dispatch({
        type: 'SET_CURRENT_ESTABLISHMENT_ID',
        payload: details.establishmentId,
      })
      return { found: true, details }

    default:
      const establishmentsDetails = await Promise.all(
        querySnapshot.docs.map(buildEstablishmentDetails),
      )
      dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: true })
      dispatch({
        type: 'SET_CURRENT_ESTABLISHMENTS_DATA',
        payload: establishmentsDetails,
      })
      return { found: true, multiple: true, details: establishmentsDetails }
  }
}

export { checkDuplicateEstablishment }
