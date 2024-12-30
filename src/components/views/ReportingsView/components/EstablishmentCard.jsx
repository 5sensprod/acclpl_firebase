// src/components/views/ReportingsView/components/EstablishmentCard.jsx
import React from 'react'
import { Card, Button } from 'react-bootstrap'
import { motion } from 'framer-motion'
import CustomToggle from '../CustomToggle'
import ObservationDetail from '../ObservationDetail'
import AddObservationButton from '../../AddObservationButton'

export const EstablishmentCard = ({
  establishment,
  index,
  activeKey,
  setActiveKey,
  observations,
  handleDeleteClick,
  handleOpenAddModal,
  isImageLoaded,
  handleImageLoaded,
}) => {
  const { key, name, address } = establishment

  return (
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
          <AddObservationButton onClick={() => handleOpenAddModal(key)} />
        </div>
      </Card.Body>
    </Card>
  )
}
