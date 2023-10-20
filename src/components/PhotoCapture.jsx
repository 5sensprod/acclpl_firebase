import React, { useState, useCallback } from 'react'
import CropEasy from './crop/CropEasy'
import defaultPhoto from '../assets/images/defaultPhoto.jpg'
import ValidatedToggleButton from './ValidatedToggleButton'

function PhotoCapture(props) {
  const [photoURL, setPhotoURL] = useState(null)
  const [originalPhotoURL, setOriginalPhotoURL] = useState(null)
  const [openCrop, setOpenCrop] = useState(false)
  const [usingDefaultPhoto, setUsingDefaultPhoto] = useState(false)
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
        setUsingDefaultPhoto(false)
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

  const handleDefaultPhoto = useCallback(() => {
    setPhotoURL(defaultPhoto)
    setUsingDefaultPhoto(true)
    setCapturedImage(defaultPhoto)
  }, [])

  const handleDeletePhoto = useCallback(() => {
    setPhotoURL(null)
    setOriginalPhotoURL(null)
    setIsImageValidated(false)
    props.onImageValidate(null)
    setCapturedImage(null)
  }, [props])

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <ActionButtonGroup
            photoURL={photoURL}
            usingDefaultPhoto={usingDefaultPhoto}
            triggerFileInput={triggerFileInput}
            handleDefaultPhoto={handleDefaultPhoto}
            handleDeletePhoto={handleDeletePhoto}
            openCrop={() => setOpenCrop(true)}
          />
          <input
            type="file"
            accept="image/*"
            capture
            className="d-none"
            id="photo-input"
            onChange={handlePhotoChange}
          />
        </div>
        <div className="col-md-6 text-center">
          <PhotoPreview photoURL={photoURL} />
        </div>
      </div>

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

const ActionButtonGroup = ({
  photoURL,
  usingDefaultPhoto,
  triggerFileInput,
  handleDefaultPhoto,
  handleDeletePhoto,
  openCrop,
}) => {
  if (!photoURL) {
    return (
      <>
        <div className="mb-3">
          <button className="btn btn-primary" onClick={triggerFileInput}>
            Prendre une photo
          </button>
        </div>
        <div className="mb-3">
          <button className="btn btn-secondary" onClick={handleDefaultPhoto}>
            Je n'ai pas de photo
          </button>
        </div>
      </>
    )
  }

  const buttonClass = usingDefaultPhoto ? 'btn-primary' : 'btn-secondary'
  return (
    <>
      <div className="mb-3">
        <button
          className={`btn ${buttonClass}`}
          onClick={usingDefaultPhoto ? triggerFileInput : openCrop}
        >
          {usingDefaultPhoto ? 'Prendre une photo' : 'Modifier'}
        </button>
      </div>
      <div className="mb-3">
        <button className="btn btn-danger" onClick={handleDeletePhoto}>
          {usingDefaultPhoto ? 'Effacer' : 'Effacer la photo'}
        </button>
      </div>
    </>
  )
}

const PhotoPreview = ({ photoURL }) => {
  if (!photoURL) return null
  return (
    <img
      src={photoURL}
      alt="Cropped"
      className="img-thumbnail"
      style={{ width: '100px', height: '100px' }}
    />
  )
}

export default PhotoCapture
