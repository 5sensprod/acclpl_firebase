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
import Table from 'react-bootstrap/Table'
const MapView = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])

  useEffect(() => {
    if (currentUser?.uid) {
      console.log('Fetching observations for user ID:', currentUser.uid)
      const fetchObservations = async () => {
        try {
          const obs = await getObservationsForUser(currentUser.uid)
          console.log('Observations fetched:', obs)
          if (obs.length > 0) {
            // Log additional details if needed
            obs.forEach((o) => {
              console.log(
                `Observation ID: ${o.id}, Establishment ID: ${o.establishment?.id}, Street ID: ${o.street?.id}`,
              )
            })
          }
          setObservations(obs)
        } catch (error) {
          console.error('Failed to fetch observations for user:', error)
        }
      }

      fetchObservations()
    }
  }, [currentUser])

  return (
    <div className="reporting-view text-light">
      <h2 className="text-light">Observations des Lumières Allumées</h2>
      {observations.length > 0 ? (
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Date</th>
              <th>Heure</th>
              <th>Entreprise</th>
              <th>Adresse</th>
              <th>Notes supplémentaires</th>
              <th>Photos</th>
            </tr>
          </thead>
          <tbody>
            {observations.map((obs) => (
              <tr key={obs.id}>
                <td>{obs.date}</td>
                <td>{obs.time}</td>
                <td>{obs.establishment.establishmentName}</td>
                <td>{`${obs.street.streetName}, ${obs.street.city}, ${obs.street.postalCode}`}</td>
                <td>{obs.additionalNotes}</td>
                <td>
                  {obs.photoURLs.map((url, index) => (
                    <div key={index} className="mb-2">
                      <img
                        src={url}
                        alt={`Observation ${index + 1}`}
                        className="img-fluid"
                        style={{ maxWidth: '100px' }}
                      />
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>Aucune observation trouvée pour cet utilisateur.</p>
      )}
    </div>
  )
}

export default MapView
