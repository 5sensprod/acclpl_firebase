import React, { useState } from 'react' // Ajoutez useEffect
import LeafletMap from '../../../components/LeafletMap'
import ObservationEntryForm from '../../../components/ObservationEntryForm'
import formatCompanyName from '../../../utils/formatCompanyName'
import useMapVisualization from '../../../hooks/useMapVisualization'

export default function PrivateHome() {
  const [markerCoords, setMarkerCoords] = useState(null)
  const [validatedImage, setValidatedImage] = useState(null)
  const [normalizedCompanyName, setNormalizedCompanyName] = useState('')

  const { showMap, handleVisualizeClick } = useMapVisualization()

  return (
    <div className="container p-3">
      <h1 className="display-5 text-light mb-4">
        Éco-veille: Lumière inutiles
      </h1>
      <ObservationEntryForm
        currentCoords={markerCoords}
        onImageValidate={(image) => {
          console.log('Image validée reçue: ', image)
          setValidatedImage(image)
        }}
        onVisualizeClick={handleVisualizeClick}
        onSelectImage={(image) => {
          console.log('Image sélectionnée reçue: ', image)
          setValidatedImage(image)
        }}
        onSelectAddress={(coordinates) => {
          console.log('Coordonnées reçues dans onSelectAddress: ', coordinates)
          setMarkerCoords((prevCoords) => {
            console.log(
              'Mise à jour des markerCoords de',
              prevCoords,
              'à',
              coordinates,
            )
            return coordinates
          })
        }}
        onSelectCompanyName={(name) => {
          console.log("Nom d'entreprise reçu dans onSelectCompanyName: ", name)
          const formatted = formatCompanyName(name)
          setNormalizedCompanyName((prevName) => {
            console.log(
              'Mise à jour de normalizedCompanyName de',
              prevName,
              'à',
              formatted,
            )
            return formatted
          })
        }}
      />
      {showMap && (
        <LeafletMap
          markerCoords={markerCoords}
          normalizedCompanyName={normalizedCompanyName}
          imageURL={validatedImage}
        />
      )}
    </div>
  )
}
