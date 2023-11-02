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
import { ratio } from 'fuzzball'

async function findClosestEstablishmentMatches(normalizedEstablishmentName) {
  const establishmentsSnapshot = await getDocs(
    collection(firestore, 'establishments'),
  )
  let matches = []

  establishmentsSnapshot.docs.forEach((doc) => {
    const nameInDb = doc.data().normalizedEstablishmentName
    const similarity = ratio(normalizedEstablishmentName, nameInDb)

    // console.log(
    //   `Matching ${normalizedEstablishmentName} with ${nameInDb} got score: ${similarity}`,
    // )

    if (similarity > 85) {
      // utilisez le seuil de votre choix
      matches.push({ doc, similarity })
    }
  })

  // Triez les correspondances par similitude décroissante pour obtenir le meilleur match en premier.
  matches.sort((a, b) => b.similarity - a.similarity)

  return matches.length ? matches : null
}

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

  let establishmentsDetails
  let isApproximateMatch = false

  switch (querySnapshot.docs.length) {
    case 0: {
      const matches = await findClosestEstablishmentMatches(
        normalizedEstablishmentName,
      )
      if (!matches || !matches.length) {
        dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: false })
        dispatch({ type: 'SET_CURRENT_ESTABLISHMENT_ID', payload: null })
        return false
      }

      establishmentsDetails = await Promise.all(
        matches.map((match) => buildEstablishmentDetails(match.doc)),
      )
      isApproximateMatch = true
      break
    }
    default: {
      establishmentsDetails = await Promise.all(
        querySnapshot.docs.map(buildEstablishmentDetails),
      )
    }
  }

  const singleDetail =
    establishmentsDetails.length === 1 ? establishmentsDetails[0] : null

  dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: true })

  if (singleDetail) {
    dispatch({
      type: 'SET_CURRENT_ESTABLISHMENT_ID',
      payload: singleDetail.establishmentId,
    })
    return { found: true, details: singleDetail, isApproximateMatch }
  } else {
    dispatch({
      type: 'SET_CURRENT_ESTABLISHMENTS_DATA',
      payload: establishmentsDetails,
    })
    return {
      found: true,
      multiple: true,
      details: establishmentsDetails,
      isApproximateMatch,
    }
  }
}

export { checkDuplicateEstablishment }
