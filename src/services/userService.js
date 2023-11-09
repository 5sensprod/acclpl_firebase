import { firestore } from '../firebaseConfig'
import { setDoc, getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import UserModel from '../models/UserModel'

// Fonction pour ajouter un nouvel utilisateur
async function addUser(userData) {
  const user = new UserModel(userData)
  user.validate()

  try {
    const userRef = doc(firestore, 'users', user.userID)
    await setDoc(userRef, user.toFirebaseObject())
    return user.userID
  } catch (e) {
    console.error('Error adding user document: ', e)
    throw e
  }
}

// Fonction pour récupérer les données d'un utilisateur par userID
async function getUser(userID) {
  const userRef = doc(firestore, 'users', userID)
  const userSnap = await getDoc(userRef)

  if (userSnap.exists()) {
    return {
      ...userSnap.data(),
      docId: userSnap.id,
    }
  } else {
    throw new Error('No user found with userID: ' + userID)
  }
}

// Fonction pour mettre à jour le displayName d'un utilisateur
async function updateUserDisplayName(userID, newDisplayName) {
  const userRef = doc(firestore, 'users', userID)
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
async function addObservationRefToUser(userID, observationRef) {
  const userRef = doc(firestore, 'users', userID)
  try {
    await updateDoc(userRef, {
      observationRefs: arrayUnion(observationRef),
    })
  } catch (e) {
    console.error("Erreur lors de l'ajout de la référence d'observation: ", e)
    throw e
  }
}
export { addUser, getUser, updateUserDisplayName, addObservationRefToUser }
