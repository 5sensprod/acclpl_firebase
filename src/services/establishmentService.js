// establishmentService.js
import { firestore } from '../firebaseConfig'
import { addDoc, doc, getDoc, writeBatch, collection } from 'firebase/firestore'
import EstablishmentModel from '../models/EstablishmentModel'
import db from '../db/db'
import { syncEstablishment } from './wordpressService'

async function addEstablishment(establishmentData) {
  const establishment = new EstablishmentModel(establishmentData)
  establishment.validate()

  try {
    const existingEstablishment = await db.establishments
      .where('normalizedEstablishmentName')
      .equals(establishment.normalizedEstablishmentName)
      .and((item) => item.address === establishment.address)
      .first()

    if (existingEstablishment) {
      throw new Error('Establishment already exists at this address')
    }

    const docRef = await addDoc(
      collection(firestore, 'establishments'),
      establishment.toFirebaseObject(),
    )

    const establishmentWithId = {
      id: docRef.id,
      ...establishment.toFirebaseObject(),
    }

    // Sync avec WordPress
    try {
      await syncEstablishment(establishmentWithId)
    } catch (wpError) {
      console.error('WordPress sync failed:', wpError)
    }

    await db.establishments.put(establishmentWithId)

    return { id: docRef.id }
  } catch (e) {
    console.error('Error adding establishment:', e)
    throw e
  }
}

async function getEstablishmentByRef(establishmentRef) {
  try {
    const cachedData = await db.establishments
      .where('id')
      .equals(establishmentRef)
      .first()

    if (cachedData) return cachedData

    const establishmentDoc = await getDoc(
      doc(firestore, 'establishments', establishmentRef),
    )

    if (!establishmentDoc.exists()) {
      throw new Error('Establishment not found')
    }

    const data = establishmentDoc.data()
    await db.establishments.put({
      id: establishmentRef,
      ...data,
    })

    return data
  } catch (error) {
    console.error('Error fetching establishment:', error)
    throw error
  }
}

async function getStreetByRef(streetRef) {
  try {
    const cachedStreet = await db.streets.get(streetRef)
    if (cachedStreet) return cachedStreet

    const streetDoc = await getDoc(doc(firestore, 'streets', streetRef))
    if (!streetDoc.exists()) throw new Error('Street not found')

    const data = streetDoc.data()
    await db.streets.put({ id: streetRef, ...data })
    return data
  } catch (error) {
    console.error('Error fetching street:', error)
    throw error
  }
}

async function batchUpdateEstablishments(updates) {
  const batch = writeBatch(firestore)

  try {
    for (const update of updates) {
      const ref = doc(firestore, 'establishments', update.id)
      batch.update(ref, update.data)

      try {
        await syncEstablishment({ id: update.id, ...update.data })
      } catch (wpError) {
        console.error(`WordPress sync failed for ${update.id}:`, wpError)
        // Continue avec les autres mises à jour
      }
    }

    await batch.commit()
    await db.establishments.bulkPut(updates)
  } catch (error) {
    console.error('Error in batch update:', error)
    throw error
  }
}

export {
  addEstablishment,
  getEstablishmentByRef,
  getStreetByRef,
  batchUpdateEstablishments,
}
