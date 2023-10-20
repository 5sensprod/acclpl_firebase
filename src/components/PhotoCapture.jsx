import React, { useState, useCallback } from 'react'
import CropEasy from './crop/CropEasy'
import defaultPhoto from '../assets/images/defaultPhoto.jpg'
import ValidatedToggleButton from './ValidatedToggleButton'
import {
  Row,
  Col,
  Button,
  Image,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import { Trash } from 'react-bootstrap-icons'

function PhotoCapture(props) {
  const [photoURL, setPhotoURL] = useState(null)
  const [originalPhotoURL, setOriginalPhotoURL] = useState(null)
  const [openCrop, setOpenCrop] = useState(false)
  const [usingDefaultPhoto, setUsingDefaultPhoto] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [file, setFile] = useState(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isImageValidated, setIsImageValidated] = useState(false)

  const handlePhotoChange = useCallback((event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setOriginalPhotoURL(e.target.result)
        setPhotoURL(e.target.result)
        setOpenCrop(true)
        setUsingDefaultPhoto(false)
        setIsImageValidated(false)
        setCapturedImage(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const handleCloseCrop = useCallback(() => {
    setOpenCrop(false)
  }, [])

  const triggerFileInput = useCallback(() => {
    document.getElementById('photo-input').click()
  }, [])

  const handleDefaultPhoto = useCallback(() => {
    setPhotoURL(defaultPhoto)
    setUsingDefaultPhoto(true)
    setCapturedImage(defaultPhoto)
  }, [])

  const handleDeletePhoto = useCallback(() => {
    setPhotoURL(null)
    setOriginalPhotoURL(null)
    setIsImageValidated(false)
    props.onImageValidate(null)
    setCapturedImage(null)
  }, [props])

  return (
    <>
      <Row>
        <Col md={6}>
          <ActionButtonGroup
            photoURL={photoURL}
            usingDefaultPhoto={usingDefaultPhoto}
            triggerFileInput={triggerFileInput}
            handleDefaultPhoto={handleDefaultPhoto}
            handleDeletePhoto={handleDeletePhoto}
            openCrop={() => setOpenCrop(true)}
          />
          <InputGroup className="d-none">
            <InputGroup.Text id="photo-input-label">Upload</InputGroup.Text>
            <input
              type="file"
              accept="image/*"
              capture
              id="photo-input"
              aria-describedby="photo-input-label"
              onChange={handlePhotoChange}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-center">
          <PhotoPreview
            photoURL={photoURL}
            capturedImage={capturedImage}
            handleDeletePhoto={handleDeletePhoto}
          />
        </Col>
      </Row>

      {openCrop && (
        <CropEasy
          photoURL={originalPhotoURL}
          setOpenCrop={handleCloseCrop}
          setPhotoURL={setPhotoURL}
          initialZoom={zoom}
          initialRotation={rotation}
          propagateZoom={setZoom}
          propagateRotation={setRotation}
          onNewPhoto={triggerFileInput}
          setFile={setFile}
        />
      )}

      <ValidatedToggleButton
        isValidated={isImageValidated}
        onValidation={() => {
          setIsImageValidated(true)
          props.onImageValidate(photoURL)
        }}
        onModification={() => setIsImageValidated(false)}
        disabled={!photoURL}
      />
    </>
  )
}

const ActionButtonGroup = ({
  photoURL,
  usingDefaultPhoto,
  triggerFileInput,
  handleDefaultPhoto,
  handleDeletePhoto,
  openCrop,
}) => {
  if (!photoURL) {
    return (
      <>
        <Button variant="primary" className="mb-3" onClick={triggerFileInput}>
          Prendre une photo
        </Button>
        <Button
          variant="secondary"
          className="mb-3"
          onClick={handleDefaultPhoto}
        >
          Je n'ai pas de photo
        </Button>
      </>
    )
  }

  return (
    <>
      <Button
        variant={usingDefaultPhoto ? 'primary' : 'secondary'}
        className="mb-3"
        onClick={usingDefaultPhoto ? triggerFileInput : openCrop}
      >
        {usingDefaultPhoto ? 'Prendre une photo' : 'Modifier'}
      </Button>
    </>
  )
}

const PhotoPreview = ({ photoURL, handleDeletePhoto }) => {
  if (!photoURL) return null

  return (
    <div style={{ position: 'relative', width: '150px', height: 'auto' }}>
      <Image
        src={photoURL}
        alt="Cropped"
        thumbnail
        style={{ width: '100%', height: 'auto' }}
      />
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-top">Effacer la photo</Tooltip>}
      >
        <Trash
          color="gray"
          size={24}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            backgroundColor: 'white',
            borderRadius: '50%',
            padding: '2px',
          }}
          onClick={handleDeletePhoto}
        />
      </OverlayTrigger>
    </div>
  )
}

export default PhotoCapture
