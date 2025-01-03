// src/components/views/ReportingsView/hooks/useEstablishments.js
import { useState } from 'react'
import { getEstablishmentByRef } from '../../../../services/establishmentService'

export const useEstablishments = (observations, dispatch, setShowAddModal) => {
  // Ajout de setShowAddModal
  const [establishmentName, setEstablishmentName] = useState('')

  const handleOpenAddModal = async (establishmentId) => {
    try {
      const est = await getEstablishmentByRef(establishmentId)
      if (est) {
        setEstablishmentName(est.establishmentName)
        dispatch({
          type: 'UPDATE_COMPANY_NAME_MODAL',
          payload: {
            companyName: est.establishmentName,
            normalizedCompanyName: est.normalizedEstablishmentName,
          },
        })
        dispatch({
          type: 'UPDATE_COMPANY_ADDRESS',
          payload: est.address,
        })
        dispatch({
          type: 'SET_COMPANY_COORDINATES',
          payload: [est.coordinates.latitude, est.coordinates.longitude],
        })
        dispatch({
          type: 'SET_ESTABLISHMENT_EXISTS',
          payload: true,
        })
        dispatch({
          type: 'SET_CURRENT_ESTABLISHMENT_ID',
          payload: establishmentId,
        })
      } else {
        setEstablishmentName('Inconnu')
        dispatch({ type: 'RESET_COMPANY_ADDRESS' })
        dispatch({ type: 'RESET_COMPANY_NAME_MODAL' })
        dispatch({
          type: 'SET_ESTABLISHMENT_EXISTS',
          payload: false,
        })
        dispatch({ type: 'SET_CURRENT_ESTABLISHMENT_ID', payload: null })
      }
      setShowAddModal(true) // Ajout de cette ligne
    } catch (error) {
      console.error('Error fetching establishment:', error)
    }
  }

  return {
    establishmentName,
    handleOpenAddModal,
  }
}
