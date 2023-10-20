import React, { useState } from 'react'
import CropEasy from './crop/CropEasy'
import defaultPhoto from '../assets/images/defaultPhoto.jpg'

function PhotoCapture(props) {
  const [photoURL, setPhotoURL] = useState(null)
  const [originalPhotoURL, setOriginalPhotoURL] = useState(null)
  const [openCrop, setOpenCrop] = useState(false)
  const [usingDefaultPhoto, setUsingDefaultPhoto] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [file, setFile] = useState(null)

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
  }

  const handleDeletePhoto = () => {
    setPhotoURL(null)
    setOriginalPhotoURL(null)
  }

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          {!photoURL && (
            <>
              <button
                className="btn btn-primary mb-3 mr-2"
                onClick={triggerFileInput}
              >
                Prendre une photo
              </button>
              <button
                className="btn btn-secondary mb-3"
                onClick={handleDefaultPhoto}
              >
                Je n'ai pas de photo
              </button>
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

      {photoURL && (
        <div className="mt-3 text-center">
          <img
            src={photoURL}
            alt="Cropped"
            style={{
              width: '100px',
              height: '100px',
              display: 'block',
              margin: '0 auto',
            }}
          />
          {usingDefaultPhoto ? (
            <div className="mt-2">
              <button className="btn btn-primary" onClick={triggerFileInput}>
                Prendre une photo
              </button>
            </div>
          ) : (
            <div className="mt-2 d-flex justify-content-center">
              <button
                className="btn btn-secondary mr-2"
                onClick={() => setOpenCrop(true)}
              >
                Modifier
              </button>
              <button className="btn btn-danger" onClick={handleDeletePhoto}>
                Effacer la photo
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default PhotoCapture
