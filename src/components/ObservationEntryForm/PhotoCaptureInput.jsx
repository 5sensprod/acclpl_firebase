import React from 'react'
import PhotoCapture from '../PhotoCapture'

function PhotoCaptureInput({ onImageValidate, onFileSelected }) {
  const handleImageValidation = (imageData) => {
    onImageValidate(imageData)
  }

  return (
    <div className="form-group mb-3">
      <label className="text-light">Ajouter une photo</label>
      <PhotoCapture
        onImageValidate={handleImageValidation}
        onFileSelected={onFileSelected}
      />
    </div>
  )
}

export default PhotoCaptureInput
