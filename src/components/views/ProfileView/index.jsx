import React, { useContext, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Envelope, Calendar3, Lock } from 'react-bootstrap-icons'
import { UserContext } from '../../../context/userContext'
import PasswordChangeModal from '../PasswordChangeModal'
import { motion } from 'framer-motion'
import EditableHeader from './EditableHeader'
import UserInfo from './UserInfo'

const ProfileView = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const { userProfile, setUserProfile, isPasswordSignIn } =
    useContext(UserContext)
  const [editMode, setEditMode] = useState(false)

  const handleShowPasswordModal = () => setShowPasswordModal(true)
  const handleClosePasswordModal = () => setShowPasswordModal(false)

  // Plus besoin de useEffect pour mettre à jour newDisplayName, car c'est géré dans EditableHeader

  const handleCancel = () => {
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
            userProfile={userProfile}
            handleCancel={handleCancel}
            setEditMode={setEditMode} // Assurez-vous que ceci est passé correctement
            setUserProfile={setUserProfile}
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
