import React from 'react'
import LeafletMap from '../../LeafletMap'

const PreviewMap = ({ markerCoords, normalizedCompanyName, imageURL }) => {
  return (
    <LeafletMap
      markerCoords={markerCoords}
      normalizedCompanyName={normalizedCompanyName}
      imageURL={imageURL}
    />
  )
}

export default PreviewMap
