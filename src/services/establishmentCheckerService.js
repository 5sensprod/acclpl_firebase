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

async function getObservationDetails(establishmentDoc) {
  const observationRefs = establishmentDoc.data().observationRefs
  if (observationRefs.length === 0) {
    return null // Si aucune observation n'est associée
  }

  // Récupérer le dernier ID d'observation dans le tableau
  const lastObservationRef = observationRefs[observationRefs.length - 1]

  // Récupérer le document d'observation
  const observationDocRef = doc(firestore, 'observations', lastObservationRef)
  const observationDoc = await getDoc(observationDocRef)

  // Retourner les URLs des photos si disponibles
  return observationDoc.exists() ? observationDoc.data().photoURLs : null
}

async function findClosestEstablishmentMatches(normalizedEstablishmentName) {
  const establishmentsSnapshot = await getDocs(
    collection(firestore, 'establishments'),
  )
  let matches = []

  establishmentsSnapshot.docs.forEach((doc) => {
    const nameInDb = doc.data().normalizedEstablishmentName
    const similarity = ratio(normalizedEstablishmentName, nameInDb)

    if (similarity > 85) {
      matches.push({ doc, similarity })
    }
  })

  // Triez les correspondances par similitude décroissante pour obtenir le meilleur match en premier.
  matches.sort((a, b) => b.similarity - a.similarity)

  return matches.length ? matches : null
}

async function buildEstablishmentDetails(establishmentDoc) {
  const establishmentData = establishmentDoc.data()
  const photoURLs = await getObservationDetails(establishmentDoc)

  return {
    establishmentId: establishmentDoc.id,
    establishmentName: establishmentData.establishmentName,
    address: establishmentData.address, // adresse complète
    photoURL: photoURLs ? photoURLs[0] : null, // première URL de photo si disponible
    coordinates: establishmentData.coordinates, // déjà un objet {latitude, longitude}
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

      establishmentsDetails.forEach((detail) => {
        console.log(
          'Approximate match for establishment:',
          detail.establishmentName,
        )
      })
      break
    }
    default: {
      establishmentsDetails = await Promise.all(
        querySnapshot.docs.map(buildEstablishmentDetails),
      )
      console.log(
        'Establishments Details for Direct Matches:',
        establishmentsDetails,
      )
      establishmentsDetails.forEach((detail) => {
        console.log(
          'Direct DB match for establishment:',
          detail.establishmentName,
        )
      })
      dispatch({
        type: 'SET_CURRENT_ESTABLISHMENTS_DATA',
        payload: establishmentsDetails,
      })
    }
  }

  const singleDetail =
    establishmentsDetails.length === 1 ? establishmentsDetails[0] : null

  dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: true })

  if (singleDetail) {
    console.log('Détail unique d’établissement trouvé:', singleDetail)
    dispatch({
      type: 'SET_CURRENT_ESTABLISHMENT_ID',
      payload: singleDetail.establishmentId,
    })
    return { found: true, details: singleDetail, isApproximateMatch }
  } else {
    console.log(
      'Détails multiples d’établissements trouvés:',
      establishmentsDetails,
    )
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
