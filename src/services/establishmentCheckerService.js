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
  const establishmentId = establishmentDoc.id
  const establishmentData = establishmentDoc.data()

  // Récupérer la première URL de photo de la liste des références d'observations si disponible
  let photoURL = ''
  if (
    establishmentData.observationRefs &&
    establishmentData.observationRefs.length > 0
  ) {
    const firstObservationRef = establishmentData.observationRefs[0]
    const observationDoc = await getDoc(
      doc(firestore, 'observations', firstObservationRef),
    )
    if (observationDoc.exists() && observationDoc.data().photoURLs) {
      photoURL = observationDoc.data().photoURLs[0] // Prendre la première photo de la liste
    }
  }

  console.log('Détails de l’établissement construits:', {
    establishmentId,
    establishmentName: establishmentData.establishmentName,
    address: establishmentData.address,
    coordinates: establishmentData.coordinates,
    observationCount: establishmentData.observationCount,
    photoURL,
  })

  return {
    establishmentId,
    establishmentName: establishmentData.establishmentName,
    address: establishmentData.address,
    coordinates: establishmentData.coordinates, // Inclure les coordonnées directement
    observationCount: establishmentData.observationCount,
    photoURL, // Inclure l'URL de la photo récupérée
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
