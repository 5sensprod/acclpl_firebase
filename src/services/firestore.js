// Importez les modules nécessaires depuis firebaseConfig.js et firebase/firestore
import { firestore } from '../firebaseConfig'
import { collection, addDoc } from 'firebase/firestore'

// Fonction pour ajouter une nouvelle observation
async function addObservation(observation) {
  try {
    // La fonction addDoc génère un ID de document unique et ajoute les données à la collection "observations"
    const docRef = await addDoc(
      collection(firestore, 'observations'),
      observation,
    )
    console.log('Document written with ID: ', docRef.id)
  } catch (e) {
    console.error('Error adding document: ', e)
  }
}

// Exportez la fonction addObservation pour pouvoir l'importer dans d'autres fichiers
export { addObservation }
