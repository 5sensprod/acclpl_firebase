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
    case 0: // Aucun établissement trouvé
      dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: false })
      dispatch({ type: 'SET_CURRENT_ESTABLISHMENT_ID', payload: null })
      return false

    case 1: // Un seul établissement trouvé
      const establishmentDoc = querySnapshot.docs[0]
      const establishmentId = establishmentDoc.id
      console.log('Establishment ID:', establishmentId)
      const establishmentData = establishmentDoc.data()
      dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: true })
      dispatch({
        type: 'SET_CURRENT_ESTABLISHMENT_ID',
        payload: establishmentId,
      })

      const observationsQuery = query(
        collection(
          firestore,
          'establishments',
          establishmentId,
          'observations',
        ),
        orderBy('date', 'desc'),
        limit(1),
      )
      const observationsSnapshot = await getDocs(observationsQuery)
      const photoURL =
        observationsSnapshot.empty ||
        !observationsSnapshot.docs[0].data().photoURLs?.length
          ? null
          : observationsSnapshot.docs[0].data().photoURLs[0]

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
        },
      }

    default: // Plusieurs établissements trouvés
      const establishmentIds = querySnapshot.docs.map((doc) => doc.id)
      console.log('Establishment IDs:', establishmentIds)
      dispatch({ type: 'SET_ESTABLISHMENT_EXISTS', payload: true })
      dispatch({
        type: 'SET_CURRENT_ESTABLISHMENT_IDS',
        payload: establishmentIds,
      })
      return { found: true, multiple: true, establishmentIds }
  }
}

export { checkDuplicateEstablishment }
