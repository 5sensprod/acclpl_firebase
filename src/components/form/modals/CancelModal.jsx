import React from 'react'
import BaseModal from './BaseModal'

const CancelModal = ({ show, handleClose, handleConfirm }) => (
  <BaseModal
    show={show}
    onHide={handleClose}
    title="Confirmation d'annulation"
    buttons={[
      {
        text: 'Revenir',
        onClick: handleClose,
        variant: 'secondary',
      },
      {
        text: "Confirmer l'annulation",
        onClick: handleConfirm,
        variant: 'danger',
      },
    ]}
  >
    Êtes-vous sûr de vouloir annuler ce signalement ? Toutes les données saisies
    seront perdues.
  </BaseModal>
)
export default CancelModal
