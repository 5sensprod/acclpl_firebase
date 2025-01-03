// establishmentService.js
import { firestore } from '../firebaseConfig'
import { addDoc, doc, getDoc, writeBatch, collection } from 'firebase/firestore'
import EstablishmentModel from '../models/EstablishmentModel'
import db from '../db/db'

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

    await db.establishments.put({
      id: docRef.id,
      ...establishment.toFirebaseObject(),
    })

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

  updates.forEach(({ id, data }) => {
    const ref = doc(firestore, 'establishments', id)
    batch.update(ref, data)
  })

  await batch.commit()
  await db.establishments.bulkPut(updates)
}

export {
  addEstablishment,
  getEstablishmentByRef,
  getStreetByRef,
  batchUpdateEstablishments,
}
