import { firestore } from '../firebaseConfig'
import {
  setDoc,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  writeBatch,
} from 'firebase/firestore'
import UserModel from '../models/UserModel'
import db from '../db/db'

async function addUser(userData) {
  const user = new UserModel(userData)
  user.validate()

  try {
    // Mise à jour locale et Firestore
    await Promise.all([
      db.users.put({
        id: user.userID,
        ...user.toFirebaseObject(),
      }),
      setDoc(doc(firestore, 'users', user.userID), user.toFirebaseObject()),
    ])

    return user.userID
  } catch (e) {
    console.error('Error adding user:', e)
    throw e
  }
}

async function getUser(userID) {
  try {
    // Vérifier d'abord le cache local
    const cachedUser = await db.users.get(userID)
    if (cachedUser) {
      return { ...cachedUser, docId: userID }
    }

    // Si pas en cache, récupérer de Firestore
    const userSnap = await getDoc(doc(firestore, 'users', userID))
    if (!userSnap.exists()) {
      throw new Error('No user found with userID: ' + userID)
    }

    const userData = userSnap.data()
    // Mettre en cache
    await db.users.put({ id: userID, ...userData })

    return {
      ...userData,
      docId: userID,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    throw error
  }
}

async function updateUserDisplayName(userID, newDisplayName) {
  try {
    await Promise.all([
      // Mise à jour locale
      db.users.update(userID, { displayName: newDisplayName }),
      // Mise à jour Firestore
      updateDoc(doc(firestore, 'users', userID), {
        displayName: newDisplayName,
      }),
    ])
  } catch (e) {
    console.error('Error updating user display name:', e)
    throw e
  }
}

async function addObservationRefToUser(userID, observationRef) {
  try {
    const user = await db.users.get(userID)
    const updatedRefs = [...(user?.observationRefs || []), observationRef]

    await Promise.all([
      // Mise à jour locale
      db.users.update(userID, { observationRefs: updatedRefs }),
      // Mise à jour Firestore
      updateDoc(doc(firestore, 'users', userID), {
        observationRefs: arrayUnion(observationRef),
      }),
    ])
  } catch (e) {
    console.error('Error adding observation reference:', e)
    throw e
  }
}

async function batchUpdateUsers(updates) {
  const batch = writeBatch(firestore)

  updates.forEach(({ id, data }) => {
    const ref = doc(firestore, 'users', id)
    batch.update(ref, data)
  })

  try {
    await Promise.all([
      batch.commit(),
      db.users.bulkPut(updates.map((u) => ({ id: u.id, ...u.data }))),
    ])
  } catch (error) {
    console.error('Error in batch update:', error)
    throw error
  }
}

export {
  addUser,
  getUser,
  updateUserDisplayName,
  addObservationRefToUser,
  batchUpdateUsers,
}
