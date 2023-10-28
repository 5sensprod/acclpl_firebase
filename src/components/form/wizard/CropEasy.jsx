import React, { useState } from 'react'
import Cropper from 'react-easy-crop'
import { Button, Modal, Form } from 'react-bootstrap'
import getCroppedImg from '../../crop/utils/CropImage'
import { useFormWizardState } from '../wizard/FormWizardContext'

const ZOOM_MIN = 1
const ZOOM_MAX = 3
const ROTATION_MIN = -10
const ROTATION_MAX = 10

const modalBodyStyle = { height: 400, minWidth: 500 }

export default function CropEasy({ photoURL, setOpenCrop, onCroppedImage }) {
  const { state: formWizardState, dispatch } = useFormWizardState()

  const initialZoom = formWizardState.formData.zoom || ZOOM_MIN
  const initialRotation = formWizardState.formData.rotation || 0

  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(initialZoom)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [rotation, setRotation] = useState(initialRotation)

  const cropImage = async () => {
    try {
      const { url } = await getCroppedImg(photoURL, croppedAreaPixels, rotation)
      setOpenCrop(false)
      onCroppedImage(url)
      dispatch({ type: 'SET_ZOOM', payload: zoom })
      dispatch({ type: 'SET_ROTATION', payload: rotation })
    } catch (error) {
      console.error('Error cropping the image:', error)
    }
  }

  const cropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }

  const handleReset = () => {
    setZoom(1)
    setRotation(0)
  }

  return (
    <Modal show={true} onHide={() => setOpenCrop(false)} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Crop Image</Modal.Title>
      </Modal.Header>
      <Modal.Body style={modalBodyStyle}>
        <Cropper
          image={photoURL}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          n
          aspect={1}
          onZoomChange={setZoom}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={cropComplete}
        />
      </Modal.Body>
      <Modal.Footer>
        <ZoomSlider zoom={zoom} setZoom={setZoom} />
        <RotationSlider rotation={rotation} setRotation={setRotation} />{' '}
        <Button variant="primary" onClick={handleReset}>
          Réinitialiser
        </Button>
        <Button variant="primary" onClick={cropImage}>
          Valider
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const ZoomSlider = ({ zoom, setZoom }) => (
  <>
    <p>Zoom: {Math.round(zoom * 100)}%</p>
    <Form.Range
      value={zoom}
      min={ZOOM_MIN}
      max={ZOOM_MAX}
      step={0.1}
      onChange={(e) => setZoom(parseFloat(e.target.value))}
    />
  </>
)

const RotationSlider = ({ rotation, setRotation }) => (
  <>
    <p>Rotation: {rotation}°</p>
    <Form.Range
      value={rotation}
      min={ROTATION_MIN}
      max={ROTATION_MAX}
      step={1}
      onChange={(e) => setRotation(parseInt(e.target.value, 10))}
    />
  </>
)
