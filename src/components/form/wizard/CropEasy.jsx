import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Modal, Form } from 'react-bootstrap'
import getCroppedImg from '../../crop/utils/CropImage'

const ZOOM_MIN = 1
const ZOOM_MAX = 3

export default function CropEasy(props) {
  const { photoURL, setOpenCrop, onCroppedImage } = props

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(ZOOM_MIN)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const cropImage = async () => {
    try {
      const { url } = await getCroppedImg(photoURL, croppedAreaPixels)
      setOpenCrop(false)
      onCroppedImage(url)
    } catch (error) {
      console.error('Error cropping the image:', error)
    }
  }

  const cropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
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
            aspect={1}
            onZoomChange={setZoom}
            onCropChange={setCrop}
            onCropComplete={cropComplete}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <p>Zoom: {Math.round(zoom * 100)}%</p>
        <Form.Range
          value={zoom}
          min={ZOOM_MIN}
          max={ZOOM_MAX}
          step={0.1}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
        />
        <Button variant="primary" onClick={cropImage}>
          Valider
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
