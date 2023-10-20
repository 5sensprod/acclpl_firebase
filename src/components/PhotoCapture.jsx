import React, { useState } from 'react'
import CropEasy from './crop/CropEasy'
import { Button, Row, Col } from 'react-bootstrap' // Importation des composants react-bootstrap

function PhotoCapture(props) {
  const [photoURL, setPhotoURL] = useState(null)
  const [openCrop, setOpenCrop] = useState(false)
  const [file, setFile] = useState(null)

  const handlePhotoChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoURL(e.target.result)
        setOpenCrop(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCloseCrop = () => {
    setOpenCrop(false)
  }

  return (
    <>
      <Row>
        <Col md={6}>
          <Button
            className="mb-3"
            onClick={() => document.getElementById('photo-input').click()}
          >
            {photoURL ? 'Modifier la photo' : 'Prendre une photo'}
          </Button>
          <input
            type="file"
            accept="image/*"
            capture
            style={{ display: 'none' }}
            id="photo-input"
            onChange={handlePhotoChange}
          />
        </Col>
      </Row>

      {openCrop && (
        <CropEasy
          photoURL={photoURL}
          setOpenCrop={handleCloseCrop}
          setPhotoURL={setPhotoURL}
          setFile={setFile}
        />
      )}

      {/* Here you can use the `file` state to upload or do other operations */}
    </>
  )
}

export default PhotoCapture
