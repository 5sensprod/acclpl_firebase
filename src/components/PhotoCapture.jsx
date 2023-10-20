import React, { useState } from 'react'
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

  const DEFAULT_PHOTO_URL = defaultPhoto

  const handlePhotoChange = (event) => {
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
  }

  const handleCloseCrop = () => {
    setOpenCrop(false)
  }

  const triggerFileInput = () => {
    document.getElementById('photo-input').click()
  }

  const handleDefaultPhoto = () => {
    setPhotoURL(DEFAULT_PHOTO_URL)
    setUsingDefaultPhoto(true)
    setCapturedImage(DEFAULT_PHOTO_URL)
  }

  const handleDeletePhoto = () => {
    setPhotoURL(null)
    setOriginalPhotoURL(null)
    setIsImageValidated(false)
    props.onImageValidate(null)
    setCapturedImage(null)
  }

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          {!photoURL && (
            <>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={triggerFileInput}>
                  Prendre une photo
                </button>
              </div>
              <div className="mb-3">
                <button
                  className="btn btn-secondary"
                  onClick={handleDefaultPhoto}
                >
                  Je n'ai pas de photo
                </button>
              </div>
            </>
          )}

          {photoURL && usingDefaultPhoto && (
            <>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={triggerFileInput}>
                  Prendre une photo
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDeletePhoto}>
                  Effacer
                </button>
              </div>
            </>
          )}

          {photoURL && !usingDefaultPhoto && (
            <>
              <div className="mb-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setOpenCrop(true)}
                >
                  Modifier
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDeletePhoto}>
                  Effacer la photo
                </button>
              </div>
            </>
          )}

          <input
            type="file"
            accept="image/*"
            capture
            style={{ display: 'none' }}
            id="photo-input"
            onChange={handlePhotoChange}
          />
        </div>

        <div className="col-md-6 text-center">
          {photoURL && (
            <img
              src={photoURL}
              alt="Cropped"
              style={{ width: '100px', height: '100px' }}
            />
          )}
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

export default PhotoCapture
