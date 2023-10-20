import React, { useState, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Modal, Form } from 'react-bootstrap'
import getCroppedImg from './utils/CropImage'

const CropEasy = ({
  photoURL,
  setOpenCrop,
  setPhotoURL,
  setFile,
  initialZoom,
  initialRotation,
  propagateZoom,
  propagateRotation,
  onNewPhoto,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(initialZoom)
  const [rotation, setRotation] = useState(initialRotation)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  useEffect(() => {
    propagateZoom(zoom)
    propagateRotation(rotation)
  }, [zoom, rotation, propagateZoom, propagateRotation])

  const cropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation,
      )
      setPhotoURL(url) // Ceci devrait mettre à jour la photo dans la miniature
      setFile(file)
      setOpenCrop(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRotationChange = (newRotation) => {
    if (newRotation > 10) {
      setRotation(10)
    } else if (newRotation < -10) {
      setRotation(-10)
    } else {
      setRotation(newRotation)
    }
  }

  const resetZoomAndRotation = () => {
    setZoom(1)
    setRotation(0)
  }

  const isDefaultValues = zoom === 1 && rotation === 0

  return (
    <Modal show={true} onHide={() => setOpenCrop(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{ height: 400, minWidth: 500 }}>
          <Cropper
            image={photoURL}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onZoomChange={setZoom}
            onRotationChange={handleRotationChange}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-100">
          <p>Zoom: {zoomPercent(zoom)}</p>
          <Form.Range
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
          <p>Rotation: {rotation + '°'}</p>
          <Form.Range
            value={rotation}
            min={-10}
            max={10}
            onChange={(e) => handleRotationChange(parseFloat(e.target.value))}
          />
        </div>
        <Button variant="outline-secondary" onClick={onNewPhoto}>
          Nouvelle Photo
        </Button>
        <Button
          variant="outline-secondary"
          onClick={resetZoomAndRotation}
          disabled={isDefaultValues}
        >
          Réinitialiser
        </Button>
        <Button variant="primary" onClick={cropImage}>
          Valider
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CropEasy

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`
}
