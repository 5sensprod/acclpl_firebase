import { useContext, useState } from 'react'
import { useFormWizardState } from '../context/FormWizardContext'
import { UserContext } from '../../../context/userContext'
import { uploadImage } from '../../../services/uploadImageWizard'
import { generateUniqueFileName } from '../../../utils/filenameUtils'
import { submitData } from '../wizard/wizardHandlers'
import { compressImage } from '../../../utils/imageCompression'
import { addObservation } from '../../../services/observationService'

const useHandleSubmitClick = (setIsLoading) => {
  const { state } = useFormWizardState()
  const { currentUser } = useContext(UserContext)
  const { dispatch } = useFormWizardState()
  const [showModal, setShowModal] = useState(false)
  const handleCloseModal = () => setShowModal(false)

  const handleSubmitClick = async () => {
    setIsLoading(true)
    let downloadURL = null

    try {
      if (state.formData.photoBlob) {
        // First, compress the image
        const compressedImage = await compressImage(state.formData.photoBlob)

        // Then, upload the compressed image
        const uniqueFileName = generateUniqueFileName('uploaded_image')
        downloadURL = await uploadImage(compressedImage, uniqueFileName)
      }

      const observationData = {
        ...state.formData,
        userID: currentUser?.uid || null,
        photoURLs: downloadURL ? [downloadURL] : state.formData.photoURLs,
        date: state.formData.dateOfObservation,
        time: state.formData.timeOfObservation,
      }

      if (state.establishmentExists) {
        // If the establishment already exists, submit the observation data only.
        await addObservation(observationData, {
          id: state.formData.currentEstablishmentId,
        })
      } else {
        // If the establishment doesn't exist, submit both the establishment and observation data.
        await submitData(observationData, currentUser)
      }

      setShowModal(true)
      dispatch({ type: 'RESET_FORM_DATA' })
      dispatch({ type: 'RESET_TO_DEFAULT_PHOTO' })
    } catch (error) {
      alert("Une erreur s'est produite lors de la soumission des données.")
      console.error('Erreur lors de la soumission des données:', error)
    }

    setIsLoading(false)
  }

  return { handleSubmitClick, showModal, handleCloseModal }
}

export default useHandleSubmitClick
