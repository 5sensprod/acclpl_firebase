import React from 'react'
import PhotoCapture from '../PhotoCapture'

function PhotoCaptureInput({
  onImageValidate,
  onFileSelected,
  onCroppedImage,
}) {
  return (
    <div className="form-group mb-3">
      <label className="text-light">Ajouter une photo</label>
      <PhotoCapture
        onImageValidate={onImageValidate}
        onFileSelected={onFileSelected}
        onCroppedImage={onCroppedImage}
      />
    </div>
  )
}

export default PhotoCaptureInput
