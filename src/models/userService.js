import { firestore } from '../firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'
import UserModel from './UserModel'

// Fonction pour ajouter un nouvel utilisateur
async function addUser(userData) {
  const user = new UserModel(userData)
  try {
    // Valider les données de l'utilisateur
    user.validate()
    const docRef = await addDoc(
      collection(firestore, 'users'),
      user.toFirebaseObject(),
    )
    console.log('User document written with ID: ', docRef.id)
    return docRef.id // Retournez l'ID du document pour une utilisation ultérieure
  } catch (e) {
    console.error('Error adding user document: ', e)
    throw e // Propagez l'erreur pour la gérer plus haut dans la pile d'appels
  }
}

// Exporter la fonction addUser pour pouvoir l'importer dans d'autres fichiers
export { addUser }
