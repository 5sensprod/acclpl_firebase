import React, { useState, useContext } from 'react'
import { Button, Spinner } from 'react-bootstrap'
import { useFormWizardState } from './FormWizardContext'
import { checkDuplicateEstablishment } from '../../../services/establishmentCheckerService'
import DynamicModal from './DynamicModal'
import formatCompanyName from '../../../utils/formatCompanyName'
import normalizedCompanyName from '../../../utils/normalizedCompanyName'
import { useModal } from './ModalContext'
import { isFormReadyToSubmit } from './wizardValidation'
import PreviewModal from './PreviewModal'
import { UserContext } from '../../../context/userContext'
import { submitData } from '../wizard/wizardHandlers'
import { uploadImage } from '../../../services/uploadImageWizard'
import { generateUniqueFileName } from '../../../utils/filenameUtils'

const WizardStepManager = () => {
  const { state, dispatch } = useFormWizardState()
  const { setModalConfig } = useModal()
  const [isLoading, setIsLoading] = useState(false)

  const currentStep = state.currentStep
  const totalSteps = state.steps.length

  const { currentUser } = useContext(UserContext)

  const [showPreview, setShowPreview] = useState(false)

  const canFinish = isFormReadyToSubmit(state.formData)

  const moveToPrevStep = () => {
    dispatch({ type: 'PREV_STEP' })
  }

  const showEstablishmentModal = (duplicateCheckResult) => {
    const {
      establishmentName,
      streetName,
      city,
      postalCode,
      streetNumber,
      photoURL,
      coordinates,
    } = duplicateCheckResult.details
    // console.log('Coordinates:', coordinates) // Cela affiche les coordonnées dans la console

    // Vérifiez si streetNumber est défini et, dans l'affirmative, incluez-le dans l'adresse.
    const fullAddress = streetNumber
      ? `${streetNumber} ${streetName}, ${postalCode} ${city}`
      : `${streetName}, ${postalCode} ${city}`

    const image = new Image()
    image.src = photoURL
    image.onload = () => {
      setModalConfig({
        isVisible: true,
        title: 'Etablissement existant',
        body: (
          <div>
            <div className="bg-dark text-light d-flex justify-content-around align-items-center p-3 mb-3 rounded">
              <div>
                <h3 className="mb-2">{establishmentName}</h3>
                <p className="mb-0">{fullAddress.split(',')[0]}</p>
                <p className="mb-2">{city}</p>
              </div>
              <div>
                <img
                  src={photoURL}
                  alt="Observation"
                  className="rounded"
                  style={{ width: '80px', height: '80px' }}
                />
              </div>
            </div>
            <h5 className="mb-2">Est-ce en lien avec votre signalement ?</h5>
          </div>
        ),
        buttons: [
          {
            text: 'Oui',
            onClick: () => {
              dispatch({
                type: 'UPDATE_FORM_DATA',
                payload: {
                  companyAddress: fullAddress,
                  companyCoordinates: coordinates,
                },
              })
              dispatch({ type: 'NEXT_STEP' })
              dispatch({ type: 'UPDATE_HAS_CLOSED_MODAL', payload: true })
              setModalConfig((prevConfig) => ({
                ...prevConfig,
                isVisible: false,
              }))
            },
          },
          {
            text: 'Non',
            onClick: () => {
              dispatch({ type: 'NEXT_STEP' })
              dispatch({ type: 'UPDATE_HAS_CLOSED_MODAL', payload: true })
              setModalConfig((prevConfig) => ({
                ...prevConfig,
                isVisible: false,
              }))
              dispatch({ type: 'CLOSE_MODAL' })
            },
          },
        ],
      })
      setIsLoading(false)
    }
  }

  const moveToNextStep = async () => {
    setIsLoading(true)

    if (
      currentStep === 1 &&
      state.formData.companyName.trim() !== '' &&
      !state.hasClosedModal
    ) {
      const formattedName = formatCompanyName(state.formData.companyName)
      const normalized = normalizedCompanyName(formattedName)

      dispatch({
        type: 'FORMAT_COMPANY',
        payload: {
          companyName: formattedName,
          normalizedCompanyName: normalized,
        },
      })

      const duplicateCheckResult = await checkDuplicateEstablishment(normalized)

      if (duplicateCheckResult.found) {
        showEstablishmentModal(duplicateCheckResult)
        return
      }
    }

    dispatch({ type: 'NEXT_STEP' })
    setIsLoading(false)
  }
  const handleVisualizeClick = () => {
    setShowPreview(true)
  }

  const handleCloseModal = () => {
    setShowPreview(false)
  }

  const handleSubmitClick = async () => {
    setIsLoading(true)

    let downloadURL = null // Initialisation de l'URL à null

    try {
      // Récupérez le blob de l'image recadrée de l'état global
      const imageBlob = state.formData.photoBlob

      // Si l'imageBlob existe, uploadez-la sur Firebase Storage
      if (imageBlob) {
        const baseFileName = 'uploaded_image' // Vous pouvez choisir un autre nom si vous le souhaitez
        const uniqueFileName = generateUniqueFileName(baseFileName) // Générez un nom de fichier unique

        downloadURL = await uploadImage(imageBlob, uniqueFileName) // Passez le nom de fichier unique à la fonction uploadImage
      }

      // Création des données pour la soumission
      const observationData = {
        ...state.formData,
        userID: currentUser ? currentUser.uid : null,
        photoURLs: downloadURL ? [downloadURL] : state.formData.photoURLs,
        // Si downloadURL existe, utilisez-le, sinon utilisez photoURLs de l'état
      }
      observationData.date = observationData.dateOfObservation
      observationData.time = observationData.timeOfObservation

      // Soumettez toutes les données à Firebase Firestore ou à la base de données que vous utilisez
      await submitData(observationData, currentUser) // Utilisez observationData ici

      alert('Soumission réussie!')
    } catch (error) {
      alert("Une erreur s'est produite lors de la soumission des données.")
      console.error('Erreur lors de la soumission des données:', error)
    }

    setIsLoading(false)
  }

  return (
    <div className="d-flex justify-content-between mb-2">
      {currentStep > 1 && (
        <Button variant="outline-primary" onClick={moveToPrevStep}>
          Revenir
        </Button>
      )}

      {currentStep < totalSteps && (
        <Button variant="primary" onClick={moveToNextStep} disabled={isLoading}>
          {isLoading ? <Spinner animation="border" size="sm" /> : 'Suivant'}
        </Button>
      )}

      {currentStep === totalSteps && (
        <>
          <Button
            variant="secondary"
            onClick={handleVisualizeClick}
            disabled={!canFinish || isLoading}
          >
            Voir sur la carte
          </Button>
          <Button
            variant="success"
            onClick={handleSubmitClick}
            disabled={!canFinish || isLoading}
          >
            {isLoading ? <Spinner animation="border" size="sm" /> : 'Terminer'}
          </Button>
        </>
      )}
      <DynamicModal />
      {showPreview && (
        <PreviewModal
          show={showPreview}
          onHide={handleCloseModal}
          formData={state.formData}
        />
      )}
    </div>
  )
}

export default WizardStepManager
