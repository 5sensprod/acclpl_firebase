// SuccessModal.jsx
import React from 'react'
import BaseModal from './BaseModal'

const SuccessModal = ({ show, handleClose }) => (
  <BaseModal
    show={show}
    onHide={handleClose}
    title="Confirmation"
    buttons={[
      {
        text: 'Fermer',
        onClick: handleClose,
        variant: 'secondary',
      },
    ]}
  >
    Votre signalement a bien été pris en compte ! Merci
  </BaseModal>
)

export default SuccessModal
