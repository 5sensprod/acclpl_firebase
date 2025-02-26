// useObservations.js
import { useState, useCallback, useContext } from 'react'
import { UserContext } from '../../../../context/userContext'
import { getObservationsForUser } from '../../../../services/observationService'
import { getEstablishmentByRef } from '../../../../services/establishmentService'
import defaultPhoto from '../../../../assets/images/defaultPhoto.jpg'

export const useObservations = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])

  const fetchObservationsFromIndexedDB = useCallback(async () => {
    if (!currentUser?.uid) return
    try {
      const userObservations = await getObservationsForUser(currentUser.uid)

      userObservations.sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`),
      )

      const enrichedObservations = await Promise.all(
        userObservations.map(async (observation) => {
          const enriched = {
            ...observation,
            establishment:
              (await getEstablishmentByRef(observation.establishmentRef)) || {},
            photoURLs:
              observation.photoURLs?.length > 0
                ? observation.photoURLs
                : [defaultPhoto],
            observationTypes: observation.observationTypes || [], // S'assurer que observationTypes est toujours un tableau
          }

          return enriched
        }),
      )

      setObservations(enrichedObservations)
    } catch (error) {
      console.error('Failed to fetch observations:', error)
    }
  }, [currentUser])

  return {
    observations,
    fetchObservationsFromIndexedDB,
  }
}
