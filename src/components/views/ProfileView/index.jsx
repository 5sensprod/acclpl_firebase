import React, { useContext, useState } from 'react'
import { Card } from 'react-bootstrap'
import { Envelope, Calendar3, Lock } from 'react-bootstrap-icons'
import { UserContext } from '../../../context/userContext'
import PasswordChangeModal from './PasswordChangeModal'
import EditableHeader from './EditableHeader'
import UserInfo from './UserInfo'
import { itemVariants } from '../../../animations/motionVariants'
import AnimatedDiv from '../../../animations/AnimatedDiv'

const ProfileView = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const { userProfile, setUserProfile, isPasswordSignIn } =
    useContext(UserContext)
  const [editMode, setEditMode] = useState(false)

  const togglePasswordModal = () => {
    setShowPasswordModal((prev) => !prev)
  }

  const handleCancel = () => {
    setEditMode(false)
  }

  return (
    <Card
      className="bg-dark text-light shadow mt-5"
      style={{ maxWidth: '30rem', margin: 'auto' }}
    >
      <AnimatedDiv variants={itemVariants} custom={0}>
        <Card.Header
          as="h5"
          className="d-flex justify-content-between align-items-center mb-5"
        >
          <EditableHeader
            editMode={editMode}
            userProfile={userProfile}
            handleCancel={handleCancel}
            setEditMode={setEditMode}
            setUserProfile={setUserProfile}
          />
        </Card.Header>
      </AnimatedDiv>
      <Card.Body>
        <AnimatedDiv variants={itemVariants} custom={1}>
          <UserInfo icon={Envelope} label="Email" value={userProfile.email} />
        </AnimatedDiv>
        <AnimatedDiv variants={itemVariants} custom={2}>
          <UserInfo
            icon={Calendar3}
            label="Date d'inscription"
            value={new Date(userProfile.joinedDate).toLocaleDateString('fr-FR')}
          />
        </AnimatedDiv>
        {isPasswordSignIn && (
          <AnimatedDiv variants={itemVariants} custom={3}>
            <div
              className="d-flex align-items-center py-2"
              onClick={togglePasswordModal}
              style={{ cursor: 'pointer' }}
            >
              <Lock size={24} className="me-2" />
              Changer mon mot de passe
            </div>
            <PasswordChangeModal
              showModal={showPasswordModal}
              handleClose={togglePasswordModal}
            />
          </AnimatedDiv>
        )}
      </Card.Body>
    </Card>
  )
}

export default ProfileView
