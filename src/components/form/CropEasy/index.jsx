import React, { useState, useCallback } from 'react'
import { Modal } from 'react-bootstrap'
import { cropImage } from './imageUtils'
import CropHeader from './CropHeader'
import CropBody from './CropBody'
import CropFooter from './CropFooter'
import { ZOOM_MIN, ROTATION_MIN, ROTATION_MAX } from './constants'
import { useFormWizardState } from '../wizard/FormWizardContext'

export default function CropEasy({ setOpenCrop, onCroppedImage }) {
  const { state, dispatch } = useFormWizardState()
  const { tempPhotoURL } = state
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(state.zoom)
  const [rotation, setRotation] = useState(state.rotation)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const handleRotationChange = useCallback((newRotation) => {
    if (newRotation > ROTATION_MAX) {
      setRotation(ROTATION_MAX)
    } else if (newRotation < ROTATION_MIN) {
      setRotation(ROTATION_MIN)
    } else {
      setRotation(newRotation)
    }
  }, [])

  const handleCrop = async () => {
    try {
      const url = await cropImage(
        tempPhotoURL,
        croppedAreaPixels,
        rotation,
        zoom,
      )
      dispatch({
        type: 'UPDATE_ZOOM_AND_ROTATION',
        payload: {
          zoom: zoom,
          rotation: rotation,
        },
      })
      onCroppedImage(url)
      dispatch({
        type: 'SET_ORIGINAL_PHOTO',
        payload: state.tempOriginalPhotoURL,
      })

      dispatch({ type: 'CLOSE_CROP' })
    } catch (error) {
      console.error('Error cropping the image:', error)
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
    <Modal
      show={true}
      onHide={() => {
        setOpenCrop(false)
        dispatch({ type: 'RESET_TEMP_PHOTO' })
      }}
      size="lg"
    >
      <CropHeader title="Envoyer une photo" />
      <CropBody
        tempPhotoURL={tempPhotoURL}
        crop={crop}
        zoom={zoom}
        rotation={rotation}
        onZoomChange={setZoom}
        onRotationChange={handleRotationChange}
        onCropChange={setCrop}
        onCropComplete={cropComplete}
      />
      <CropFooter
        zoom={zoom}
        rotation={rotation}
        resetZoomAndRotation={resetZoomAndRotation}
        cropImage={handleCrop}
        isDefaultValues={isDefaultValues}
        onZoomChange={setZoom}
        onRotationChange={handleRotationChange}
      />
    </Modal>
  )
}
