// src/components/views/ReportingsView/hooks/useObservations.js
import { useState, useCallback, useContext } from 'react'
import { UserContext } from '../../../../context/userContext'
import db from '../../../../db/db'
import defaultPhoto from '../../../../assets/images/defaultPhoto.jpg'

export const useObservations = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])

  const fetchObservationsFromIndexedDB = useCallback(async () => {
    if (currentUser?.uid) {
      try {
        const userObservations = await db.observations
          .where('userID')
          .equals(currentUser.uid)
          .toArray()

        userObservations.sort(
          (a, b) =>
            new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`),
        )

        const enrichedObservations = await Promise.all(
          userObservations.map(async (observation) => {
            const establishment = await db.establishments.get(
              observation.establishmentRef,
            )
            return {
              ...observation,
              establishment: establishment || {},
              photoURLs:
                observation.photoURLs && observation.photoURLs.length > 0
                  ? observation.photoURLs
                  : [defaultPhoto],
            }
          }),
        )

        setObservations(enrichedObservations)
      } catch (error) {
        console.error('Failed to fetch observations from IndexedDB:', error)
      }
    }
  }, [currentUser])

  return {
    observations,
    fetchObservationsFromIndexedDB,
  }
}
