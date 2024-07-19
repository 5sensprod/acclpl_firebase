import React, { useContext, useState, useEffect } from 'react'
import { Card } from 'react-bootstrap'
import { Envelope, Calendar3, Lock, Megaphone } from 'react-bootstrap-icons'
import { UserContext } from '../../../context/userContext'
import PasswordChangeModal from './PasswordChangeModal'
import EditableHeader from './EditableHeader'
import UserInfo from './UserInfo'
import { itemVariants } from '../../../animations/motionVariants'
import AnimatedDiv from '../../../animations/AnimatedDiv'
import db from '../../../db/db'

const ProfileView = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const { userProfile, setUserProfile, isPasswordSignIn } =
    useContext(UserContext)
  const [editMode, setEditMode] = useState(false)
  const [observationCount, setObservationCount] = useState(0)

  const togglePasswordModal = () => {
    setShowPasswordModal((prev) => !prev)
  }

  const handleCancel = () => {
    setEditMode(false)
  }

  useEffect(() => {
    const fetchObservationCount = async () => {
      if (userProfile?.userID) {
        try {
          const count = await db.observations
            .where('userID')
            .equals(userProfile.userID)
            .count()
          setObservationCount(count)
        } catch (error) {
          console.error('Failed to fetch observation count:', error)
        }
      }
    }

    fetchObservationCount()
  }, [userProfile])

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
        <AnimatedDiv variants={itemVariants} custom={3}>
          <UserInfo
            icon={Megaphone}
            label="Nombre d'éco-signalements "
            value={observationCount}
          />
        </AnimatedDiv>
        {isPasswordSignIn && (
          <AnimatedDiv variants={itemVariants} custom={4}>
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
