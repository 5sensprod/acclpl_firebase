import React, { useState, useEffect, useContext } from 'react'
import LeafletMapView from './LeafletMapView'
import { UserContext } from '../../context/userContext'
import { getObservationsForUser } from '../../services/observationService'
import { getEstablishmentByRef } from '../../services/establishmentService'
import defaultPhoto from '../../assets/images/defaultPhoto.jpg'

const MapView = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])

  useEffect(() => {
    const fetchObservations = async () => {
      if (currentUser?.uid) {
        try {
          const obs = await getObservationsForUser(currentUser.uid)
          const enrichedObservations = await Promise.all(
            obs.map(async (observation) => {
              const establishmentDetails = await getEstablishmentByRef(
                observation.establishmentRef,
              )
              return { ...observation, establishment: establishmentDetails }
            }),
          )
          setObservations(enrichedObservations)
        } catch (error) {
          console.error('Failed to fetch observations:', error)
        }
      }
    }

    fetchObservations()
  }, [currentUser])

  const markersData = observations
    .map((obs) => {
      const coords = obs.establishment?.coordinates
      return {
        markerCoords: coords ? [coords.latitude, coords.longitude] : null,
        companyName: obs.establishment?.establishmentName || 'Inconnu',
        imageURL:
          obs.photoURLs && obs.photoURLs.length > 0
            ? obs.photoURLs[0]
            : defaultPhoto,
      }
    })
    .filter((marker) => marker.markerCoords)

  return (
    <div className="map-view text-light">
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
