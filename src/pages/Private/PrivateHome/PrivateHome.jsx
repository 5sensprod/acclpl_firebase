import React, { useState, useEffect } from 'react' // Ajoutez useEffect
import LeafletMap from '../../../components/LeafletMap'
import ObservationEntryForm from '../../../components/ObservationEntryForm'
import formatCompanyName from '../../../utils/formatCompanyName'

export default function PrivateHome() {
  const [markerCoords, setMarkerCoords] = useState(null)
  const [validatedImage, setValidatedImage] = useState(null)
  const [normalizedCompanyName, setNormalizedCompanyName] = useState('')

  // Utilisez useEffect pour afficher les modifications des états
  useEffect(() => {
    console.log('Coordonnées mises à jour: ', markerCoords)
  }, [markerCoords])

  useEffect(() => {
    console.log(
      "Nom d'entreprise normalisé mis à jour: ",
      normalizedCompanyName,
    )
  }, [normalizedCompanyName])

  return (
    <div className="container p-3">
      <h1 className="display-5 text-light mb-4">
        Éco-veille: Lumière inutiles
      </h1>
      <ObservationEntryForm
        currentCoords={markerCoords}
        onImageValidate={setValidatedImage}
        onSelectImage={setValidatedImage}
        onSelectAddress={(coordinates) => {
          console.log('Coordonnées reçues dans onSelectAddress: ', coordinates)
          setMarkerCoords(coordinates)
        }}
        onSelectCompanyName={(name) => {
          console.log("Nom d'entreprise reçu dans onSelectCompanyName: ", name)
          const formatted = formatCompanyName(name) // Formattez le nom de l'entreprise ici.
          setNormalizedCompanyName(formatted) // Mettez à jour l'état avec le nom d'entreprise formaté.
        }}
      />
      <LeafletMap
        markerCoords={markerCoords}
        normalizedCompanyName={normalizedCompanyName}
        imageURL={validatedImage}
      />
    </div>
  )
}
