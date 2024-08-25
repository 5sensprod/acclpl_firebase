import React, { useState, useEffect, useContext } from 'react'
import LeafletMapView from './LeafletMapView'
import { UserContext } from '../../context/userContext'
import defaultPhoto from '../../assets/images/defaultPhoto.jpg'
import db from '../../db/db'
import { formatDate } from '../../utils/dateUtils'

const MapView = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])
  const [searchTerm, setSearchTerm] = useState('') // État pour gérer le texte de recherche

  useEffect(() => {
    const fetchObservationsFromIndexedDB = async () => {
      if (currentUser?.uid) {
        try {
          // Récupérer les observations de l'utilisateur depuis IndexedDB
          const userObservations = await db.observations
            .where('userID')
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

  // Filtrer les observations en fonction du texte de recherche
  const filteredObservations = observations.filter((obs) => {
    const companyName = obs.establishment?.establishmentName || 'Inconnu'
    return companyName.toLowerCase().includes(searchTerm.toLowerCase())
  })

  const markersData = filteredObservations
    .map((obs) => {
      const coords = obs.establishment?.coordinates
      return {
        markerCoords: coords ? [coords.latitude, coords.longitude] : null,
        companyName: obs.establishment?.establishmentName || 'Inconnu',
        imageURL:
          obs.photoURLs && obs.photoURLs.length > 0
            ? obs.photoURLs[0]
            : defaultPhoto,
        isLastObservation: obs === lastObservation,
        observationDateTimes: observations
          .filter((o) => o.establishmentRef === obs.establishmentRef)
          .map((o) => ({
            date: formatDate(o.date), // Formatage de la date
            time: o.time, // Ajout de l'heure brute (vous pouvez la formater ici si besoin)
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
      <input
        type="text"
        placeholder="Rechercher par nom d'entreprise"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Met à jour l'état avec le texte de recherche
        style={{ marginBottom: '10px', padding: '5px', width: '250px' }}
      />
      <LeafletMapView
        center={[48.9562, 4.3631]}
        zoom={14}
        markersData={markersData}
      />
    </div>
  )
}

export default MapView
