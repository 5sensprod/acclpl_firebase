// src/hooks/useAddObservationModal.js
import { useState } from 'react'

const useAddObservationModal = () => {
  const [showAddModal, setShowAddModal] = useState(false)

  const handleOpenAddModal = () => {
    setShowAddModal(true)
  }

  const handleCloseAddModal = () => {
    setShowAddModal(false)
  }

  return {
    showAddModal,
    handleOpenAddModal,
    handleCloseAddModal,
  }
}

export default useAddObservationModal
