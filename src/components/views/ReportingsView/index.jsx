import React, { useContext, useState, useEffect, useCallback } from 'react'
import { UserContext } from '../../../context/userContext'
import defaultPhoto from '../../../assets/images/defaultPhoto.jpg'
import { Accordion, Card, Button } from 'react-bootstrap'
import { motion } from 'framer-motion'
import AddObservationButton from '../AddObservationButton'
import AddObservationModal from '../AddObservationModal'
import DeleteModal from '../../form/modals/DeleteModal'
import db from '../../../db/db'
import { useFormWizardState } from '../../form/context/FormWizardContext'
import useHandleSubmitClick from '../../form/hooks/useHandleSubmitClick'
import SuccessModal from '../../form/modals/SuccessModal'
import CustomToggle from './CustomToggle'
import './ReportingsView.module.css'
import ObservationDetail from './ObservationDetail'

const ReportingsView = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])
  const [activeKey, setActiveKey] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [establishmentName, setEstablishmentName] = useState('')
  const [loaded, setLoaded] = useState({})
  const { dispatch } = useFormWizardState()
  const [isLoading, setIsLoading] = useState(false)

  // Nouveaux états pour la modal de confirmation de suppression
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [observationToDelete, setObservationToDelete] = useState(null)

  const fetchObservationsFromIndexedDB = useCallback(async () => {
    if (currentUser?.uid) {
      try {
        const userObservations = await db.observations
          .where('userID')
          .equals(currentUser.uid)
          .toArray()

        userObservations.sort(
          (a, b) =>
            new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`),
        )

        const enrichedObservations = await Promise.all(
          userObservations.map(async (observation) => {
            const establishment = await db.establishments.get(
              observation.establishmentRef,
            )
            return {
              ...observation,
              establishment: establishment || {},
              photoURLs:
                observation.photoURLs && observation.photoURLs.length > 0
                  ? observation.photoURLs
                  : [defaultPhoto],
            }
          }),
        )

        setObservations(enrichedObservations)
      } catch (error) {
        console.error('Failed to fetch observations from IndexedDB:', error)
      }
    }
  }, [currentUser])

  useEffect(() => {
    fetchObservationsFromIndexedDB()
  }, [currentUser, fetchObservationsFromIndexedDB])

  const { handleSubmitClick, showModal, handleCloseModal } =
    useHandleSubmitClick(
      setIsLoading,
      setShowAddModal,
      fetchObservationsFromIndexedDB,
    )

  // Nouvelle fonction pour ouvrir la modal de confirmation
  const handleDeleteClick = (observationId) => {
    setObservationToDelete(observationId)
    setShowDeleteModal(true)
  }

  // Nouvelle fonction pour gérer la confirmation de suppression
  const handleConfirmDelete = async () => {
    try {
      await db.observations.delete(observationToDelete)
      await fetchObservationsFromIndexedDB()
      setShowDeleteModal(false)
      setObservationToDelete(null)
    } catch (error) {
      console.error('Failed to delete observation:', error)
    }
  }

  // Fonction pour fermer la modal de confirmation
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false)
    setObservationToDelete(null)
  }

  const handleImageLoaded = (urlIndex) => {
    setLoaded((prevState) => ({ ...prevState, [urlIndex]: true }))
  }

  const isImageLoaded = (urlIndex) => {
    return loaded[urlIndex]
  }

  const handleOpenAddModal = (establishmentId) => {
    setShowAddModal(true)

    db.establishments.get(establishmentId).then((est) => {
      if (est) {
        setEstablishmentName(est.establishmentName)
        dispatch({
          type: 'UPDATE_COMPANY_NAME_MODAL',
          payload: {
            companyName: est.establishmentName,
            normalizedCompanyName: est.normalizedEstablishmentName,
          },
        })
        dispatch({
          type: 'UPDATE_COMPANY_ADDRESS',
          payload: est.address,
        })
        dispatch({
          type: 'SET_COMPANY_COORDINATES',
          payload: [est.coordinates.latitude, est.coordinates.longitude],
        })

        dispatch({
          type: 'SET_ESTABLISHMENT_EXISTS',
          payload: true,
        })

        dispatch({
          type: 'SET_CURRENT_ESTABLISHMENT_ID',
          payload: establishmentId,
        })
      } else {
        setEstablishmentName('Inconnu')
        dispatch({ type: 'RESET_COMPANY_ADDRESS' })
        dispatch({ type: 'RESET_COMPANY_NAME_MODAL' })
        dispatch({
          type: 'SET_ESTABLISHMENT_EXISTS',
          payload: false,
        })
        dispatch({ type: 'SET_CURRENT_ESTABLISHMENT_ID', payload: null })
      }
    })
  }

  const observationsByEstablishment = observations.reduce((acc, obs) => {
    if (obs.establishment) {
      const key = obs.establishmentRef
      if (!acc[key]) {
        acc[key] = {
          name: obs.establishment.establishmentName,
          address: obs.establishment.address,
          observations: [],
        }
      }
      acc[key].observations.push({
        id: obs.id,
        date: obs.date,
        time: obs.time,
        photoURLs: obs.photoURLs,
        additionalNotes: obs.additionalNotes,
      })
    } else {
      console.error('Establishment details are missing for observation', obs)
    }
    return acc
  }, {})

  for (const key in observationsByEstablishment) {
    if (observationsByEstablishment[key].observations) {
      observationsByEstablishment[key].observations.sort(
        (a, b) =>
          new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`),
      )
    }
  }

  return (
    <div className="reporting-view text-light">
      <Accordion activeKey={activeKey}>
        {Object.entries(observationsByEstablishment).map(
          ([key, { name, address, observations }], index) => (
            <Card key={key} className="mb-3 bg-dark">
              <motion.div
                initial={{ x: -60 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.1 + index * 0.04, duration: 0.15 }}
                className="card-header bg-dark text-light rounded shadow"
              >
                <CustomToggle
                  eventKey={`${index}`}
                  activeKey={activeKey}
                  setActiveKey={setActiveKey}
                >
                  <h3>{name}</h3>
                  <div>{address.split(',')[0]}</div>
                </CustomToggle>
              </motion.div>
              <Accordion.Collapse eventKey={`${index}`}>
                <Card.Body className="bg-dark text-light rounded">
                  {observations.map((obs, obsIndex) => (
                    <div key={obsIndex} className="mb-3">
                      <ObservationDetail
                        observation={obs}
                        isImageLoaded={isImageLoaded}
                        handleImageLoaded={handleImageLoaded}
                      />
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(obs.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  ))}
                  <div className="text-center">
                    <AddObservationButton
                      onClick={() => handleOpenAddModal(key)}
                    />
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ),
        )}
      </Accordion>

      <AddObservationModal
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        title={`Ajouter à ${establishmentName}`}
        handleAddObservation={handleSubmitClick}
      />

      <SuccessModal show={showModal} handleClose={handleCloseModal} />

      <DeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDeleteModal}
        handleConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default ReportingsView
