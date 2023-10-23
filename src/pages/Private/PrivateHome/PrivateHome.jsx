import React, { useState } from 'react'
import LeafletMap from '../../../components/LeafletMap'
import ObservationEntryForm from '../../../components/ObservationEntryForm'
import formatCompanyName from '../../../utils/formatCompanyName'

export default function PrivateHome() {
  const [markerCoords, setMarkerCoords] = useState(null)
  const [validatedImage, setValidatedImage] = useState(null)
  const [normalizedCompanyName, setNormalizedCompanyName] = useState('')

  return (
    <div className="container p-3">
      <h1 className="display-5 text-light mb-4">
        Éco-veille: Lumière inutiles
      </h1>
      <ObservationEntryForm
        currentCoords={markerCoords}
        onImageValidate={setValidatedImage}
        onSelectImage={setValidatedImage}
        onSelectAddress={({ coordinates, companyName: name }) => {
          setMarkerCoords(coordinates)
          const formatted = formatCompanyName(name) // Formattez le nom de l'entreprise ici.
          setNormalizedCompanyName(formatted) // Mettez à jour l'état avec le nom d'entreprise formaté.
        }}
      />
      <LeafletMap
        markerCoords={markerCoords}
        normalizedCompanyName={normalizedCompanyName} // Remplacez companyName par normalizedCompanyName ici.
        imageURL={validatedImage}
      />
    </div>
  )
}
