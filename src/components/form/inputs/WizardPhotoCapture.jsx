import React, { useState, useEffect } from 'react'
import CropEasy from '../wizard/CropEasy'
import defaultPhoto from '../../../assets/images/defaultPhoto.jpg'
import { useFormWizardState } from '../wizard/FormWizardContext'
import { Figure, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Trash, Camera, Pencil } from 'react-bootstrap-icons'
import styles from '../../PhotoCapture/PhotoCapture.module.css'

function WizardPhotoCapture() {
  const { state: formWizardState, dispatch } = useFormWizardState()

  useEffect(() => {
    if (formWizardState.formData.croppedImageUrl) {
      setState((prevState) => ({
        ...prevState,
        photoURL: formWizardState.formData.croppedImageUrl,
      }))
    }
  }, [formWizardState.formData.croppedImageUrl])

  const [state, setState] = useState({
    photoURL: defaultPhoto,
    originalPhotoURL: null,
    openCrop: false,
    file: null,
    capturedImage: null,
  })

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setState((prevState) => ({
          ...prevState,
          originalPhotoURL: e.target.result,
          photoURL: e.target.result,
          openCrop: true,
          capturedImage: e.target.result,
        }))
        dispatch({
          type: 'UPDATE_FORM_DATA',
          payload: {
            photoURLs: [e.target.result],
            originalPhotoURL: e.target.result,
          },
        })
        // Dispatch action to update selectedFile in context
        dispatch({
          type: 'SET_SELECTED_FILE',
          payload: file,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCroppedImage = async (croppedImageUrl) => {
    const imageBlob = await fetch(croppedImageUrl).then((r) => r.blob())

    setState((prevState) => ({
      ...prevState,
      photoURL: croppedImageUrl + '?' + new Date().getTime(), // Ajout d'un timestamp pour forcer un changement d'URL
    }))

    dispatch({
      type: 'UPDATE_FORM_DATA',
      payload: {
        photoURLs: [croppedImageUrl],
        photoBlob: imageBlob,
      },
    })

    // Dispatch action to update croppedImageUrl in context
    dispatch({
      type: 'SET_CROPPED_IMAGE_URL',
      payload: croppedImageUrl,
    })
  }

  const imageUrl = formWizardState.formData.photoBlob
    ? URL.createObjectURL(formWizardState.formData.photoBlob)
    : defaultPhoto

  const PhotoPreview = ({ imageUrl }) => {
    if (!imageUrl) return null

    return (
      <Figure
        className={styles.figureStyle}
        onClick={() => document.getElementById('photo-input').click()}
      >
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip id="tooltip-change">Changer la photo</Tooltip>}
        >
          <span>
            <Figure.Image
              src={imageUrl}
              alt=""
              thumbnail
              className={styles.figureImage}
            />
          </span>
        </OverlayTrigger>
        <Figure.Caption className={styles.captionStyle}>
          {state.photoURL !== defaultPhoto && (
            <Pencil
              className={styles.icon}
              onClick={(e) => {
                e.stopPropagation()
                setState((prevState) => ({ ...prevState, openCrop: true }))
              }}
            />
          )}
          {state.photoURL === defaultPhoto ? (
            <Camera className={styles.icon} />
          ) : (
            <Trash
              className={styles.icon}
              onClick={(e) => {
                e.stopPropagation()
                // Votre logique de suppression ici
              }}
            />
          )}
        </Figure.Caption>
      </Figure>
    )
  }

  return (
    <>
      <div style={{ textAlign: 'left' }}>
        <PhotoPreview imageUrl={imageUrl} />
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
      {state.openCrop && (
        <CropEasy
          photoURL={formWizardState.formData.originalPhotoURL}
          onCroppedImage={handleCroppedImage}
          setOpenCrop={(open) =>
            setState((prevState) => ({ ...prevState, openCrop: open }))
          }
          setPhotoURL={handleCroppedImage}
          onNewPhoto={() => document.getElementById('photo-input').click()}
        />
      )}
    </>
  )
}

export default WizardPhotoCapture
