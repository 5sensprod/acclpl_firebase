import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../../context/userContext'
// import { getObservationsForUser } from '../../services/observationService'
// import { getEstablishmentByRef } from '../../services/establishmentService'
import defaultPhoto from '../../../assets/images/defaultPhoto.jpg'
import { Accordion, Card } from 'react-bootstrap'
import { motion } from 'framer-motion'
import AddObservationButton from '../AddObservationButton'
import AddObservationModal from '../AddObservationModal'
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
      console.error('Establishment details are missing for observation', obs)
    }
    return acc
  }, {})

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
                <CustomToggle
                  eventKey={`${index}`}
                  activeKey={activeKey}
                  setActiveKey={setActiveKey}
                >
                  <h3>{name}</h3>
                  <div>{address.split(',')[0]} </div>
                </CustomToggle>
              </motion.div>
              <Accordion.Collapse eventKey={`${index}`}>
                <Card.Body className="bg-dark text-light rounded">
                  {observations.map((obs, obsIndex) => (
                    <ObservationDetail
                      key={obsIndex}
                      observation={obs}
                      isImageLoaded={isImageLoaded}
                      handleImageLoaded={handleImageLoaded}
                    />
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
    </div>
  )
}

export default ReportingsView
