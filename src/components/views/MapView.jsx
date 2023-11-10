import React, { useState, useEffect, useContext } from 'react'
import LeafletMapView from './LeafletMapView'
import { UserContext } from '../../context/userContext'
// import { getObservationsForUser } from '../../services/observationService'
// import { getEstablishmentByRef } from '../../services/establishmentService'
import defaultPhoto from '../../assets/images/defaultPhoto.jpg'
import db from '../../db/db'

const MapView = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])

  useEffect(() => {
    const fetchObservationsFromIndexedDB = async () => {
      if (currentUser?.uid) {
        try {
          // Récupérer les observations de l'utilisateur depuis IndexedDB
          const userObservations = await db.observations
            .where('userID') // Assure-toi que la casse est correcte, basée sur ton schéma IndexedDB
            .equals(currentUser.uid)
            .toArray()

          // Enrichir les observations avec les détails des établissements
          const enrichedObservations = await Promise.all(
            userObservations.map(async (observation) => {
              const establishment = await db.establishments.get(
                observation.establishmentRef,
              )
              return {
                ...observation,
                establishment: establishment || {},
              }
            }),
          )

          setObservations(enrichedObservations)
        } catch (error) {
          console.error('Failed to fetch observations from IndexedDB:', error)
        }
      }
    }

    fetchObservationsFromIndexedDB()
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
