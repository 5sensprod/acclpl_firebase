import React from 'react'
import { Figure, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { Trash, Camera, Pencil } from 'react-bootstrap-icons'
import styles from './PhotoCapture.module.css'
import { useFormWizardState } from '../wizard/FormWizardContext'

const PhotoPreview = () => {
  const { state: formWizardState, dispatch } = useFormWizardState()
  const { photoURL, isDefaultPhoto } = formWizardState

  if (!photoURL) return null

  return (
    <Figure
      className={styles.figureStyle}
      onClick={() => document.getElementById('photo-input').click()}
    >
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id="tooltip-change">Change la photo</Tooltip>}
      >
        <span>
          <Figure.Image
            src={photoURL}
            alt=""
            thumbnail
            className={styles.figureImage}
          />
        </span>
      </OverlayTrigger>
      <Figure.Caption className={styles.captionStyle}>
        {isDefaultPhoto ? (
          <Camera className={styles.icon} />
        ) : (
          <>
            <Pencil
              className={styles.icon}
              onClick={(e) => {
                e.stopPropagation()
                dispatch({
                  type: 'SET_TEMP_PHOTO',
                  payload: {
                    photoURL: formWizardState.photoURL,
                    selectedFile: null,
                    croppedImageUrl: null,
                  },
                })
                dispatch({
                  type: 'OPEN_CROP',
                })
              }}
            />
            <Trash
              className={styles.icon}
              onClick={(e) => {
                e.stopPropagation()
                dispatch({
                  type: 'RESET_TO_DEFAULT_PHOTO',
                })
              }}
            />
          </>
        )}
      </Figure.Caption>
    </Figure>
  )
}

export default PhotoPreview
