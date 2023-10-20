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

  const handlePhotoChange = useCallback((event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalPhotoURL(e.target.result)
        setPhotoURL(e.target.result)
        setOpenCrop(true)
        setIsImageValidated(false)
        setCapturedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

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

  return (
    <>
      <div style={{ textAlign: 'left' }}>
        <PhotoPreview
          photoURL={photoURL}
          handleDeletePhoto={handleDeletePhoto}
          triggerFileInput={triggerFileInput}
          openCrop={() => setOpenCrop(true)}
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
    <Figure
      style={{ width: '150px', cursor: 'pointer', textAlign: 'left' }}
      onClick={triggerFileInput}
    >
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-change">Changer la photo</Tooltip>}
      >
        <span>
          <Figure.Image
            src={photoURL}
            alt=""
            thumbnail
            className="w-100 h-100 mb-0" // mb-0 pour supprimer la marge en bas
            style={{
              objectFit: 'cover',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
            }}
          />
        </span>
      </OverlayTrigger>

      <Figure.Caption className="d-flex justify-content-between bg-white p-2 m-0 rounded-bottom">
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
