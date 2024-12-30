// src/components/views/ReportingsView/hooks/useDeleteObservation.js
import { useState } from 'react'
import { deleteObservationFromFirestore } from '../../../../services/observationService'
import db from '../../../../db/db'

export const useDeleteObservation = (fetchObservationsFromIndexedDB) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [observationToDelete, setObservationToDelete] = useState(null)

  const handleDeleteClick = (observationId) => {
    setObservationToDelete(observationId)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteObservationFromFirestore(observationToDelete)
      await db.observations.delete(observationToDelete)
      await fetchObservationsFromIndexedDB()
      setShowDeleteModal(false)
      setObservationToDelete(null)
    } catch (error) {
      console.error('Failed to delete observation:', error)
    }
  }

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setObservationToDelete(null)
  }

  return {
    showDeleteModal,
    handleDeleteClick,
    handleConfirmDelete,
    handleCloseDeleteModal,
  }
}
