import React, { useState } from 'react'
import Cropper from 'react-easy-crop'

function PhotoCropper({ photo, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="crop-container">
            <Cropper
              image={photo}
              crop={crop}
              zoom={zoom}
              aspect={4 / 3}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-3">
        <div className="col-md-8">
          <div className="controls d-flex justify-content-center">
            <label className="me-2" htmlFor="zoom">
              Zoom :
            </label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              id="zoom"
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="zoom-range form-range z-3"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoCropper
