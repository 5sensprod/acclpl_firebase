import React from 'react'
import BaseModal from './BaseModal'

const DeleteModal = ({ show, handleClose, handleConfirm }) => (
  <BaseModal
    show={show}
    onHide={handleClose}
    title="Confirmation de suppression"
    buttons={[
      {
        text: 'Annuler',
        onClick: handleClose,
        variant: 'secondary',
      },
      {
        text: 'Supprimer',
        onClick: handleConfirm,
        variant: 'danger',
      },
    ]}
  >
    Êtes-vous sûr de vouloir supprimer ce signalement ? Cette action est
    irréversible.
  </BaseModal>
)

export default DeleteModal
