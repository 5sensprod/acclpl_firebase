import React from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import { zoomPercent } from './imageUtils'
import { ZOOM_MIN, ZOOM_MAX, ROTATION_MIN, ROTATION_MAX } from './constants'

function CropFooter({
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

export default CropFooter
