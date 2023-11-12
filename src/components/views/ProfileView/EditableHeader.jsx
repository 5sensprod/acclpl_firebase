import React, { useState } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { updateUserDisplayName } from '../../../services/userService'
import { PersonCircle, Pencil } from 'react-bootstrap-icons'
import { useAlert } from '../../../context/AlertContext'
import { variants } from '../../../animations/motionVariants'

const EditableHeader = ({
  editMode,
  userProfile,
  handleCancel,
  setEditMode,
  setUserProfile,
}) => {
  const [localDisplayName, setLocalDisplayName] = useState(
    userProfile.displayName,
  )
  const { showAlert } = useAlert()

  const handleLocalSubmit = async (event) => {
    event.preventDefault()
    try {
      await updateUserDisplayName(userProfile.userID, localDisplayName)
      setUserProfile({ ...userProfile, displayName: localDisplayName })
    } catch (error) {
      showAlert('Une erreur est survenue. Veuillez réessayer plus tard.')
    }
    setEditMode(false)
  }

  return editMode ? (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      transition={{ duration: 0.2 }}
      key="editMode"
    >
      <InputGroup>
        <Form.Control
          style={{ height: '40px' }}
          autoFocus
          className="me-0"
          value={localDisplayName}
          onChange={(e) => setLocalDisplayName(e.target.value)}
        />
        <Button variant="secondary" onClick={handleLocalSubmit}>
          Ok
        </Button>
        <Button variant="dark" onClick={handleCancel}>
          Annuler
        </Button>
      </InputGroup>
    </motion.div>
  ) : (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants}
      className="d-flex justify-content-between w-100 align-items-center py-1"
      style={{ height: '40px' }}
    >
      <div className="bg-primary rounded p-1">
        <PersonCircle size={24} />
      </div>
      <span>{userProfile.displayName}</span>
      <Button
        variant="secondary"
        className="py-1 px-2 text-d-flex justify-content-center"
        onClick={() => setEditMode(true)}
      >
        <Pencil
          className="ms-0 text-start"
          size={18}
          style={{ cursor: 'pointer', marginLeft: '10px' }}
        />
      </Button>
    </motion.div>
  )
}

export default EditableHeader
