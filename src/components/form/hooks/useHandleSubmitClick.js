import { useContext, useState } from 'react'
import { useFormWizardState } from '../context/FormWizardContext'
import { UserContext } from '../../../context/userContext'
import { uploadImage } from '../../../services/uploadImageWizard'
import { generateUniqueFileName } from '../../../utils/filenameUtils'
import { compressImage } from '../../../utils/imageCompression'
import { addObservation } from '../../../services/observationService'
import { addEstablishment } from '../../../services/establishmentService'

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
        const compressedImage = await compressImage(state.formData.photoBlob)
        const uniqueFileName = generateUniqueFileName('uploaded_image')
        downloadURL = await uploadImage(compressedImage, uniqueFileName)
      }

      // Préparer les données de l'observation avec les données de l'utilisateur et de l'image
      const observationData = {
        userID: currentUser?.uid,
        photoURLs: downloadURL ? [downloadURL] : state.formData.photoURLs,
        date: state.formData.dateOfObservation,
        time: state.formData.timeOfObservation,
        additionalNotes: state.formData.additionalNotes,
      }

      // Si l'établissement n'existe pas, créer un nouvel établissement et ensuite ajouter l'observation.
      if (!state.establishmentExists) {
        // Créer un nouvel établissement puis ajouter l'observation en utilisant son ID.
        const newEstablishmentRef = await addEstablishment({
          establishmentName: state.formData.companyName,
          address: state.formData.companyAddress,
          coordinates: state.formData.companyCoordinates,
        })

        observationData.establishmentRef = newEstablishmentRef.id
        await addObservation(observationData)
      } else {
        // L'établissement existe, ajouter l'observation avec l'ID de l'établissement existant.
        observationData.establishmentRef = state.formData.currentEstablishmentId
        await addObservation(observationData)
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
