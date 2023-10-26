// src\services\establishmentCheckerService.js

import { firestore } from '../firebaseConfig'
import { query, where, getDocs, collection } from 'firebase/firestore'

async function checkDuplicateEstablishment(normalizedEstablishmentName) {
  if (!normalizedEstablishmentName) {
    throw new Error('normalizedEstablishmentName is required.')
  }

  const establishmentQuery = query(
    collection(firestore, 'establishments'),
    where('normalizedEstablishmentName', '==', normalizedEstablishmentName),
  )

  const querySnapshot = await getDocs(establishmentQuery)
  return !querySnapshot.empty
}

export { checkDuplicateEstablishment }
