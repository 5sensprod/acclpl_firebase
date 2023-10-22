import React, { useState, useCallback } from 'react'
import CropEasy from '../crop/CropEasy'
import defaultPhoto from '../../assets/images/defaultPhoto.jpg'
import ValidatedToggleButton from '../ValidatedToggleButton'
import { Figure, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Trash, Camera, Pencil } from 'react-bootstrap-icons'
import styles from './PhotoCapture.module.css'

function PhotoCapture(props) {
  const [photoURL, setPhotoURL] = useState(defaultPhoto)
  const [originalPhotoURL, setOriginalPhotoURL] = useState(null)
  const [openCrop, setOpenCrop] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [file, setFile] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isImageValidated, setIsImageValidated] = useState(false)
  // const [croppedImageUrl, setCroppedImageUrl] = useState(null)

  const { onFileSelected } = props

  const handlePhotoChange = useCallback(
    (event) => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setOriginalPhotoURL(e.target.result)
          setPhotoURL(e.target.result)
          setOpenCrop(true)
          setIsImageValidated(false)
          setCapturedImage(e.target.result)
          onFileSelected(file)
        }
        reader.readAsDataURL(file)
      }
    },
    [onFileSelected],
  )

  const handleCloseCrop = useCallback(() => {
    setOpenCrop(false)
  }, [])

  const triggerFileInput = useCallback(() => {
    document.getElementById('photo-input').click()
  }, [])

  const handleDeletePhoto = useCallback(() => {
    setPhotoURL(defaultPhoto)
    setOriginalPhotoURL(null)
    setIsImageValidated(false)
    props.onImageValidate(null)
    setCapturedImage(defaultPhoto)
  }, [props])

  const handleCroppedImage = (croppedImageUrl) => {
    setPhotoURL(croppedImageUrl)
  }

  return (
    <>
      <div style={{ textAlign: 'left' }}>
        <PhotoPreview
          photoURL={photoURL}
          handleDeletePhoto={handleDeletePhoto}
          triggerFileInput={triggerFileInput}
          openCrop={() => setOpenCrop(true)}
          capturedImage={capturedImage}
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

      {openCrop && (
        <CropEasy
          photoURL={originalPhotoURL}
          setOpenCrop={handleCloseCrop}
          setPhotoURL={setPhotoURL}
          initialZoom={zoom}
          initialRotation={rotation}
          propagateZoom={setZoom}
          propagateRotation={setRotation}
          onNewPhoto={triggerFileInput}
          setFile={setFile}
          file={file}
          onCroppedImage={handleCroppedImage}
        />
      )}

      <ValidatedToggleButton
        isValidated={isImageValidated}
        onValidation={() => {
          setIsImageValidated(true)
          props.onImageValidate(photoURL)
        }}
        onModification={() => setIsImageValidated(false)}
        disabled={!photoURL}
      />
    </>
  )
}

const PhotoPreview = ({
  photoURL,
  triggerFileInput,
  openCrop,
  handleDeletePhoto,
}) => {
  if (!photoURL) return null

  return (
    <Figure className={styles.figureStyle} onClick={triggerFileInput}>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-change">Changer la photo</Tooltip>}
      >
        <span>
          <Figure.Image
            src={photoURL}
            alt=""
            thumbnail
            className={styles.figureImage}
          />
        </span>
      </OverlayTrigger>

      <Figure.Caption className={styles.captionStyle}>
        {photoURL !== defaultPhoto && (
          <Pencil
            className={styles.icon}
            onClick={(e) => {
              e.stopPropagation()
              openCrop()
            }}
          />
        )}

        {photoURL === defaultPhoto ? (
          <Camera className={styles.icon} />
        ) : (
          <Trash
            className={styles.icon}
            onClick={(e) => {
              e.stopPropagation()
              handleDeletePhoto()
            }}
          />
        )}
      </Figure.Caption>
    </Figure>
  )
}

export default PhotoCapture
