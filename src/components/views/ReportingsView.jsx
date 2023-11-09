import React, { useContext, useState, useEffect } from 'react'
import { UserContext } from '../../context/userContext'
import { getObservationsForUser } from '../../services/observationService'
import { Accordion, Card, Button, useAccordionButton } from 'react-bootstrap'
import { Calendar, Clock } from 'react-bootstrap-icons'
import styles from '../styles/ReportingsView.module.css'
import { ChevronDown } from 'react-bootstrap-icons'
import { motion } from 'framer-motion'
import { getEstablishmentByRef } from '../../services/establishmentService'

const ReportingsView = () => {
  const { currentUser } = useContext(UserContext)
  const [observations, setObservations] = useState([])
  const [activeKey, setActiveKey] = useState(null)

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    return new Date(dateString).toLocaleDateString('fr-FR', options)
  }

  useEffect(() => {
    const fetchObservations = async () => {
      if (currentUser?.uid) {
        try {
          const obs = await getObservationsForUser(currentUser.uid)
          const enrichedObservations = await Promise.all(
            obs.map(async (observation) => {
              const establishmentDetails = await getEstablishmentByRef(
                observation.establishmentRef,
              )
              return { ...observation, establishment: establishmentDetails }
            }),
          )
          setObservations(enrichedObservations)
        } catch (error) {
          console.error('Failed to fetch observations:', error)
        }
      }
    }

    fetchObservations()
  }, [currentUser])

  // Group observations by establishment id
  const observationsByEstablishment = observations.reduce((acc, obs) => {
    // S'assurer que les détails de l'établissement sont présents
    if (obs.establishment) {
      const key = obs.establishmentRef // Utiliser establishmentRef comme clé
      if (!acc[key]) {
        acc[key] = {
          name: obs.establishment.establishmentName, // Utiliser directement establishmentName
          address: obs.establishment.address, // Utiliser directement l'adresse complète
          observations: [],
        }
      }
      acc[key].observations.push({
        date: obs.date,
        time: obs.time,
        photoURLs: obs.photoURLs,
        additionalNotes: obs.additionalNotes, // Si vous souhaitez inclure des notes supplémentaires
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
        <ChevronDown style={chevronStyle} />
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
                          <img
                            key={urlIndex}
                            src={url}
                            alt={`Observation ${obsIndex + 1}`}
                            className="img-fluid rounded"
                            style={{ maxWidth: '50px' }}
                          />
                        ))}
                    </div>
                  ))}
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          ),
        )}
      </Accordion>
    </div>
  )
}

export default ReportingsView
