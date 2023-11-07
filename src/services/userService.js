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
  user.validate() // Valide les données de l'utilisateur en utilisant la méthode validate du modèle

  try {
    const docRef = await addDoc(
      collection(firestore, 'users'),
      user.toFirebaseObject(),
    )
    // console.log('User document written with ID: ', docRef.id)
    return docRef.id // Retourne l'ID du document pour une utilisation ultérieure
  } catch (e) {
    console.error('Error adding user document: ', e)
    throw e // Propage l'erreur pour la gérer plus haut dans la pile d'appels
  }
}

// Fonction pour obtenir les données d'un utilisateur par ID
async function getUser(userID) {
  const usersRef = collection(firestore, 'users')
  const q = query(usersRef, where('userID', '==', userID))
  const querySnapshot = await getDocs(q)

  if (!querySnapshot.empty) {
    const userDoc = querySnapshot.docs[0]
    return {
      ...userDoc.data(),
      docId: userDoc.id, // Ajoutez l'ID du document Firestore au résultat
    }
  } else {
    throw new Error('No user found with userID: ' + userID)
  }
}

async function updateUserDisplayName(docId, newDisplayName) {
  const userRef = doc(firestore, 'users', docId) // Utilisez l'ID du document Firestore ici
  try {
    await updateDoc(userRef, {
      displayName: newDisplayName,
    })
  } catch (e) {
    console.error('Error updating user display name: ', e)
    throw e
  }
}

// Exporte les fonctions pour pouvoir les importer dans d'autres fichiers
export { addUser, getUser, updateUserDisplayName }
