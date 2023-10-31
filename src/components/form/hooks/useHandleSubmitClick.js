import { useContext } from 'react'
import { useFormWizardState } from '../context/FormWizardContext'
import { UserContext } from '../../../context/userContext'
import { uploadImage } from '../../../services/uploadImageWizard'
import { generateUniqueFileName } from '../../../utils/filenameUtils'
import { submitData } from '../wizard/wizardHandlers'

const useHandleSubmitClick = (setIsLoading) => {
  const { state } = useFormWizardState()
  const { currentUser } = useContext(UserContext)

  const handleSubmitClick = async () => {
    setIsLoading(true)
    let downloadURL = null

    try {
      if (state.formData.photoBlob) {
        const uniqueFileName = generateUniqueFileName('uploaded_image')
        downloadURL = await uploadImage(
          state.formData.photoBlob,
          uniqueFileName,
        )
      }

      const observationData = {
        ...state.formData,
        userID: currentUser?.uid || null,
        photoURLs: downloadURL ? [downloadURL] : state.formData.photoURLs,
        date: state.formData.dateOfObservation,
        time: state.formData.timeOfObservation,
      }

      await submitData(observationData, currentUser)
      alert('Soumission réussie!')
    } catch (error) {
      alert("Une erreur s'est produite lors de la soumission des données.")
      console.error('Erreur lors de la soumission des données:', error)
    }

    setIsLoading(false)
  }

  return handleSubmitClick
}

export default useHandleSubmitClick
