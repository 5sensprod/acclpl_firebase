import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { app } from '../firebaseConfig'

const storage = getStorage(app) // Assurez-vous que 'app' est l'instance de Firebase que vous avez initialisée précédemment.

async function uploadImage(file) {
  // Créez une référence de stockage avec un nom de fichier unique
  const storageRef = ref(storage, `images/${file.name}`)

  // Créez la tâche d'upload
  const uploadTask = uploadBytesResumable(storageRef, file)

  // Gérez les événements pour l'upload
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Vous pouvez utiliser cette callback pour afficher la progression de l'upload
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        console.log('Upload is ' + progress + '% done')
      },
      (error) => {
        // Gérez les erreurs
        console.error('Upload failed:', error)
        reject(error)
      },
      async () => {
        // Récupérez l'URL de téléchargement lorsque l'upload est terminé
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
        console.log('File available at', downloadURL)
        resolve(downloadURL) // Vous pouvez retourner l'URL pour l'utiliser ailleurs dans votre application
      },
    )
  })
}

export { uploadImage }
