import React, { useEffect, useState } from 'react'
import { useFileReader } from './useFileReader'
import CropEasy from '../CropEasy'
import defaultPhoto from '../../../assets/images/defaultPhoto.jpg'
import { useFormWizardState } from '../context/FormWizardContext'
import { InputGroup, Spinner, Alert } from 'react-bootstrap'
import PhotoPreview from './PhotoPreview'

function PhotoCapture() {
  const { state: formWizardState, dispatch } = useFormWizardState()
  const { fileContent, readAsDataURL, isLoading, error } = useFileReader()
  const [showError, setShowError] = useState(false)

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      dispatch({ type: 'SAVE_PREVIOUS_CROP_ZOOM_AND_ROTATION' })
      readAsDataURL(file)
    }
  }

  useEffect(() => {
    if (fileContent) {
      dispatch({ type: 'RESET_CROP_ZOOM_AND_ROTATION_TO_DEFAULT' })
      dispatch({ type: 'SET_TEMP_ORIGINAL_PHOTO', payload: fileContent })
      dispatch({
        type: 'SET_TEMP_PHOTO',
        payload: {
          photoURL: fileContent,
          selectedFile: null,
          croppedImageUrl: null,
        },
      })
      dispatch({ type: 'OPEN_CROP' })
    }
  }, [fileContent, dispatch])

  const handleCroppedImage = async (croppedImageUrl) => {
    const imageBlob = await fetch(croppedImageUrl).then((r) => r.blob())

    // 1. Mise à jour des états permanents
    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: {
        photoURLs: [croppedImageUrl],
        photoBlob: imageBlob,
      },
    })

    // 2. Mise à jour du photoURL
    dispatch({
      type: 'UPDATE_PHOTO_URL',
      payload: croppedImageUrl,
    })

    // 3. Réinitialisation des états temporaires
    dispatch({
      type: 'RESET_TEMP_PHOTO',
    })

    dispatch({ type: 'SET_IS_OCCURRENCE_FALSE' })
  }

  const imageUrl = formWizardState.formData.photoBlob
    ? URL.createObjectURL(formWizardState.formData.photoBlob)
    : defaultPhoto

  // Gérez les erreurs éventuelles lors de la lecture du fichier
  useEffect(() => {
    if (error) {
      console.error('Error reading file:', error)
      setShowError(true) // Montrer l'alerte d'erreur
      // Après un certain temps, vous voudrez peut-être cacher l'alerte automatiquement
      const timer = setTimeout(() => setShowError(false), 5000)
      return () => clearTimeout(timer) // Nettoyer le timer si le composant est démonté
    }
  }, [error])

  return (
    <>
      {showError && (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          Une erreur est survenue lors du chargement de l'image.
        </Alert>
      )}
      {isLoading && (
        <div style={{ textAlign: 'center', margin: '20px' }}>
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger" style={{ margin: '20px' }}>
          Une erreur est survenue lors du chargement du fichier.
        </Alert>
      )}

      {!isLoading && !error && (
        <>
          <div className="text-start">
            <p className="mb-2 text-start">Photo</p>
            <PhotoPreview
              imageUrl={imageUrl}
              defaultPhoto={defaultPhoto}
              dispatch={dispatch}
            />
          </div>
          <InputGroup className="d-none">
            <InputGroup.Text id="photo-input-label">Upload</InputGroup.Text>
            <input
              type="file"
              accept="image/*"
              capture
              id="photo-input"
              aria-describedby="photo-input-label"
              onChange={handlePhotoChange}
            />
          </InputGroup>
          {formWizardState.openCrop && (
            <CropEasy
              photoURL={formWizardState.tempPhotoURL}
              onCroppedImage={handleCroppedImage}
              setOpenCrop={(open) => {
                if (!open) {
                  dispatch({ type: 'CLOSE_CROP' })
                }
              }}
            />
          )}
        </>
      )}
    </>
  )
}

export default PhotoCapture
