// src/components/views/ReportingsView/index.jsx
import React, { useState, useEffect } from 'react'
import { Accordion, Card, Button } from 'react-bootstrap'
import { motion } from 'framer-motion'
import { useFormWizardState } from '../../form/context/FormWizardContext'
import { useObservations } from './hooks/useObservations'
import { useDeleteObservation } from './hooks/useDeleteObservation'
import { useEstablishments } from './hooks/useEstablishments'
import AddObservationButton from '../AddObservationButton'
import AddObservationModal from '../AddObservationModal'
import DeleteModal from '../../form/modals/DeleteModal'
import SuccessModal from '../../form/modals/SuccessModal'
import CustomToggle from './CustomToggle'
import ObservationDetail from './ObservationDetail'
import useHandleSubmitClick from '../../form/hooks/useHandleSubmitClick'
import './ReportingsView.module.css'

const ReportingsView = () => {
  const [activeKey, setActiveKey] = useState(null)
  const [loaded, setLoaded] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  const { dispatch } = useFormWizardState()
  const { observations, fetchObservationsFromIndexedDB } = useObservations()
  const {
    showDeleteModal,
    handleDeleteClick,
    handleConfirmDelete,
    handleCloseDeleteModal,
  } = useDeleteObservation(fetchObservationsFromIndexedDB)
  const { establishmentName, handleOpenAddModal } = useEstablishments(
    observations,
    dispatch,
    setShowAddModal,
  )

  const { handleSubmitClick, showModal, handleCloseModal } =
    useHandleSubmitClick(
      setIsLoading,
      setShowAddModal,
      fetchObservationsFromIndexedDB,
    )

  const handleImageLoaded = (urlIndex) => {
    setLoaded((prevState) => ({ ...prevState, [urlIndex]: true }))
  }

  const isImageLoaded = (urlIndex) => {
    return loaded[urlIndex]
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
        observationTypes: obs.observationTypes,
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

  useEffect(() => {
    console.log('ReportingsView useEffect triggered')
    fetchObservationsFromIndexedDB()
  }, [fetchObservationsFromIndexedDB])

  // Vérifier s'il n'y a aucune observation
  const hasNoObservations = observations.length === 0

  return (
    <div className="reporting-view text-light">
      {hasNoObservations ? (
        // Message affiché quand il n'y a aucune observation
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 rounded bg-dark">
            <p className="text-xl text-light">
              Vous n'avez encore aucun signalement
            </p>
          </div>
        </div>
      ) : (
        // Affichage normal des observations
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
      )}

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
