import { firestore } from '../firebaseConfig'
import {
  query,
  where,
  getDocs,
  collection,
  doc,
  getDoc,
} from 'firebase/firestore'
import { ratio } from 'fuzzball'
import defaultPhoto from '../assets/images/defaultPhoto.jpg'

async function getObservationDetails(establishmentDoc) {
  const observationRefs = establishmentDoc.data().observationRefs
  if (!observationRefs?.length) return null
  const lastObservationDoc = await getDoc(
    doc(firestore, 'observations', observationRefs[observationRefs.length - 1]),
  )
  return lastObservationDoc.exists()
    ? lastObservationDoc.data().photoURLs
    : null
}

async function findClosestEstablishmentMatches(normalizedEstablishmentName) {
  const establishmentsSnapshot = await getDocs(
    collection(firestore, 'establishments'),
  )
  const matches = establishmentsSnapshot.docs
    .map((doc) => ({
      doc,
      similarity: ratio(
        normalizedEstablishmentName,
        doc.data().normalizedEstablishmentName,
      ),
    }))
    .filter((match) => match.similarity > 85)
    .sort((a, b) => b.similarity - a.similarity)
  return matches.length > 0 ? matches : null
}

async function buildEstablishmentDetails(establishmentDoc) {
  const { establishmentName, address, coordinates } = establishmentDoc.data()
  const photoURLs = await getObservationDetails(establishmentDoc)

  return {
    establishmentId: establishmentDoc.id,
    establishmentName,
    address,
    photoURL: photoURLs?.[0] || defaultPhoto,
    coordinates,
  }
}

async function getEstablishmentMatches(normalizedEstablishmentName) {
  const querySnapshot = await getDocs(
    query(
      collection(firestore, 'establishments'),
      where('normalizedEstablishmentName', '==', normalizedEstablishmentName),
    ),
  )

  if (querySnapshot.docs.length) {
    return { docs: querySnapshot.docs, isApproximate: false }
  }

  const approximateMatches = await findClosestEstablishmentMatches(
    normalizedEstablishmentName,
  )

  return approximateMatches
    ? { docs: approximateMatches.map((m) => m.doc), isApproximate: true }
    : null
}

async function checkDuplicateEstablishment(
  normalizedEstablishmentName,
  dispatch,
) {
  if (!normalizedEstablishmentName) {
    throw new Error('normalizedEstablishmentName is required.')
  }
  const matches = await getEstablishmentMatches(normalizedEstablishmentName)
  if (!matches) {
    dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: false })
    dispatch({ type: 'SET_CURRENT_ESTABLISHMENT_ID', payload: null })
    return false
  }
  const { docs, isApproximate } = matches
  const establishmentsDetails = await Promise.all(
    docs.map(buildEstablishmentDetails),
  )
  dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: true })
  dispatch({
    type: 'SET_CURRENT_ESTABLISHMENTS_DATA',
    payload: establishmentsDetails,
  })
  if (establishmentsDetails.length === 1) {
    const singleDetail = establishmentsDetails[0]
    dispatch({
      type: 'SET_CURRENT_ESTABLISHMENT_ID',
      payload: singleDetail.establishmentId,
    })
    return {
      found: true,
      details: singleDetail,
      isApproximateMatch: isApproximate,
    }
  }
  return {
    found: true,
    multiple: true,
    details: establishmentsDetails,
    isApproximateMatch: isApproximate,
  }
}

export { checkDuplicateEstablishment }
