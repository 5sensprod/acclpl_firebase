import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context/userContext'
// import { getObservationsForUser } from '../../services/observationService'
// import { getEstablishmentByRef } from '../../services/establishmentService'
import defaultPhoto from '../../assets/images/defaultPhoto.jpg'
import {
  Accordion,
  Card,
  Button,
  useAccordionButton,
  Spinner,
} from 'react-bootstrap'
import { Calendar, Clock, ChevronDown } from 'react-bootstrap-icons'
import styles from '../styles/ReportingsView.module.css'
import { motion } from 'framer-motion'
import AddObservationButton from './AddObservationButton'
import AddObservationModal from './AddObservationModal'
import { formatDate } from '../../utils/dateUtils'
import db from '../../db/db'
import { useFormWizardState } from '../form/context/FormWizardContext'
import useHandleSubmitClick from '../form/hooks/useHandleSubmitClick'
import SuccessModal from '../form/modals/SuccessModal'

const ReportingsView = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])
  const [activeKey, setActiveKey] = useState(null)

  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState(null)
  const [establishmentName, setEstablishmentName] = useState('')
  const [loaded, setLoaded] = useState({})

  const { dispatch } = useFormWizardState()

  const [isLoading, setIsLoading] = useState(false)
  const { handleSubmitClick, showModal, handleCloseModal } =
    useHandleSubmitClick(setIsLoading, setShowAddModal)

  const handleImageLoaded = (urlIndex) => {
    setLoaded((prevState) => ({ ...prevState, [urlIndex]: true }))
  }

  const isImageLoaded = (urlIndex) => {
    return loaded[urlIndex]
  }

  useEffect(() => {
    if (selectedEstablishmentId) {
      db.establishments.get(selectedEstablishmentId).then((est) => {
        setEstablishmentName(est ? est.establishmentName : 'Inconnu')
      })
    }
  }, [selectedEstablishmentId])

  const handleOpenAddModal = (establishmentId) => {
    setSelectedEstablishmentId(establishmentId)
    setShowAddModal(true)

    db.establishments.get(establishmentId).then((est) => {
      if (est) {
        setEstablishmentName(est.establishmentName)
        // Dispatchez l'action pour mettre à jour le nom et l'adresse dans le state global
        dispatch({
          type: 'UPDATE_COMPANY_NAME_MODAL',
          payload: {
            companyName: est.establishmentName,
            normalizedCompanyName: est.normalizedEstablishmentName, // Supposons que vous avez cette donnée
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
        // Si l'établissement est inconnu, réinitialisez les données dans le state global
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

  useEffect(() => {
    const fetchObservationsFromIndexedDB = async () => {
      if (currentUser?.uid) {
        try {
          // Récupérer les observations de l'utilisateur depuis IndexedDB
          const userObservations = await db.observations
            .where('userID')
            .equals(currentUser.uid)
            .toArray()

          // Enrichir les observations avec les détails de l'établissement
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
    }

    fetchObservationsFromIndexedDB()
  }, [currentUser])

  // Group observations by establishment id
  const observationsByEstablishment = observations.reduce((acc, obs) => {
    // S'assurer que les détails de l'établissement sont présents
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
        date: obs.date,
        time: obs.time,
        photoURLs: obs.photoURLs,
        additionalNotes: obs.additionalNotes,
      })
    } else {
      // Si les détails de l'établissement ne sont pas inclus dans l'observation, vous devrez gérer ce cas.
      console.error('Establishment details are missing for observation', obs)
    }
    return acc
  }, {})

  // Function to create a custom accordion toggle
  function CustomToggle({ children, eventKey }) {
    const decoratedOnClick = useAccordionButton(eventKey, () => {
      setActiveKey((prevKey) => (prevKey === eventKey ? null : eventKey))
    })

    const isCurrentEventKeyActive = activeKey === eventKey

    const chevronStyle = {
      transform: isCurrentEventKeyActive ? 'rotate(180deg)' : 'none',
      transition: 'transform 0.3s ease',
    }

    return (
      <Button
        variant="link"
        onClick={decoratedOnClick}
        className={`text-start ${styles.customToggle}`}
        aria-expanded={isCurrentEventKeyActive}
      >
        <span>{children}</span>
        <ChevronDown
          size={24}
          className="bg-primary rounded p-1"
          style={chevronStyle}
        />
      </Button>
    )
  }

  return (
    <div className="reporting-view text-light">
      <Accordion activeKey={activeKey}>
        {Object.entries(observationsByEstablishment).map(
          ([key, { name, address, observations }], index) => (
            <Card key={key} className="mb-3 bg-dark ">
              <motion.div
                initial={{ x: -60 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.1 + index * 0.04, duration: 0.15 }}
                className="card-header bg-dark text-light rounded shadow"
              >
                <CustomToggle eventKey={`${index}`}>
                  <h3>{name}</h3>
                  <div>{address.split(',')[0]} </div>
                </CustomToggle>
              </motion.div>
              <Accordion.Collapse eventKey={`${index}`}>
                <Card.Body className="bg-dark text-light rounded">
                  {observations.map((obs, obsIndex) => (
                    <div
                      key={obsIndex}
                      className="d-flex align-items-center justify-content-between mb-3"
                    >
                      <div className="flex-grow-1 d-flex flex-column">
                        <div className="mb-1">
                          <Calendar size="18" className="me-2" />
                          <span>{formatDate(obs.date)}</span>
                        </div>
                        <div>
                          <Clock size="18" className="me-2" />
                          <span>{obs.time}</span>
                        </div>
                      </div>
                      {obs.photoURLs &&
                        obs.photoURLs.map((url, urlIndex) => (
                          <div
                            key={urlIndex}
                            style={{ width: '50px', height: '50px' }}
                          >
                            {!isImageLoaded(urlIndex) && (
                              <Spinner animation="border" />
                            )}
                            <img
                              src={url}
                              alt={`Observation ${obsIndex + 1}`}
                              className="img-fluid rounded"
                              style={{
                                maxWidth: '50px',
                                display: isImageLoaded(urlIndex)
                                  ? 'block'
                                  : 'none',
                              }}
                              onLoad={() => handleImageLoaded(urlIndex)}
                            />
                          </div>
                        ))}
                    </div>
                  ))}
                  <div className="text-center">
                    <AddObservationButton
                      onClick={() => handleOpenAddModal(key)}
                    />
                    <AddObservationModal
                      isLoading={isLoading}
                      setIsLoading={setIsLoading}
                      show={showAddModal}
                      onHide={() => setShowAddModal(false)}
                      title={`Ajouter à ${establishmentName}`}
                      handleAddObservation={handleSubmitClick}
                    />
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ),
        )}
      </Accordion>
      <SuccessModal show={showModal} handleClose={handleCloseModal} />
    </div>
  )
}

export default ReportingsView
