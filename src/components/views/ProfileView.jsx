import React, { useContext, useState, useEffect } from 'react'
import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import {
  PersonCircle,
  Envelope,
  Calendar3,
  Pencil,
  Lock,
} from 'react-bootstrap-icons'
import { UserContext } from '../../context/userContext'
import { updateUserDisplayName } from '../../services/userService'
import PasswordChangeModal from './PasswordChangeModal'
import { AnimatePresence, motion } from 'framer-motion'

const ProfileView = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const { userProfile, setUserProfile, isPasswordSignIn } =
    useContext(UserContext)
  const [editMode, setEditMode] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState(
    userProfile?.displayName || '',
  )

  const handleShowPasswordModal = () => setShowPasswordModal(true)
  const handleClosePasswordModal = () => setShowPasswordModal(false)

  useContext(UserContext)

  const handleEdit = () => {
    setNewDisplayName(userProfile.displayName)
    setEditMode(true)
  }

  useEffect(() => {
    if (userProfile) {
      setNewDisplayName(userProfile.displayName)
    }
  }, [userProfile])

  const handleCancel = () => {
    setNewDisplayName(userProfile.displayName)
    setEditMode(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!userProfile?.userID || newDisplayName === userProfile.displayName) {
      setEditMode(false)
      return
    }

    try {
      await updateUserDisplayName(userProfile.userID, newDisplayName)
      setUserProfile({ ...userProfile, displayName: newDisplayName })
    } catch (error) {
      // Gérer l'erreur
    }
    setEditMode(false)
  }

  const itemVariants = {
    hidden: { x: -40 },
    visible: (index) => ({
      x: 0,
      transition: {
        delay: 0 + index * 0.02,
      },
    }),
  }

  const variants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0 },
  }
  const parentVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.15,
      },
    }),
  }

  const EditableHeader = ({
    editMode,
    userProfile,
    handleCancel,
    handleEdit,
  }) => {
    const [localDisplayName, setLocalDisplayName] = useState(
      userProfile.displayName,
    )

    const handleLocalSubmit = async (event) => {
      event.preventDefault()
      if (userProfile?.userID && localDisplayName !== userProfile.displayName) {
        try {
          await updateUserDisplayName(userProfile.userID, localDisplayName)
          setUserProfile({ ...userProfile, displayName: localDisplayName })
        } catch (error) {
          // Gérer l'erreur
        }
      }
      setEditMode(false)
    }

    return (
      <>
        <AnimatePresence>
          {editMode ? (
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
              variants={parentVariants}
              className="d-flex justify-content-between w-100 align-items-center py-1"
              style={{ height: '40px' }}
            >
              <motion.div
                initial="hidden"
                animate="visible"
                variants={childVariants}
                custom={0}
              >
                <div className="bg-primary rounded p-1">
                  <PersonCircle size={24} />
                </div>
              </motion.div>
              <motion.span
                initial="hidden"
                animate="visible"
                variants={childVariants}
                custom={1}
              >
                {userProfile.displayName}
              </motion.span>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={childVariants}
                custom={2}
              >
                <Button
                  variant="secondary"
                  className="py-1 px-2 text-d-flex justify-content-center"
                  onClick={handleEdit}
                >
                  <Pencil
                    className="ms-0 text-start"
                    size={18}
                    style={{ cursor: 'pointer', marginLeft: '10px' }}
                  />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  const UserInfo = ({ icon: Icon, label, value }) => (
    <div className="d-flex align-items-center py-2">
      <Icon size={28} className="me-2 bg-primary rounded p-1" />
      {label}: {value}
    </div>
  )

  return (
    <Card
      className="bg-dark text-light shadow mt-5"
      style={{ maxWidth: '30rem', margin: 'auto' }}
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        custom={0}
      >
        <Card.Header
          as="h5"
          className="d-flex justify-content-between align-items-center mb-5"
        >
          <EditableHeader
            editMode={editMode}
            newDisplayName={newDisplayName}
            setNewDisplayName={setNewDisplayName}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            userProfile={userProfile}
            handleEdit={handleEdit}
          />
        </Card.Header>
      </motion.div>
      <Card.Body>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          custom={1}
        >
          <UserInfo icon={Envelope} label="Email" value={userProfile.email} />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          custom={2}
        >
          <UserInfo
            icon={Calendar3}
            label="Date d'inscription"
            value={new Date(userProfile.joinedDate).toLocaleDateString('fr-FR')}
          />
        </motion.div>
        {isPasswordSignIn && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={itemVariants}
            custom={3}
          >
            <div
              className="d-flex align-items-center py-2"
              onClick={handleShowPasswordModal}
              style={{ cursor: 'pointer' }}
            >
              <Lock size={24} className="me-2" />
              Changer mon mot de passe
            </div>
            <PasswordChangeModal
              showModal={showPasswordModal}
              handleClose={handleClosePasswordModal}
            />
          </motion.div>
        )}
      </Card.Body>
    </Card>
  )
}

export default ProfileView
