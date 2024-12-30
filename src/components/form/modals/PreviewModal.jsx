import React from 'react'
import BaseModal from './BaseModal'
import LeafletMap from '../../LeafletMap'

const PreviewModal = ({
  show,
  onHide,
  formData,
  previewPhotoURL,
  isDefaultPhoto,
  photoURLs,
}) => {
  const imageURL = isDefaultPhoto ? previewPhotoURL : photoURLs[0]

  return (
    <BaseModal
      show={show}
      onHide={onHide}
      title="Prévisualisation"
      size="lg"
      buttons={[
        {
          text: 'Fermer',
          onClick: onHide,
          variant: 'secondary',
        },
      ]}
    >
      <LeafletMap
        markerCoords={formData.companyCoordinates}
        companyName={formData.companyName}
        imageURL={imageURL}
      />
    </BaseModal>
  )
}

export default PreviewModal
