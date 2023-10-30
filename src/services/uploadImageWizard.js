import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from 'firebase/storage'
import { app } from '../firebaseConfig'

const storage = getStorage(app)

async function uploadImage(file, fileName) {
  // Utilisez le nom de fichier fourni pour créer une référence de stockage
  const storageRef = ref(storage, `images/${fileName}`)

  // Créez la tâche d'upload
  const uploadTask = uploadBytesResumable(storageRef, file)

  // Gérez les événements pour l'upload
  return new Promise((resolve, reject) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Utiliser cette callback pour afficher la progression de l'upload
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
        resolve(downloadURL) // Vous pouvez retourner l'URL pour l'utiliser ailleurs dans votre application
      },
    )
  })
}

export { uploadImage }
