import React, { useState } from 'react'
import cat from './cat.gif'
import LeafletMap from '../../../components/LeafletMap'
import GeocodeForm from '../../../components/GeocodeForm'

export default function PrivateHome() {
  const [markerCoords, setMarkerCoords] = useState(null)
  const [companyName, setCompanyName] = useState('')

  return (
    <div className="container p-3">
      <h1 className="display-5 text-light mb-4">
        Éco-veille: Lumière inutiles
      </h1>
      <GeocodeForm
        currentCoords={markerCoords}
        onSelectAddress={({ coordinates, companyName: name }) => {
          setMarkerCoords(coordinates)
          setCompanyName(name)
        }}
      />
      <LeafletMap markerCoords={markerCoords} companyName={companyName} />
      <img src={cat} alt="cat" className="mt-4" />
    </div>
  )
}
