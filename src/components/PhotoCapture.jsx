import React, { useState } from 'react'
import PhotoCropper from './PhotoCropper' // Assurez-vous que le chemin d'importation est correct

function PhotoCapture(props) {
  const [photo, setPhoto] = useState(null)

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhoto(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCropComplete = (croppedArea, croppedAreaPixels) => {
    console.log(croppedArea, croppedAreaPixels)
  }

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <button
            className="btn btn-primary mb-3"
            onClick={() => document.getElementById('photo-input').click()}
          >
            {photo ? 'Modifier la photo' : 'Prendre une photo'}
          </button>
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

      {photo && (
        <div className="row justify-content-center mt-4">
          <div className="col-md-6">
            <PhotoCropper photo={photo} onCropComplete={handleCropComplete} />
          </div>
        </div>
      )}
    </>
  )
}

export default PhotoCapture
