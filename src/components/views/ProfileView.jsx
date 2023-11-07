import React, { useContext, useEffect, useState } from 'react'
import { Button, Card, Form, InputGroup } from 'react-bootstrap'
import {
  PersonCircle,
  Envelope,
  Calendar3,
  Pencil,
} from 'react-bootstrap-icons'
import { UserContext } from '../../context/userContext'
import { getUser, updateUserDisplayName } from '../../services/userService'
import { motion } from 'framer-motion'

const ProfileView = () => {
  const { currentUser } = useContext(UserContext)
  const [profileData, setProfileData] = useState({
    displayName: 'Profil',
    email: '',
    joinedDate: '',
  })
  const [editMode, setEditMode] = useState(false)
  const [newDisplayName, setNewDisplayName] = useState('')

  useEffect(() => {
    if (currentUser?.uid) {
      getUser(currentUser.uid)
        .then((userData) => {
          setProfileData({
            displayName: userData.displayName || 'Non spécifié',
            email: userData.email || 'Non spécifié',
            joinedDate: userData.joinedDate
              ? new Date(userData.joinedDate).toLocaleDateString('fr-FR')
              : 'Date inconnue',
            docId: userData.docId,
          })
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la récupération des données de l'utilisateur:",
            error,
          )
        })
    }
  }, [currentUser])

  const handleEdit = () => {
    setNewDisplayName(profileData.displayName)
    setEditMode(true)
  }

  const handleCancel = () => {
    setEditMode(false)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (profileData.docId) {
      try {
        await updateUserDisplayName(profileData.docId, newDisplayName)
        setProfileData((prevData) => ({
          ...prevData,
          displayName: newDisplayName,
        }))
        setEditMode(false)
      } catch (error) {
        console.error(
          "Erreur lors de la mise à jour du nom d'affichage :",
          error,
        )
      }
    } else {
      console.error("Erreur : l'ID du document Firestore est manquant.")
    }
  }

  const headerVariants = {
    hidden: { x: -20 },
    visible: {
      x: 0,
      transition: {
        delay: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { x: -20 },
    visible: (index) => ({
      x: 0,
      transition: {
        delay: 0.2 + index * 0.1,
      },
    }),
  }

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
          {editMode ? (
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
              <span className="ms-0">{profileData.displayName}</span>
              <Pencil
                size={20}
                onClick={handleEdit}
                style={{ cursor: 'pointer', marginLeft: '10px' }}
              />
            </>
          )}
        </Card.Header>
      </motion.div>
      <Card.Body>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          custom={0}
        >
          <div className="d-flex align-items-center  py-2">
            <Envelope size={24} className="me-2" />
            Email: {profileData.email}
          </div>
        </motion.div>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          custom={1}
        >
          <div className="d-flex align-items-center py-2">
            <Calendar3 size={24} className="me-2" />
            Date d'inscription: {profileData.joinedDate}
          </div>
        </motion.div>
      </Card.Body>
    </Card>
  )
}

export default ProfileView
