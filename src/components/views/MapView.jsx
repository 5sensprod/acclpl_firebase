import React, { useState, useEffect, useContext } from 'react'
import LeafletMapView from './LeafletMapView'
import { UserContext } from '../../context/userContext'
import defaultPhoto from '../../assets/images/defaultPhoto.jpg'
import db from '../../db/db'
import { formatDate } from '../../utils/dateUtils'

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

          // Trier les observations par date et heure du plus récent au plus ancien
          userObservations.sort(
            (a, b) =>
              new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`),
          )

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

  // Identifier le dernier signalement
  const lastObservation = observations.length > 0 ? observations[0] : null

  const markersData = observations
    .map((obs) => {
      const coords = obs.establishment?.coordinates
      return {
        markerCoords: coords ? [coords.latitude, coords.longitude] : null,
        companyName: obs.establishment?.establishmentName || 'Inconnu',
        isLastObservation: obs === lastObservation,
        observationDateTimes: observations
          .filter((o) => o.establishmentRef === obs.establishmentRef)
          .map((o) => ({
            date: formatDate(o.date),
            time: o.time,
            photoURLs:
              o.photoURLs && o.photoURLs.length > 0
                ? o.photoURLs
                : [defaultPhoto], // Inclure les images pour chaque observation
          })),
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
