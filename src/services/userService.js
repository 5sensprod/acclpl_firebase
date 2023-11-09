import { firestore } from '../firebaseConfig'
import {
  collection,
  query,
  addDoc,
  where,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
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

// Fonction pour ajouter une référence d'observation à un utilisateur
async function addObservationRefToUser(docId, observationRef) {
  const userRef = doc(firestore, 'users', docId)
  try {
    await updateDoc(userRef, {
      // Utilisez arrayUnion pour ajouter la référence sans supprimer les existantes
      observationRefs: arrayUnion(observationRef),
    })
  } catch (e) {
    console.error("Erreur lors de l'ajout de la référence d'observation: ", e)
    throw e
  }
}

export { addUser, getUser, updateUserDisplayName, addObservationRefToUser }
