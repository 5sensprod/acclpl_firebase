import React from 'react'
import CropEasy from '../CropEasy'
import defaultPhoto from '../../../assets/images/defaultPhoto.jpg'
import { useFormWizardState } from '../wizard/FormWizardContext'
import { InputGroup } from 'react-bootstrap'
import PhotoPreview from './PhotoPreview'

function PhotoCapture() {
  const { state: formWizardState, dispatch } = useFormWizardState()

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      dispatch({ type: 'SAVE_PREVIOUS_CROP_ZOOM_AND_ROTATION' })
      const reader = new FileReader()
      reader.onload = (e) => {
        // Réinitialiser les valeurs de zoom et de rotation à leurs valeurs par défaut
        dispatch({
          type: 'RESET_CROP_ZOOM_AND_ROTATION_TO_DEFAULT',
        })
        // Mettre à jour l'image originale temporaire avec la nouvelle image sélectionnée
        dispatch({
          type: 'SET_TEMP_ORIGINAL_PHOTO',
          payload: e.target.result,
        })
        // Mettre à jour tempPhotoURL et autres états temporaires
        dispatch({
          type: 'SET_TEMP_PHOTO',
          payload: {
            photoURL: e.target.result,
            selectedFile: file,
            croppedImageUrl: null,
          },
        })

        // Ouvrir la modal de recadrage
        dispatch({
          type: 'OPEN_CROP',
        })
      }
      reader.readAsDataURL(file)
    }
  }

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
  }

  const imageUrl = formWizardState.formData.photoBlob
    ? URL.createObjectURL(formWizardState.formData.photoBlob)
    : defaultPhoto

  return (
    <>
      <div style={{ textAlign: 'center' }}>
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
  )
}

export default PhotoCapture
