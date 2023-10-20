import React, { useState } from 'react'
import cat from './cat.gif'
import LeafletMap from '../../../components/LeafletMap'
import ObservationEntryForm from '../../../components/ObservationEntryForm'

export default function PrivateHome() {
  const [markerCoords, setMarkerCoords] = useState(null)
  const [companyName, setCompanyName] = useState('')
  const [validatedImage, setValidatedImage] = useState(null)

  return (
    <div className="container p-3">
      <h1 className="display-5 text-light mb-4">
        Éco-veille: Lumière inutiles
      </h1>
      <ObservationEntryForm
        currentCoords={markerCoords}
        onImageValidate={setValidatedImage}
        onSelectImage={setValidatedImage} // ajoutez cette ligne
        onSelectAddress={({ coordinates, companyName: name }) => {
          setMarkerCoords(coordinates)
          setCompanyName(name)
        }}
      />
      <LeafletMap
        markerCoords={markerCoords}
        companyName={companyName}
        imageURL={validatedImage}
      />
      <img src={cat} alt="cat" className="mt-4" />
    </div>
  )
}
