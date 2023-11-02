import { useContext, useState } from 'react'
import { useFormWizardState } from '../context/FormWizardContext'
import { UserContext } from '../../../context/userContext'
import { uploadImage } from '../../../services/uploadImageWizard'
import { generateUniqueFileName } from '../../../utils/filenameUtils'
import { submitData } from '../wizard/wizardHandlers'
import { compressImage } from '../../../utils/imageCompression'
import { addObservation } from '../../../services/observationService'

const DEFAULT_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/acclpl.appspot.com/o/images%2Fdefault%2FdefaultPhoto.jpg?alt=media&token=045cbd1a-4377-4dec-bb68-2dbc0754121f'

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
      let photoURLs = state.formData.photoURLs || DEFAULT_IMAGE_URL

      if (!state.formData.photoURLs && state.formData.photoBlob) {
        // First, compress the image
        const compressedImage = await compressImage(state.formData.photoBlob)

        // Then, upload the compressed image
        const uniqueFileName = generateUniqueFileName('uploaded_image')
        downloadURL = await uploadImage(compressedImage, uniqueFileName)

        photoURLs = [downloadURL]
      }

      const observationData = {
        ...state.formData,
        userID: currentUser?.uid || null,
        photoURLs: photoURLs, // use the photoURLs variable directly here
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
      dispatch({ type: 'RESET_TO_FIRST_STEP' })
    } catch (error) {
      alert("Une erreur s'est produite lors de la soumission des données.")
      console.error('Erreur lors de la soumission des données:', error)
    }

    setIsLoading(false)
  }

  return { handleSubmitClick, showModal, handleCloseModal }
}

export default useHandleSubmitClick
