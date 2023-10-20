import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Modal, Form } from 'react-bootstrap'
import getCroppedImg from './utils/CropImage'

const CropEasy = ({ photoURL, setOpenCrop, setPhotoURL, setFile }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

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
      setPhotoURL(url)
      setFile(file)
      setOpenCrop(false)
    } catch (error) {
      console.log(error)
    }
  }

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
            onRotationChange={setRotation}
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
            min={0}
            max={360}
            onChange={(e) => setRotation(parseFloat(e.target.value))}
          />
        </div>
        <Button variant="outline-primary" onClick={() => setOpenCrop(false)}>
          Annuler
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
