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
      const reader = new FileReader()
      reader.onload = (e) => {
        dispatch({
          type: 'UPDATE_FORM_DATA',
          payload: {
            photoURLs: [e.target.result],
            originalPhotoURL: e.target.result,
          },
        })
        dispatch({
          type: 'SET_SELECTED_FILE',
          payload: file,
        })
        dispatch({
          type: 'OPEN_CROP',
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCroppedImage = async (croppedImageUrl) => {
    const imageBlob = await fetch(croppedImageUrl).then((r) => r.blob())

    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: {
        photoURLs: [croppedImageUrl],
        photoBlob: imageBlob,
      },
    })
    dispatch({
      type: 'UPDATE_PHOTO_URL',
      payload: croppedImageUrl,
    })
  }

  const imageUrl = formWizardState.formData.photoBlob
    ? URL.createObjectURL(formWizardState.formData.photoBlob)
    : defaultPhoto

  return (
    <>
      <div style={{ textAlign: 'left' }}>
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
          photoURL={formWizardState.formData.originalPhotoURL}
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
