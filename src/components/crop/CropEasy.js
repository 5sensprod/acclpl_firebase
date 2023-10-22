import React, { useState, useEffect, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Modal, Form } from 'react-bootstrap'
import getCroppedImg from './utils/CropImage'

const ZOOM_MIN = 1
const ZOOM_MAX = 3
const ROTATION_MIN = -10
const ROTATION_MAX = 10

export default function CropEasy(props) {
  const {
    photoURL,
    setOpenCrop,
    setPhotoURL,
    setFile,
    initialZoom,
    initialRotation,
    propagateZoom,
    propagateRotation,
    onNewPhoto,
  } = props

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(initialZoom)
  const [rotation, setRotation] = useState(initialRotation)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  useEffect(() => {
    propagateZoom(zoom)
    propagateRotation(rotation)
  }, [zoom, rotation, propagateZoom, propagateRotation])

  const handleRotationChange = useCallback((newRotation) => {
    if (newRotation > ROTATION_MAX) {
      setRotation(ROTATION_MAX)
    } else if (newRotation < ROTATION_MIN) {
      setRotation(ROTATION_MIN)
    } else {
      setRotation(newRotation)
    }
  }, [])

  const cropImage = async () => {
    try {
      const { file, url } = await getCroppedImg(
        photoURL,
        croppedAreaPixels,
        rotation,
      )
      setPhotoURL(url)
      setFile(file)
      setOpenCrop(false)
      props.onCroppedImage(url)
    } catch (error) {
      console.error('Error cropping the image:', error)
      // TODO: Handle the error and show a feedback message to the user if needed
    }
  }

  const cropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }

  const resetZoomAndRotation = () => {
    setZoom(ZOOM_MIN)
    setRotation(0)
  }

  const isDefaultValues = zoom === ZOOM_MIN && rotation === 0

  return (
    <Modal show={true} onHide={() => setOpenCrop(false)} size="lg">
      <CropHeader />
      <CropBody
        photoURL={photoURL}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        onZoomChange={setZoom}
        onRotationChange={handleRotationChange}
        onCropChange={setCrop}
        onCropComplete={cropComplete}
      />
      <CropFooter
        onNewPhoto={onNewPhoto}
        zoom={zoom}
        rotation={rotation}
        resetZoomAndRotation={resetZoomAndRotation}
        cropImage={cropImage}
        isDefaultValues={isDefaultValues}
        onZoomChange={setZoom}
        onRotationChange={handleRotationChange}
      />
    </Modal>
  )
}

function CropHeader() {
  return (
    <Modal.Header closeButton>
      <Modal.Title>Crop Image</Modal.Title>
    </Modal.Header>
  )
}

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
      <div style={{ height: 400, minWidth: 500 }}>
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

function CropFooter({
  onNewPhoto,
  zoom,
  rotation,
  resetZoomAndRotation,
  cropImage,
  isDefaultValues,
  onZoomChange,
  onRotationChange,
}) {
  return (
    <Modal.Footer>
      <div className="w-100">
        <p>Zoom: {zoomPercent(zoom)}</p>
        <Form.Range
          value={zoom}
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={0.1}
          onChange={(e) => onZoomChange(parseFloat(e.target.value))}
        />
        <p>Rotation: {rotation + '°'}</p>
        <Form.Range
          value={rotation}
          min={ROTATION_MIN}
          max={ROTATION_MAX}
          onChange={(e) => onRotationChange(parseFloat(e.target.value))}
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
  )
}

const zoomPercent = (value) => {
  return `${Math.round(value * 100)}%`
}
