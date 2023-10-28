import React, { useState, useCallback } from 'react'
import { Modal } from 'react-bootstrap'
import { cropImage } from './imageUtils'
import CropHeader from './CropHeader'
import CropBody from './CropBody'
import CropFooter from './CropFooter'
import { ZOOM_MIN, ROTATION_MIN, ROTATION_MAX } from './constants'
import { useFormWizardState } from '../wizard/FormWizardContext'

export default function CropEasy({
  photoURL,
  setOpenCrop,
  initialZoom = ZOOM_MIN,
  initialRotation = 0,
  onCroppedImage,
}) {
  const { dispatch } = useFormWizardState()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(initialZoom)
  const [rotation, setRotation] = useState(initialRotation)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  // Temp states
  const [tempCrop, setTempCrop] = useState(crop)
  const [tempZoom, setTempZoom] = useState(zoom)
  const [tempRotation, setTempRotation] = useState(rotation)

  const handleTempRotationChange = useCallback((newRotation) => {
    if (newRotation > ROTATION_MAX) {
      setTempRotation(ROTATION_MAX)
    } else if (newRotation < ROTATION_MIN) {
      setTempRotation(ROTATION_MIN)
    } else {
      setTempRotation(newRotation)
    }
  }, [])

  const handleCrop = async () => {
    try {
      const url = await cropImage(photoURL, croppedAreaPixels, tempRotation)

      // Applying temporary states to main states
      setCrop(tempCrop)
      setZoom(tempZoom)
      setRotation(tempRotation)

      onCroppedImage(url)
      dispatch({ type: 'CLOSE_CROP' }) // Fermeture de la modal une fois que l'image est rognée
    } catch (error) {
      console.error('Error cropping the image:', error)
    }
  }

  const cropComplete = (_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels)
  }

  const resetZoomAndRotation = () => {
    setTempZoom(ZOOM_MIN)
    setTempRotation(0)
  }

  const isDefaultValues = tempZoom === ZOOM_MIN && tempRotation === 0

  return (
    <Modal show={true} onHide={() => setOpenCrop(false)} size="lg">
      <CropHeader title="Envoyer une photo" />
      <CropBody
        photoURL={photoURL}
        crop={tempCrop}
        zoom={tempZoom}
        rotation={tempRotation}
        onZoomChange={setTempZoom}
        onRotationChange={handleTempRotationChange}
        onCropChange={setTempCrop}
        onCropComplete={cropComplete}
      />
      <CropFooter
        zoom={tempZoom}
        rotation={tempRotation}
        resetZoomAndRotation={resetZoomAndRotation}
        cropImage={handleCrop}
        isDefaultValues={isDefaultValues}
        onZoomChange={setTempZoom}
        onRotationChange={handleTempRotationChange}
      />
    </Modal>
  )
}
