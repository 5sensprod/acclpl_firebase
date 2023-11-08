import React, { useState, useEffect, useContext } from 'react'
import LeafletMapView from './LeafletMapView'
import { UserContext } from '../../context/userContext'

const MapView = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])

  useEffect(() => {
    // Récupére les observations du localStorage
    const localData = localStorage.getItem(`observations-${currentUser.uid}`)
    if (localData) {
      setObservations(JSON.parse(localData))
    }
  }, [currentUser])

  // Crée une fonction pour extraire les données nécessaires des observations
  const markersData = observations.map((obs) => ({
    markerCoords: [
      obs.establishment.coordinates.latitude,
      obs.establishment.coordinates.longitude,
    ],
    companyName: obs.establishment.establishmentName,
    imageURL: obs.photoURLs[0],
  }))

  return (
    <div className="map-view">
      <p>Vue de la carte interactive.</p>
      <LeafletMapView
        center={[48.9562, 4.3631]}
        zoom={14}
        markersData={markersData}
      />
    </div>
  )
}

export default MapView
