import React, { useState } from 'react'
import CropEasy from '../../crop/CropEasy'
import defaultPhoto from '../../../assets/images/defaultPhoto.jpg'
import { useFormWizardState } from '../wizard/FormWizardContext'
import { Figure, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Trash, Camera, Pencil } from 'react-bootstrap-icons'
import styles from '../../PhotoCapture/PhotoCapture.module.css'

function WizardPhotoCapture() {
  const { dispatch } = useFormWizardState()

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
          payload: { photoURLs: [e.target.result] },
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCroppedImage = (croppedImageUrl) => {
    setState((prevState) => ({
      ...prevState,
      photoURL: croppedImageUrl,
    }))
  }

  const PhotoPreview = () => {
    if (!state.photoURL) return null

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
              src={state.photoURL}
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
                setState((prevState) => ({
                  ...prevState,
                  photoURL: defaultPhoto,
                  originalPhotoURL: null,
                  capturedImage: defaultPhoto,
                }))
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
        <PhotoPreview />
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
          photoURL={state.originalPhotoURL}
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
