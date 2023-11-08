import { firestore } from '../firebaseConfig'
import {
  collection,
  query,
  addDoc,
  where,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore'
import UserModel from '../models/UserModel'

// Fonction pour ajouter un nouvel utilisateur
async function addUser(userData) {
  const user = new UserModel(userData)
  user.validate()

  try {
    const docRef = await addDoc(
      collection(firestore, 'users'),
      user.toFirebaseObject(),
    )
    return docRef.id
  } catch (e) {
    console.error('Error adding user document: ', e)
    throw e
  }
}

async function getUser(userID) {
  const usersRef = collection(firestore, 'users')
  const q = query(usersRef, where('userID', '==', userID))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0]
    return {
      ...userDoc.data(),
      docId: userDoc.id,
    }
  } else {
    throw new Error('No user found with userID: ' + userID)
  }
}

async function updateUserDisplayName(docId, newDisplayName) {
  const userRef = doc(firestore, 'users', docId)
  try {
    await updateDoc(userRef, {
      displayName: newDisplayName,
    })
  } catch (e) {
    console.error('Error updating user display name: ', e)
    throw e
  }
}

export { addUser, getUser, updateUserDisplayName }
