import React, { useState } from 'react'
import CropEasy from './crop/CropEasy'

function PhotoCapture(props) {
  const [photoURL, setPhotoURL] = useState(null)
  const [originalPhotoURL, setOriginalPhotoURL] = useState(null)
  const [openCrop, setOpenCrop] = useState(false)
  const [file, setFile] = useState(null)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalPhotoURL(e.target.result)
        setPhotoURL(e.target.result)
        setOpenCrop(true)
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

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          {!photoURL && (
            <button
              className="btn btn-primary mb-3"
              onClick={() => document.getElementById('photo-input').click()}
            >
              Prendre une photo
            </button>
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
          setFile={setFile}
          initialZoom={zoom}
          initialRotation={rotation}
          propagateZoom={setZoom}
          propagateRotation={setRotation}
          onNewPhoto={triggerFileInput}
        />
      )}

      {photoURL && (
        <div className="mt-3 text-center">
          {' '}
          {/* Ajouté text-center pour centrer les éléments */}
          <img
            src={photoURL}
            alt="Cropped"
            style={{
              width: '100px',
              height: '100px',
              display: 'block',
              margin: '0 auto',
            }} // Ajouté display: 'block' et margin: '0 auto' pour centrer l'image
          />
          <button
            className="btn btn-secondary mt-3"
            onClick={() => setOpenCrop(true)}
          >
            Modifier
          </button>
        </div>
      )}
    </>
  )
}

export default PhotoCapture
