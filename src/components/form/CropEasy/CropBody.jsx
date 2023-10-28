import React from 'react'
import { Modal } from 'react-bootstrap'
import Cropper from 'react-easy-crop'

function CropBody({
  photoURL,
  crop,
  zoom,
  rotation,
  onZoomChange,
  onRotationChange,
  onCropChange,
  onCropComplete,
}) {
  return (
    <Modal.Body>
      <div style={{ height: 400, minWidth: 400 }}>
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onZoomChange={onZoomChange}
          onRotationChange={onRotationChange}
          onCropChange={onCropChange}
          onCropComplete={onCropComplete}
        />
      </div>
    </Modal.Body>
  )
}

export default CropBody
