import { firestore } from '../firebaseConfig'
import { collection, addDoc, doc, getDoc } from 'firebase/firestore'
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
    console.log('User document written with ID: ', docRef.id)
    return docRef.id // Retourne l'ID du document pour une utilisation ultérieure
  } catch (e) {
    console.error('Error adding user document: ', e)
    throw e // Propage l'erreur pour la gérer plus haut dans la pile d'appels
  }
}

// Fonction pour obtenir les données d'un utilisateur par ID
async function getUser(userID) {
  try {
    const userDoc = await getDoc(doc(firestore, 'users', userID))
    if (userDoc.exists()) {
      return userDoc.data()
    } else {
      throw new Error('No user found with ID: ' + userID)
    }
  } catch (e) {
    console.error('Error getting user document: ', e)
    throw e // Propage l'erreur pour la gérer plus haut dans la pile d'appels
  }
}

// Exporte les fonctions pour pouvoir les importer dans d'autres fichiers
export { addUser, getUser }
