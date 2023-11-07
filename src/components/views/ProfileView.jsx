import React, { useContext, useState, useEffect } from 'react'
import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import {
  PersonCircle,
  Envelope,
  Calendar3,
  Pencil,
} from 'react-bootstrap-icons'
import { UserContext } from '../../context/userContext'
import { updateUserDisplayName } from '../../services/userService'
import { motion } from 'framer-motion'

const ProfileView = () => {
  const { userProfile, setUserProfile } = useContext(UserContext)
  const [editMode, setEditMode] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState(
    userProfile?.displayName || '',
  )

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
    if (userProfile?.docId && newDisplayName !== userProfile.displayName) {
      try {
        await updateUserDisplayName(userProfile.docId, newDisplayName)
        setUserProfile({ ...userProfile, displayName: newDisplayName })
        setEditMode(false)
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du nom d'affichage :",
          error,
        )
      }
    } else {
      console.error(
        "Erreur : l'ID du document Firestore est manquant ou le nom d'affichage n'a pas changé.",
      )
    }
  }
  const headerVariants = {
    hidden: { x: -20 },
    visible: {
      x: 0,
      transition: {
        delay: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -20 },
    visible: (index) => ({
      x: 0,
      transition: {
        delay: 0.1 + index * 0.1,
      },
    }),
  }

  const EditableHeader = ({
    editMode,
    newDisplayName,
    setNewDisplayName,
    handleSubmit,
    handleCancel,
    userProfile,
    handleEdit,
  }) => {
    return editMode ? (
      <InputGroup>
        <Form.Control
          autoFocus
          className="me-0"
          value={newDisplayName}
          onChange={(e) => setNewDisplayName(e.target.value)}
        />
        <Button variant="success" onClick={handleSubmit}>
          Ok
        </Button>
        <Button variant="outline-secondary" onClick={handleCancel}>
          Annuler
        </Button>
      </InputGroup>
    ) : (
      <>
        <PersonCircle size={24} />
        <span className="ms-0">{userProfile.displayName}</span>
        <Pencil
          size={20}
          onClick={handleEdit}
          style={{ cursor: 'pointer', marginLeft: '10px' }}
        />
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
      <motion.div initial="hidden" animate="visible" variants={headerVariants}>
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
          custom={0}
        >
          <UserInfo icon={Envelope} label="Email" value={userProfile.email} />
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          custom={1}
        >
          <UserInfo
            icon={Calendar3}
            label="Date d'inscription"
            value={new Date(userProfile.joinedDate).toLocaleDateString('fr-FR')}
          />
        </motion.div>
      </Card.Body>
    </Card>
  )
}

export default ProfileView
