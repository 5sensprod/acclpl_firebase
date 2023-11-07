// import React from 'react'

// const MapView = () => {
//   return (
//     <div className="map-view">
//       <p>Vue de la carte interactive.</p>
//     </div>
//   )
// }

// export default MapView

import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context/userContext'
import { getObservationsForUser } from '../../services/observationService'

const MapView = () => {
  const { currentUser } = useContext(UserContext) // Supposons que currentUser contient l'ID de l'utilisateur actuel
  const [observations, setObservations] = useState([])

  useEffect(() => {
    if (currentUser?.uid) {
      console.log('Fetching observations for user ID:', currentUser.uid) // Log de débogage
      const fetchObservations = async () => {
        try {
          const obs = await getObservationsForUser(currentUser.uid)
          console.log('Observations fetched:', obs) // Log des observations récupérées
          setObservations(obs)
        } catch (error) {
          console.error('Failed to fetch observations for user:', error)
        }
      }

      fetchObservations()
    }
  }, [currentUser])

  return (
    <div className="reporting-view">
      <p>Vue des observations par utilisateur.</p>
      {observations.length > 0 ? (
        observations.map((obs) => (
          <div key={obs.id}>
            <p>Date: {obs.date}</p>
            <p>Heure: {obs.time}</p>
            {/* Autres détails de l'observation */}
          </div>
        ))
      ) : (
        <p>Aucune observation trouvée pour cet utilisateur.</p>
      )}
    </div>
  )
}

export default MapView
