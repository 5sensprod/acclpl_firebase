import React, { useState } from 'react'
import { Figure, OverlayTrigger, Tooltip, Spinner } from 'react-bootstrap'
import { Trash, Camera, Pencil } from 'react-bootstrap-icons'
import styles from './PhotoCapture.module.css'
import { useFormWizardState } from '../context/FormWizardContext'

const PhotoPreview = () => {
  const {
    state: { photoURL, originalPhotoURL, isDefaultPhoto, isOccurrence },
    dispatch,
  } = useFormWizardState()

  const [isImageLoading, setImageLoading] = useState(true)

  if (!photoURL) return null

  const handleEditClick = (e) => {
    e.stopPropagation()
    dispatch({
      type: 'SET_TEMP_PHOTO',
      payload: {
        photoURL: originalPhotoURL || photoURL,
        selectedFile: null,
        croppedImageUrl: null,
      },
    })
    dispatch({ type: 'OPEN_CROP' })
  }

  const handleTrashClick = (e) => {
    e.stopPropagation()
    dispatch({ type: 'RESET_TO_DEFAULT_PHOTO' })
  }

  const icons =
    isDefaultPhoto || isOccurrence ? (
      <Camera
        className={styles.icon}
        onClick={() => document.getElementById('photo-input').click()}
      />
    ) : (
      <>
        <Pencil className={styles.icon} onClick={handleEditClick} />
        <Trash className={styles.icon} onClick={handleTrashClick} />
      </>
    )

  return (
    <Figure className={styles.figureStyle}>
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-change">Change la photo</Tooltip>}
      >
        <span>
          <div className={styles.imageLoaderContainer}>
            {isImageLoading && (
              <Spinner
                animation="border"
                role="status"
                className={styles.spinner}
              >
                <span className="visually-hidden">Chargement...</span>
              </Spinner>
            )}
            <Figure.Image
              src={photoURL}
              alt="Aperçu de la photo"
              thumbnail
              className={styles.figureImage}
              onClick={() => document.getElementById('photo-input').click()}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
              style={{
                width: '150px',
                height: '150px',
                display: isImageLoading ? 'none' : 'block',
              }}
            />
          </div>
        </span>
      </OverlayTrigger>
      <Figure.Caption className={styles.captionStyle}>{icons}</Figure.Caption>
    </Figure>
  )
}

export default PhotoPreview
