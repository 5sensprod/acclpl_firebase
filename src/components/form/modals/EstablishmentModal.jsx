import React from 'react'
import BaseModal from './BaseModal'
import { useModal } from '../context/ModalContext'

const EstablishmentModal = () => {
  const { modalConfig, setModalConfig } = useModal()
  const handleClose = () => {
    setModalConfig((prevConfig) => ({ ...prevConfig, isVisible: false }))
  }

  return (
    <BaseModal
      show={modalConfig.isVisible}
      onHide={handleClose}
      title={modalConfig.title}
      buttons={modalConfig.buttons}
    >
      {modalConfig.body}
    </BaseModal>
  )
}

export default EstablishmentModal
