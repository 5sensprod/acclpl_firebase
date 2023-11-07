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
    setNewDisplayName(userProfile.displayName) // Réinitialisez le nom à la valeur actuelle en cas d'annulation
    setEditMode(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    // Fermez le formulaire de modification si le nouveau nom est identique à l'ancien ou si l'ID est manquant
    if (!userProfile?.docId || newDisplayName === userProfile.displayName) {
      setEditMode(false) // Sortir du mode édition et fermer le formulaire sans autre action
      return
    }

    // Si le code continue ici, cela signifie que le nom a changé et l'ID du document est présent
    try {
      await updateUserDisplayName(userProfile.docId, newDisplayName)
      setUserProfile({ ...userProfile, displayName: newDisplayName })
    } catch (error) {
      // Vous pouvez choisir de gérer l'erreur d'une manière qui ne soit pas visible par l'utilisateur,
      // par exemple, en envoyant l'erreur à un service de suivi des erreurs ou en la loguant silencieusement.
    }
    setEditMode(false) // Fermez le formulaire de modification après avoir tenté la mise à jour
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
        staggerChildren: 0.05, // Chaque enfant commencera son animation avec un délai de 0.1 seconde
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (custom) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1, // Custom est l'index et détermine le délai
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
      // Si le nom local est différent du nom dans le profil utilisateur et que l'ID du document existe
      if (userProfile?.docId && localDisplayName !== userProfile.displayName) {
        try {
          await updateUserDisplayName(userProfile.docId, localDisplayName)
          setUserProfile({ ...userProfile, displayName: localDisplayName }) // Mettez à jour l'état global après confirmation
        } catch (error) {
          // Gérer l'erreur d'une manière non intrusive pour l'utilisateur
        }
      }
      setEditMode(false) // Sortir du mode d'édition quelle que soit l'issue
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
                  value={localDisplayName} // La valeur de l'input est contrôlée par l'état local
                  onChange={(e) => setLocalDisplayName(e.target.value)} // Mettez à jour l'état local lorsque l'input change
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
                custom={0} // Index personnalisé pour le délai
              >
                <PersonCircle size={24} />
              </motion.div>
              <motion.span
                initial="hidden"
                animate="visible"
                variants={childVariants}
                custom={1} // Index personnalisé pour le délai
              >
                {userProfile.displayName}
              </motion.span>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={childVariants}
                custom={2} // Index personnalisé pour le délai
              >
                <Pencil
                  className="me-0"
                  size={20}
                  onClick={handleEdit}
                  style={{ cursor: 'pointer', marginLeft: '10px' }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    )
  }

  const UserInfo = ({ icon: Icon, label, value }) => (
    <div className="d-flex align-items-center py-2">
      <Icon size={24} className="me-2" />
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
